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
  async getSession(@Arg("name") name: string) {
    return await SessionService.findOrFail({ name });
  };

  @Mutation(_returns => Session)
  async createSession(@Arg("name") name: string) {
    const sessionExists = await SessionModel.findOne({ name });
    if(sessionExists) throw new ApolloError('Session already exists', 'DUPLICATE_SESSION');
    const session = new SessionModel(
      {
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
  async updateSession(@Args() { name, isModerated, isOpen }: UpdateSessionArgs) {
    const session = await SessionService.findOrFail({ name });
    session.isModerated = (isModerated === undefined) ? session.isModerated : isModerated;
    session.isOpen = (isOpen === undefined) ? session.isOpen : isOpen;

    return await session.save();
  };

  @Mutation(_returns => Session)
  async toggleSession(@Args() { name, status }: ToggleSessionArgs) {
    const session = await SessionService.findOrFail({ name });

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
  async deleteSession(@Arg("name") name: string) {
    await SessionService.findOrFail({ name });
    await SessionModel.deleteOne({ name });
    return true;
  };
}
