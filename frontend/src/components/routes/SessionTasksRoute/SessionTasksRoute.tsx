import { gql, useQuery } from '@apollo/client';
import { useParams } from "react-router-dom";
import { ISessionModelm ITaskModel } from "../../../types/models";
import { SessionTemplate } from "../../templates/SessionTemplate";
import { DragDropContext } from "react-beautiful-dnd";
import TaskList from "./TaskList";

interface IParams {
  sessionId: string
}

interface IQuery {
  session: ISessionModel
  tasks: ITaskModel[]
}

interface IQueryVars {
  session: string;
}

const SessionTasksRoute = () => {
  const { sessionId } = useParams<IParams>();
  const GET_TASKS = gql`
    query TasksQuery($session: String!) {
      {
        session: getSession(name: $session) {
          name
          status
          isModerated
          isOpen
          start
          end,
          columns {
            id
            position
            isFocus
            label
          }
        }
      }

      tasks: listTasks(session: $session) {
        id
        title
        column
        timesheet {
          start
          end
        }
      }
    }
  `;

  const { loading, error, data } = useQuery<IQuery, IQueryVars>(GET_TASKS, {
    variables: { session: sessionId }
  });

  if (error) return <div>Error fetching data</div>;
  if (loading || !data) return <div>Loading tasks...</div>;
  
  const { tasks } = data;  
  const onDragEnd = (result: any) => {

  }

  return (
    <SessionTemplate>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="lists">
          <TaskList column={{ id: "fedfe" }} />
        </div>
      </DragDropContext>
    </SessionTemplate>
  )
}

export default SessionTasksRoute;
