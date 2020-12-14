import { ApolloError } from "apollo-server-express";
import { Session } from "inspector";
import { TaskModel } from "../entities/Task";

export const findOrFail = async(id: string) => {
  const task = await TaskModel.findById(id).populate('session');
  if(!task) throw new ApolloError('Task not found', 'TASK_NOT_FOUND');
  if(!task.session.name) throw new ApolloError('Session not found', 'ORPHANED_TASK');

  // todo: check if has can edit task

  return task;
}

export const startTasks = async(session: any, column?: string) => {
  column;
  const tasks = await TaskModel.find({ session: session.id });

  tasks.map(async(task: any) => {
    if (session.columns.id(task.column).isFocus) {
      task.timesheet.push({ start: new Date() });
      await task.save();
    }
  });
}

export const stopTasks = async(session: any, column?: string) => {
  column;
  const tasks = await TaskModel.find({ session: session.id });
  
  tasks.map(async(task: any) => {
    if (session.columns.id(task.column).isFocus) {
      const lastTimeEntry = task.timesheet[task.timesheet.length - 1];
      lastTimeEntry.end = new Date();
      await task.save();
    }
  });
}

export const clearTasks = async(session: any) => {
  const tasks = await TaskModel.find({ session: session.id });
  
  tasks.map(async(task: any) => {
    task.timesheet = [];
    task.save();
  })
}
