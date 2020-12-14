import { ApolloError } from "apollo-server-express";
import { Task, TaskModel } from "../entities/Task";

export const findOrFail = async(id: string) => {
  const task = await TaskModel.findById(id).populate('session');
  if(!task) throw new ApolloError('Task not found', 'TASK_NOT_FOUND');
  if(!task.session.name) throw new ApolloError('Session not found', 'ORPHANED_TASK');

  // todo: check if has can edit task

  return task;
}
