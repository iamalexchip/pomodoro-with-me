import { ApolloError } from "apollo-server-express";
import { Resolver, Mutation, Arg, Query, Args } from "type-graphql";
import { Session, SessionModel, SessionStatus } from "../entities/Session";
import { UpdateSessionArgs, ToggleSessionArgs } from "./types/SessionTypes";
import * as SessionService from "../services/SessionService";

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

  @Mutation(() => Session)
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

  @Mutation(() => Session)
  async updateSession(@Args() { name, isModerated, isOpen }: UpdateSessionArgs) {
    const session = await SessionService.findOrFail({ name });
    session.isModerated = (isModerated === undefined) ? session.isModerated : isModerated;
    session.isOpen = (isOpen === undefined) ? session.isOpen : isOpen;

    return await session.save();
  };

  @Mutation(() => Session)
  async toggleSession(@Args() { name, status }: ToggleSessionArgs) {
    const session = await SessionService.findOrFail({ name });

    if (status === 'unbegun') {
      // notify(reset)
      // Tasks.clear(session)
      session.start = null;
      session.end = null;

    } else {
      if (session.status === 'done') {
        throw new ApolloError('The session has already been completed', 'SESSION_ALREADY_COMPLETED');
      }
    }

    if (status === 'pomodoro') {
      if (session.status === 'unbegun') {
        // todo: notify('start): emails etc
        session.start = new Date();
      } else {
        // notify('continue')// run async
      }

      // todo: Tasks.start(session);
    }

    if (status === 'break') {
      // todo: notify('break')
      // todo: Tasks.stop(session)
    }

    if (status === 'done') {
      session.end = new Date();
      // todo: notify(done) emails etc
      // todo: Tasks.stop(session)
    }

    session.status = status;

    return await session.save();
  };

  @Mutation(_returns => Boolean, { nullable: true })
  async deleteSession(@Arg("name") name: string){
    await SessionService.findOrFail({ name });
    await SessionModel.deleteOne({ name });
    return true;
  };
}
