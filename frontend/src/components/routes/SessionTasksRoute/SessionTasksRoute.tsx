import { useMutation, useQuery } from '@apollo/client';
import { useParams } from "react-router-dom";
import { Session, Task } from "common";
import SessionTemplate from "../../templates/SessionTemplate";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import TaskList from "./TaskList";
import {
  IRESULT_SESSION_TASKS_ROUTE,
  IVARS_SESSION_TASKS_ROUTE,
  SESSION_TASKS_ROUTE,
  IVARS_UPDATE_TASK,
  UPDATE_TASK
} from "../../../constants/graphql";
import { useEffect } from "react";
import { useState } from "react";
import { filtertasks, reorderTasks } from '../../../utils/taskUtils';

interface IParams {
  sessionId: string
}

const SessionTasksRoute = () => {
  const { sessionId } = useParams<IParams>();
  const {
    loading: isfetchingSessionTasks,
    error: fetchSessionTasksError,
    data: fetchSessionTasksResult,
    refetch: refetchSessionTask
  } = useQuery<IRESULT_SESSION_TASKS_ROUTE, IVARS_SESSION_TASKS_ROUTE>(
    SESSION_TASKS_ROUTE,
    { variables: { session: sessionId }}
  );
  const [
    updateTask,
    { loading: isUpdatingTask, error: updateTaskError, data: updateTaskResult }
  ] = useMutation<Session, IVARS_UPDATE_TASK>(UPDATE_TASK);
  const [session, setSession] = useState<Session | null>(null);
  const [tasks, setTasks] = useState<Task[] | null>([]);

  // Set state to fetched data 
  useEffect(() => {
    if (fetchSessionTasksResult) {
      setSession(fetchSessionTasksResult.session);
      setTasks(fetchSessionTasksResult.tasks);
    }
  }, [fetchSessionTasksResult])
  
  // Update task error display
  useEffect(() => {
    if (updateTaskError) alert(updateTaskError);
    if (fetchSessionTasksError) alert(fetchSessionTasksError);
  }, [updateTaskError, fetchSessionTasksError]);

  // save task positions in DB
  useEffect(() => {
    refetchSessionTask();
  }, [updateTaskResult]);

  // Loading screen 
  if (!session || !tasks) return <div>Loading tasks...</div>;
  // End Loading screen

  const { columns } = session;
  
  const onDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const [taskId, columnId, position] = [draggableId, destination.droppableId, destination.index];
    // save the tasks
    setTasks(reorderTasks(tasks, taskId, columnId, position));
    // save to database
    updateTask({
      variables: {
        id: taskId,
        column: columnId,
        position
      }
    });
  }

  return (
    <SessionTemplate session={session}>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="lists">
          {columns.map((column) =>
            <TaskList
              key={column.id}
              column={column}
              tasks={filtertasks(tasks.filter((task) => task.column === column.id))}
            />
          )}
        </div>
      </DragDropContext>
    </SessionTemplate>
  )
}

export default SessionTasksRoute;
