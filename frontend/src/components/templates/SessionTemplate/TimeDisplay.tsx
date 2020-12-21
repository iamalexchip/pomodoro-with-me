import { FC, useEffect, useState } from "react";
import { SessionStatus, TimeEntry } from "common";
import { getDiff } from "../../../utils/timeUtils";
import { NO_DURATION } from "../../../constants/time";

interface ITimeDisplay {
  end: Date | null;
  status: SessionStatus;
  timesheet: TimeEntry[];
}

export const TimeDisplay: FC<ITimeDisplay> = ({ timesheet, status, end }) => {
  const [now, setNow] = useState(new Date());
  let sessionStart, sessionEnd, sessionDuration, pomodoroStart, pomodoroEnd, pomodoroDuration;

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  if (status === "unbegun") {
    sessionDuration = pomodoroDuration = NO_DURATION;
  } else {
    sessionStart = timesheet[0].start;
  }
  
  if (status === "pomodoro") {
    sessionEnd = pomodoroEnd = now;
    pomodoroStart = timesheet[timesheet.length - 1].start;
  }
  
  if (status === "break") {
    sessionEnd = pomodoroEnd = now;
    pomodoroStart = timesheet[timesheet.length - 1].end;
  }

  if (status === "done") {
    sessionEnd = end;
  }
  
  if (sessionStart && sessionEnd) {
    sessionDuration = getDiff(sessionStart, sessionEnd);
  }
  
  if (pomodoroStart && pomodoroEnd) {
    pomodoroDuration = getDiff(pomodoroStart, pomodoroEnd);
  }

  return (
    <>
      <div className="session-timer">{sessionDuration}</div>
      <div className="pomodoro-timer">{pomodoroDuration}</div>
    </>
  )
}
