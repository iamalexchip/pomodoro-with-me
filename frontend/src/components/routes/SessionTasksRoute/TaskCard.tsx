import { FC } from "react";
import { Draggable, DraggableProvided } from "react-beautiful-dnd";

interface CiTaskCard {
  task: any;
  index: number;
}

const TaskCard: FC<CiTaskCard> = ({ task, index }) => (
  <Draggable draggableId={task.id} index={index}>
    {(provided: DraggableProvided) => (
      <li
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
      >
      Lorem ipsum dolor sit amet</li>
    )}
  </Draggable>
)

export default TaskCard;
