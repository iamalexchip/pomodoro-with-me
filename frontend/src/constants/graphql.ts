import { gql } from '@apollo/client';
import { Session, Task } from 'common';

// SESSION_TASKS_ROUTE

export interface IVARS_SESSION_TASKS_ROUTE {
  session: string;
}

export interface IRESULT_SESSION_TASKS_ROUTE {
  session: Session;
  tasks: Task[];
}

export const SESSION_TASKS_ROUTE = gql`
  query TasksQuery($session: String!) {
    session: getSession(slug: $session) {
      name
      status
      isModerated
      isOpen
      end
      columns {
        id
        position
        isFocus
        label
      }
      timesheet {
        start
        end
      }
    }

    tasks: listTasks(session: $session) {
      id
      title
      column
      position
      timesheet {
        start
        end
      }
    }
  }
`;

// UPDATE_TASK

export interface IVARS_UPDATE_TASK {
  id: string;
  column?: string;
  position?: number;
}

export const UPDATE_TASK = gql`
  mutation updateTask($id: String!, $column: String, $position: Float) {
    updateTask(id: $id column: $column, position: $position ) {
      id
      title
      column
      position
    }
  }
`;

