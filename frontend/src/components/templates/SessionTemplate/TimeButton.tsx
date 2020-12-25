import { FC, useEffect } from "react";
import { Session, SessionStatus } from "common";
import { IVARS_TOGGLE_SESSION, TOGGLE_SESSION } from "../../../constants/graphql";
import { useMutation } from "@apollo/client";
import Button from "react-bootstrap/Button";

interface ITimeButton {
  status: SessionStatus;
  refetchSession: any;
}

export const TimeButton: FC<ITimeButton>= ({ status, refetchSession }) => {
  let buttonText = "";
  let buttonAction = "";
  const sessionSlug = "mushando";
  const [
    toggleSession,
    { loading: isTogglingSession, error: toggleSessionError, data: toggleSesionResult }
  ] = useMutation<Session, IVARS_TOGGLE_SESSION>(TOGGLE_SESSION);
  const timeButtonAction = (status: string) => {
    toggleSession({ variables: { slug: sessionSlug, status }})
  };

  // refetch session from DB
  useEffect(() => {
    if (toggleSesionResult) refetchSession();
  }, [toggleSesionResult]);

  if (status === "unbegun") {
    buttonText = "Begin";
    buttonAction = "pomodoro";
  }

  if (status === "pomodoro") {
    buttonText = "Stop";
    buttonAction = "break";
  }

  if (status === "break") {
    buttonText = "Continue";
    buttonAction = "pomodoro";
  }
  
  if (status === "done") {
    buttonText = "Reset";
    buttonAction = "unbegun";
  }

  return (
    <div>
      <Button
        variant={status === "pomodoro" ? "primary" : "secondary"}
        disabled={isTogglingSession}
        onClick={() => timeButtonAction(buttonAction)}
      >{buttonText}</Button>
    </div>
  )
}
