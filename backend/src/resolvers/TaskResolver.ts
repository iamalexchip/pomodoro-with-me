import { Task, TaskModel } from "../entities/Task";
import { Resolver, Mutation, Arg, Query, Args } from "type-graphql";
import { CreateTaskArgs, UpdateTaskArgs } from "./types/TaskTypes";
import * as SessionService from "../services/SessionService";
import * as TaskService from "../services/TaskService";
import { ApolloError } from "apollo-server-express";

@Resolver()
export class TaskResolver {
  @Query(_returns => [Task])
  async listTasks(@Arg("session") name: string) {
    const session = await SessionService.findOrFail({ name });
    return await TaskModel.find({ session: session.id }).populate("session");
  };

  @Mutation(() => Task)
  async createTask(@Args() { session: name, title, column }: CreateTaskArgs) {
    const session = await SessionService.findOrFail({ name });
    const task = new TaskModel(
      {
        session: session,
        column,
        title
      }
    );

    if (session.status === "pomodoro" && session.columns.id(column).isFocus) {
      task.timesheet = [{ start: new Date() }];
    }

    await task.save();

    return task;
  };

  @Mutation(() => Task)
  async updateTask(@Args() { id, title, column }: UpdateTaskArgs) {
    const task = await TaskService.findOrFail(id);
    const session = task.session;

    if (title) task.title = title;
    
    if (column && column !== task.column) {
      const previousColumn = session.columns.id(task.column);
      const targetColumn = session.columns.id(column);
      
      if (!targetColumn) {
        throw new ApolloError(
          `Column [${column}] was not found in sesssion [${session.name}]`,
          "COLUMN_NOT_FOUND"
        );
      }

      if (session.status === "pomodoro") {
        if (previousColumn.isFocus && !targetColumn.isFocus) {
          const lastTimeEntry = task.timesheet[task.timesheet.length - 1];
          lastTimeEntry.end = new Date();
        }
        
        if (!previousColumn.isFocus && targetColumn.isFocus) {
          task.timesheet.push({ start: new Date() });
        }
      }

      task.column = column;
    }

    return task.save();
  };

  @Mutation(_returns => Boolean, { nullable: true })
  async deleteTask(@Arg("id") id: string){
    await TaskService.findOrFail(id);
    await TaskModel.findByIdAndDelete(id);
    return true;
  };
}
