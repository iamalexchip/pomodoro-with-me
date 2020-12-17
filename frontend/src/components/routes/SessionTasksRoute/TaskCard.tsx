import { FC } from "react";
import { Draggable, DraggableProvided } from "react-beautiful-dnd";
import { Task } from "common";

interface CiTaskCard {
  task: Task;
}

const TaskCard: FC<CiTaskCard> = ({ task }) => (
  <Draggable draggableId={task.id} index={task.position}>
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
