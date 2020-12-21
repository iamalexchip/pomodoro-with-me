import { useMutation, useQuery } from '@apollo/client';
import { useParams } from "react-router-dom";
import { Session, Task } from "common";
import SessionTemplate from "../../templates/SessionTemplate";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import TaskList from "./TaskList";
import {
  IRESULT_GET_SESSION,
  IVARS_GET_SESSION,
  GET_SESSION,
  IRESULT_GET_TASKS,
  IVARS_GET_TASKS,
  GET_TASKS,
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
    loading: isfetchingSession,
    error: fetchSessionError,
    data: fetchSessionResult,
    refetch: refetchSession
  } = useQuery<IRESULT_GET_SESSION, IVARS_GET_SESSION>(
    GET_SESSION,
    { variables: { session: sessionId }}
  );
  const {
    loading: isfetchingTasks,
    error: fetchTasksError,
    data: fetchTasksResult,
    refetch: refetchTasks
  } = useQuery<IRESULT_GET_TASKS, IVARS_GET_TASKS>(
    GET_TASKS,
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
    if (fetchSessionResult) {
      setSession(fetchSessionResult.session);
    }

    if (fetchTasksResult) {
      setTasks(fetchTasksResult.tasks);
    }
  }, [fetchSessionResult, fetchTasksResult])
  
  // Update task error display
  useEffect(() => {
    if (updateTaskError) alert(updateTaskError);
    if (fetchSessionError) alert(fetchSessionError);
  }, [updateTaskError, fetchSessionError]);

  // refecth tasks from DB
  useEffect(() => {
    if (updateTaskResult) refetchTasks();
  }, [updateTaskResult]);

  // Loading screen 
  if (!session || !tasks) return <div>Loading tasks...</div>;
  // End Loading screen
  
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
    <SessionTemplate session={session} refetchSession={refetchSession}>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="lists">
          {session.columns.map((column) =>
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
