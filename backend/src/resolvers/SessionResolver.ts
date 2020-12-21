import { ApolloError } from "apollo-server-express";
import { Resolver, Mutation, Arg, Query, Args } from "type-graphql";
import { Session, SessionModel } from "common";
import { UpdateSessionArgs, ToggleSessionArgs } from "common";
import * as SessionService from "../services/SessionService";
import { clearTasks, startTasks, stopTasks, } from "../services/TaskService";

@Resolver()
export class SessionResolver {
  
  @Query(_returns => [Session])
  async listSessions() {
    return await SessionModel.find({ isOpen: true });
  };

  @Query(_returns => Session, { nullable: true })
  async getSession(@Arg("slug") slug: string) {
    return await SessionService.findOrFail({ slug });
  };

  @Mutation(_returns => Session)
  async createSession(@Arg("slug") slug: string, @Arg("name") name: string) {
    const sessionExists = await SessionModel.findOne({ slug });
    if(sessionExists) throw new ApolloError(
      `Session with slug [${slug}] already exists`,
      'DUPLICATE_SESSION'
    );
    const session = new SessionModel(
      {
        slug,
        name,
        columns: [
          { position: 1, isFocus: false, label: 'Todo' },
          { position: 2, isFocus: true, label: 'Working on' },
          { position: 3, isFocus: false, label: 'Done' }
        ]
      }
    );
    return await session.save();
  };

  @Mutation(_returns => Session)
  async updateSession(@Args() { slug, name, isModerated, isOpen }: UpdateSessionArgs) {
    const session = await SessionService.findOrFail({ slug });
    if (name !== undefined) session.name = name;
    if (isModerated !== undefined) session.isModerated = isModerated;
    if (isOpen !== undefined) session.isOpen;

    return await session.save();
  };

  @Mutation(_returns => Session)
  async toggleSession(@Args() { slug, status }: ToggleSessionArgs) {
    const session = await SessionService.findOrFail({ slug });

    if (session.status === status) {
      throw new ApolloError(`Session status is already set to [${status}]`, 'SESSION_DESYNC');
    }

    if (status === 'unbegun') {
      session.timesheet = [];
      session.end = null;
      clearTasks(session)
      // todo: notify(reset)

    } else {
      if (session.status === 'done') {
        throw new ApolloError('The session has already been completed', 'SESSION_ALREADY_COMPLETED');
      }
    }

    if (status === 'pomodoro') {
      if (session.status === 'unbegun') {
        // todo: notify('start): emails etc
      } else {
        // notify('continue')// run async
      }

      session.timesheet.push({ start: new Date });
      startTasks(session);
    }

    if (status === 'break' || status === 'done') {
      // todo: notify('break')
      const lastTimeEntry = session.timesheet[session.timesheet.length - 1];
      lastTimeEntry.end = new Date();
      stopTasks(session);
    }
    
    if (status === 'done') {
      session.end = new Date();
      // todo: notify(done) emails etc
    }

    session.status = status;

    return await session.save();
  };

  @Mutation(_returns => Boolean, { nullable: true })
  async deleteSession(@Arg("slug") slug: string) {
    await SessionService.findOrFail({ slug });
    await SessionModel.deleteOne({ slug });
    return true;
  };
}
