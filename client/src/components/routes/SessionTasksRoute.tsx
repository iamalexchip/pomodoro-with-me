import { gql, useQuery } from '@apollo/client';
import { useParams } from "react-router-dom";
import { ITaskModel } from "../../types/models";

interface IParams {
  sessionId: string
}

interface IQuery {
  tasks: ITaskModel[]
}

interface IQueryVars {
  session: string;
}

const SessionTasksRoute = () => {
  const { sessionId } = useParams<IParams>();
  const GET_TASKS = gql`
    query TasksQuery($session: String!) {
      tasks: listTasks(session: $session) {
        id
        title
        column
        timesheet {
          start
          end
        }
        session {
          name
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

  return (
    <div><h3>Tasks</h3>
      <ul>
        {tasks.map((task) => 
          <li key={task.id}>{task.title}</li>
        )}
      </ul>
    </div>
  )
}

export default SessionTasksRoute;
