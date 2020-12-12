import { ApolloError } from "apollo-server-express";
import { Resolver, Mutation, Arg, Query } from "type-graphql";
import { Session, SessionModel } from "../models/Session";
import { SessionInput } from "./types/SessionTypes";

@Resolver()
export class SessionResolver {

  @Query(_returns => Session, { nullable: false})
  async getSession(@Arg("id") id: string){
    return await SessionModel.findById({_id:id});
  };

  @Mutation(() => Session)
  async createSession(@Arg("data") {name}: SessionInput): Promise<Session> {
    const sessionExists = await SessionModel.findOne({ name });
    if(sessionExists) throw new ApolloError('Session already exists', 'DUPLICATE_SESSION');
    const session = new SessionModel({ name })
    return await session.save();
  };
}
