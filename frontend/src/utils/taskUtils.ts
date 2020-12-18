import { Task } from "common";

const reorderInColumn = (
  tasks: Task[],
  targetId: string,
  positionFrom: number,
  positionTo: number
) => {
  return tasks.map((task) => {
    if (task.id === targetId) {// if current task is target task
      task.position = positionTo;
      return task;
    }
    
    if (
      positionTo > positionFrom &&// target moved down
      positionFrom < task.position &&// current comes after target old position
      task.position <= positionTo// current is equal to or comes before target new position
    ) {
      task.position--;
      return task;
    }
    
    if (
      positionTo < positionFrom &&// target moved up
      positionFrom > task.position &&// current comes before target old position
      task.position >= positionTo// current is equal to or comes after target new position
    ) {
        task.position++;
        return task;
    }

    return task;// no change required
  });
};

export const reorderTasks = (
  currentTasks: Task[],
  targetId: string,
  columnId: string,
  positionTo: number
) => {
  let tasks = currentTasks
  .map((task, index) => ({ ...task, dataIndex: index }))
  const targetTask = tasks.find((task) => task.id === targetId);
  
  if (!targetTask) {
    console.error('taskUtils:reorderTasks: TargetTask not found');
    return tasks;
  }

  const targetTaskData = { ...targetTask };
  
  if (targetTaskData.column === columnId) {// task was moved to new position in same column
    const columnTasks = tasks.filter((task) => task.column === columnId);
    reorderInColumn(columnTasks, targetId, targetTaskData.position, positionTo);

  } else {
    
    // get columns data
    let oldColumn = tasks
      .filter((task) => task.id !== targetId && task.column === targetTaskData.column)
      .sort((a, b) => a.position - b.position);
    let newColumn = tasks.filter((task) => task.column === columnId);
    
    // re-index old column
    for (let index = 0; index < oldColumn.length; index++) {
      const dataIndex = oldColumn[index].dataIndex;
      tasks[dataIndex].position = index;
    }

    // add task to new column
    newColumn.push({ ...targetTaskData, column: columnId, position: newColumn.length });
    const targetDataInNewColumn = newColumn.find((task) => task.id === targetId);

    if (!targetDataInNewColumn) {
      console.error("taskUtils:reorderTasks: TargetTask was not added to new column");
      console.log({targetId, columnId, oldColumn, newColumn, tasks})
      return tasks;
    }

    // reorder new column based [positionTo]
    reorderInColumn(newColumn, targetId, newColumn.length - 1, positionTo);

    // update target task data in tasks array 
    targetTask.column = columnId;
    targetTask.position = targetDataInNewColumn.position;
  }

  return tasks;
}

export const filtertasks = (tasks: Task[]) => {
  return tasks
      .sort((a, b) => a.position - b.position)
}

