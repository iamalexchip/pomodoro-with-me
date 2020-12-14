import { ApolloError } from "apollo-server-express";
import { Session, SessionModel } from "../entities/Session";

export const findOrFail = async(filter: { id?: string, name?: string }) => {
  const session = await SessionModel.findOne(filter);
  if(!session) throw new ApolloError('Session not found', 'SESSION_NOT_FOUND');
  // todo: check if user has access to session

  return session;
}