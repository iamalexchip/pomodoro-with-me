import { gql } from '@apollo/client';
import { Session, Task } from 'common';

// SESSION_TASKS_ROUTE

export interface IVARS_GET_SESSION {
  session: string;
}

export interface IRESULT_GET_SESSION {
  session: Session;
}

export const GET_SESSION = gql`
  query getSession($session: String!) {
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
  }
`;

export interface IVARS_GET_TASKS {
  session: string;
}

export interface IRESULT_GET_TASKS {
  tasks: Task[];
}

export const GET_TASKS = gql`
  query getTasks($session: String!) {
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

// TOGGLE_SESSION

export interface IVARS_TOGGLE_SESSION {
  slug: string;
  status: string;
}

export const TOGGLE_SESSION = gql`
mutation toggleSession($slug: String!, $status: SessionStatus!) {
  toggleSession(slug: $slug, status: $status) {
    name
    end
    status
    timesheet {
      start
      end
    }
  }
}
`;
