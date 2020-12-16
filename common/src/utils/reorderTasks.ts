import { Task } from "../entities/TaskEntity";

interface IreorderTasks {
  tasks: Task[];
  taskId: string;
  columnId: string;
  position: number;
}

export const reorderTasks = ({ tasks, taskId, columnId, position }: IreorderTasks) => {
  //const targetTask = tasks.find((task) => task.id);
  return tasks;
}
