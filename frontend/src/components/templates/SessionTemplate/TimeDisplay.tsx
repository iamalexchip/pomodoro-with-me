import { FC } from "react";
import { useState } from "react";
import { SessionStatus, TimeEntry } from "common";
import { getDiff } from "../../../utils/timeUtils";
import { useEffect } from "react";

interface ITimeDisplay {
  end: Date | null;
  status: SessionStatus;
  timesheet: TimeEntry[];
}

export const TimeDisplay: FC<ITimeDisplay> = ({ timesheet, status, end }) => {
  const [now, setNow] = useState(new Date());
  let sessionStartTime, sessionEndTime;
  let sessionDuration = "0:00:00";

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  if (status !== "unbegun") {
    sessionStartTime = timesheet[0].start;
  }
  
  if (status === "pomodoro" || status === "break") {
    sessionEndTime = now;
  }

  if (status === "done") {
    sessionEndTime = end;
  }
  
  if (sessionStartTime && sessionEndTime) {
    sessionDuration = getDiff(sessionStartTime, sessionEndTime);
  }

  return (
    <>
      <div className="session-timer">{sessionDuration}</div>
      <div className="pomodoro-timer">14:32</div>
    </>
  )
}
