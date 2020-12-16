import { FC } from "react";
import { Draggable, DraggableProvided } from "react-beautiful-dnd";
import { Task } from "common";

interface CiTaskCard {
  task: Task;
  index: number;
}

const TaskCard: FC<CiTaskCard> = ({ task, index }) => (
  <Draggable draggableId={task.id} index={index}>
    {(provided: DraggableProvided) => (
      <div
        className="list-item"
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
      >
        {task.title}
      </div>
    )}
  </Draggable>
)

export default TaskCard;
