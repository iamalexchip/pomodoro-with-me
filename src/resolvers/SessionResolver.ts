import { ApolloError } from "apollo-server-express";
import { Resolver, Mutation, Arg, Query, Args } from "type-graphql";
import { Session, SessionModel, SessionStatus } from "../entities/Session";
import { UpdateSessionArgs, ToggleSessionArgs } from "./types/SessionTypes";

@Resolver()
export class SessionResolver {
  
  @Query(_returns => [Session])
  async listSessions() {
    return await SessionModel.find({ isOpen: true });
  };

  @Query(_returns => Session, { nullable: true })
  async getSession(@Arg("name") name: string){
    return await SessionModel.findOne({ name });
  };

  @Mutation(() => Session)
  async createSession(@Arg("name") name: string) {
    const sessionExists = await SessionModel.findOne({ name });
    if(sessionExists) throw new ApolloError('Session already exists', 'DUPLICATE_SESSION');
    const session = new SessionModel(
      {
        name,
        columns: [
          { position: 1, label: 'Todo' },
          { position: 2, label: 'Working on' },
          { position: 3, label: 'Done' }
        ]
      }
    );
    return session.save();
  };

  @Mutation(() => Session)
  async updateSession(@Args() { name, isModerated, isOpen }: UpdateSessionArgs) {
    const session = await SessionModel.findOne({ name });
    if(!session) throw new ApolloError('Session not found', 'SESSION_NOT_FOUND');
    
    session.isModerated = (isModerated === undefined) ? session.isModerated : isModerated;
    session.isOpen = (isOpen === undefined) ? session.isOpen : isOpen;

    return await session.save();
  };

  @Mutation(() => Session)
  async toggleSession(@Args() { name, status }: ToggleSessionArgs) {
    const session = await SessionModel.findOne({ name });
    if(!session) throw new ApolloError('Session not found', 'SESSION_NOT_FOUND');

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
    const session = await SessionModel.findOne({ name });
    if(!session) throw new ApolloError('Session not found', 'SESSION_NOT_FOUND');
    await SessionModel.deleteOne({ name });
    return true;
  };
}
