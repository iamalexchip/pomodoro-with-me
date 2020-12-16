import { FC } from "react";
import { Droppable, DroppableProvided } from 'react-beautiful-dnd';
import TaskCard from "./TaskCard";

interface CiColumn {
  column: any;
}

const TaskList: FC<CiColumn> = ({ column }) => (
  <Droppable droppableId={column.id}>
    {(provided:DroppableProvided) => (
      <div className="list">
        <header>List header</header>
        <ul
          ref={provided.innerRef}
          {...provided.droppableProps}
        >
          <TaskCard task={{ id: "sddw" }} index={0} />
          <TaskCard task={{ id: "sddt" }} index={1}/>
          {provided.placeholder}
        </ul>
        <footer>Add a card...</footer>
      </div>
    )}
  </Droppable>
);

export default TaskList;
