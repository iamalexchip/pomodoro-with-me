import { ApolloError } from "apollo-server-express";
import { startTasks, stopTasks } from "../services/TaskService";
import { Resolver, Mutation, Arg, Args } from "type-graphql";
import {
  Session,
  SessionColumn,
  SessionModel,
  CreateColumnArgs,
  UpdateColumnArgs,
  DeleteColumnArgs
} from "common";

@Resolver()
export class ColumnResolver {

  @Mutation(() => Session)
  async createColumn(@Args() { session: name, label }: CreateColumnArgs) {
    const session = await SessionModel.findOne({ name });
    if(!session) throw new ApolloError('Session not found', 'SESSION_NOT_FOUND');
    session.columns.push({ position: session.columns.length + 1, label });
    return await session.save();
  };

  @Mutation(() => Session)
  async updateColumn(@Args() { session: name, id, label, position, isFocus }: UpdateColumnArgs) {
    const session = await SessionModel.findOne({ name });
    if(!session) throw new ApolloError('Session not found', 'SESSION_NOT_FOUND');
    const column = session.columns.id(id);
    if (!column) throw new ApolloError('Column not found on session', 'COLUMN_NOT_FOUND');
    if (label) column.label = label;
    
    if (session.status === "pomodoro" && isFocus !== undefined && column.isFocus !== isFocus) {
      column.isFocus = isFocus;
      
      if (isFocus) {
        startTasks(session, column.id);
      } else {
        stopTasks(session, column.id);
      }
    }
    
    if (position && column.position != position) {
      const columnToSwap = session.columns.find((sessionColumn: SessionColumn) =>
        sessionColumn.position === position);
        
      if (!columnToSwap) throw new ApolloError('Invalid target position', 'COLUMN_MOVE_ERROR');

      columnToSwap.position = column.position;
      column.position = position;
    }

    return await session.save();
  };

  @Mutation(_returns => Session, { nullable: true })
  async deleteColumn(@Args() { session: name, id }: DeleteColumnArgs){
    const session = await SessionModel.findOne({ name });
    if(!session) throw new ApolloError('Session not found', 'SESSION_NOT_FOUND');
    const column = session.columns.id(id);
    if (!column) throw new ApolloError('Column not found on session', 'COLUMN_NOT_FOUND');
    column.remove();

    // reset column positions
    session.columns
      .sort((a: SessionColumn, b: SessionColumn) => a.position - b.position)
      .map((column: SessionColumn, index: number) => {
        column.position = index + 1;
      });

    // todo: Task.delete(column.id)

    return await session.save();
  };
}
