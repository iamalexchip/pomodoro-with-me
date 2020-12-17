import { FC } from "react";
import { SessionColumn, Task } from "common";
import { Droppable, DroppableProvided } from 'react-beautiful-dnd';
import TaskCard from "./TaskCard";

interface CiTaskList {
  column: SessionColumn;
  tasks: Task[];
}

const TaskList: FC<CiTaskList> = ({ column, tasks  }) => {
  return (
    <Droppable droppableId={column.id}>
      {(provided:DroppableProvided) => (
        <div className="list">
          <header>{column.label}</header>
          <div
            className="list-container"
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {tasks.map((task) =>
              <TaskCard key={task.id} task={task} />
            )}
            {provided.placeholder}
          </div>
          <footer>Add a card...</footer>
        </div>
      )}
    </Droppable>
  )
};

export default TaskList;
