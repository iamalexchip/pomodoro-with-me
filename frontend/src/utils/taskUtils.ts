import { Task } from "common";

interface IreorderTasks {
  tasks: Task[];
  taskId: string;
  columnId: string;
  position: number;
}

export const reorderTasks = ({ tasks: currentTasks, taskId, columnId, position: positionTo }: IreorderTasks) => {
  let tasks = currentTasks.map((task) => ({ ...task }));
  const targetTask = tasks.find((task) => task.id === taskId);
  if (!targetTask) return tasks;
  
  if (targetTask.column === columnId) {
    const positionFrom = targetTask.position;
    
    return tasks.map((task) => {
      // if current task is target task
      if (task.id === taskId) {
        task.position = positionTo;
        return task;
      }
      
      if (
        positionTo > positionFrom && // target moved down
        positionFrom < task.position && // current comes after target old position
        task.position <= positionTo // current is equal to or comes before target new position
      ) {
        task.position--;
        return task;
      }
      
      if (
        positionTo < positionFrom && // target moved up
        task.position < positionFrom && // current comes before target old position
        task.position >= positionTo // current is equal to or comes after target new position
      ) {
          task.position++;
          return task;
      }

      // no change required
      return task;
    });
  }

  return currentTasks;
}

export const filtertasks = (tasks: Task[]) => {
  return tasks
      .sort((a, b) => a.position - b.position)
}

