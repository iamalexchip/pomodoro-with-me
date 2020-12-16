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

// UPDATE_TASK

export interface IVARS_UPDATE_TASK {
  id: string;
  column?: string;
}

export const UPDATE_TASK = gql`
  mutation updateTask($id: String!, $column: String) {
    updateTask(id: $id column: $column) {
      id
      title
      column
    }
  }
`;

