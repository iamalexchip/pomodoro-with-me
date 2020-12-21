import { Task, TaskModel } from "common";
import { Resolver, Mutation, Arg, Query, Args } from "type-graphql";
import { CreateTaskArgs, UpdateTaskArgs } from "common";
import * as SessionService from "../services/SessionService";
import * as TaskService from "../services/TaskService";
import { ApolloError } from "apollo-server-express";

@Resolver()
export class TaskResolver {
  @Query(_returns => [Task])
  async listTasks(@Arg("session") slug: string) {
    const session = await SessionService.findOrFail({ slug });
    return await TaskModel.find({ session: session.id }).populate("session");
  };

  @Mutation(_returns => Task)
  async createTask(@Args() { session: slug, title, column }: CreateTaskArgs) {
    const session = await SessionService.findOrFail({ slug });
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

  @Mutation(_returns => Task)
  async updateTask(@Args() { id, title, column, position }: UpdateTaskArgs) {
    const task = await TaskService.findOrFail(id);
    const session = task.session;

    if (title) task.title = title;
    if (column === undefined || position === undefined) return task.save();
    
    await TaskService.moveTask(task.id, column, position);

    return await TaskModel.findById(id);
    
    const previousColumn = session.columns.id(task.column);
    const targetColumn = session.columns.id(column);
    
    if (!targetColumn) {
      throw new ApolloError(
        `Target column [${column}] was not found in sesssion [${session.slug}]`,
        "COLUMN_NOT_FOUND"
      );
    }

    // only make changes to timesheet when session is in a pomodoro
    if (session.status !== "pomodoro") return task.save();

    if (previousColumn.isFocus && !targetColumn.isFocus) {
      const lastTimeEntry = task.timesheet[task.timesheet.length - 1];
      lastTimeEntry.end = new Date();
    }
    
    if (!previousColumn.isFocus && targetColumn.isFocus) {
      task.timesheet.push({ start: new Date() });
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
