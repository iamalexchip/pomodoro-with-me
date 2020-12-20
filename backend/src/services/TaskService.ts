import { ApolloError } from "apollo-server-express";
import { Task, TaskModel } from "common";

export const findOrFail = async(id: string) => {
  const task = await TaskModel.findById(id).populate('session');
  if(!task) throw new ApolloError('Task not found', 'TASK_NOT_FOUND');
  if(!task.session.name) throw new ApolloError('Session not found', 'ORPHANED_TASK');

  // todo: check if can edit task

  return task;
}

export const startTasks = async(session: any, column?: string) => {
  let taskFilter: { session: any, column?: string } = { session: session.id };
  if (column) taskFilter.column = column;
  const tasks = await TaskModel.find(taskFilter);

  tasks.map(async(task: any) => {
    if (column || session.columns.id(task.column).isFocus) {
      task.timesheet.push({ start: new Date() });
      await task.save();
    }
  });
}

export const stopTasks = async(session: any, column?: string) => {
  let taskFilter: { session: any, column?: string } = { session: session.id };
  if (column) taskFilter.column = column;
  const tasks = await TaskModel.find(taskFilter);
  
  tasks.map(async(task: any) => {
    if (column || session.columns.id(task.column).isFocus) {
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

const reorderInColumn = (
  tasks: Task[],
  targetId: string,
  positionFrom: number,
  positionTo: number
): void => {
  tasks.map(async(task) => {
    if (task.id === targetId) {// if current task is target task
      await TaskModel.findByIdAndUpdate(task.id, { position: positionTo });
      return;
    }
    
    if (
      positionTo > positionFrom &&// target moved down
      positionFrom < task.position &&// current comes after target old position
      task.position <= positionTo// current is equal to or comes before target new position
    ) {
      await TaskModel.findByIdAndUpdate(task.id, { position: task.position - 1 });
      return task;
    }
    
    if (
      positionTo < positionFrom &&// target moved up
      positionFrom > task.position &&// current comes before target old position
      task.position >= positionTo// current is equal to or comes after target new position
    ) {
      await TaskModel.findByIdAndUpdate(task.id, { position: task.position + 1 });
      return;
    }

    return task;// no change required
  });
};

export const moveTask = async(
  targetId: string,
  columnId: string,
  positionTo: number
) => {
  const tasks: Task[] = await TaskModel.find();
  const targetTask = tasks.find((task) => task.id === targetId);
  
  if (!targetTask) {
    console.log("TaskService:moveTask: TargetTask not found");
    return;
  }
  
  if (targetTask.column === columnId) {// task was moved to new position in same column
    if (targetTask.position === positionTo) {
      console.log("TaskService:moveTask: TargetTask not moved");
      return;
    };// task was not moved
    const columnTasks = tasks.filter((task) => task.column === columnId);
    reorderInColumn(columnTasks, targetId, targetTask.position, positionTo);
    return;
  }
    
  // get columns data
  let oldColumn = tasks
    .filter((task) => task.id !== targetId && task.column === targetTask.column)
    .sort((a, b) => a.position - b.position);
  
  // re-index old column
  oldColumn.map(async(task, index) => {
    await TaskModel.findByIdAndUpdate(task.id, { position: index });
  });
  
  const newColumn = tasks.filter((task) => task.id === targetId || task.column === columnId);
  
  // reorder new column based [positionTo]
  reorderInColumn(newColumn, targetId, newColumn.length - 1, positionTo);

  await TaskModel.findByIdAndUpdate(targetTask.id, { column: columnId });
}

export const filtertasks = (tasks: Task[]) => {
  return tasks
      .sort((a, b) => a.position - b.position)
}
