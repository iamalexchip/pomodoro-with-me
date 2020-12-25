import { FC, ReactNode } from "react";
import { Session } from "common";
import { FaShareAlt, FaRegBell, FaCog, FaUserCircle, FaCaretDown } from 'react-icons/fa';
import { GiTomato } from "react-icons/gi";
import { TimeDisplay } from "./TimeDisplay"; 
import { TimeButton } from "./TimeButton";
import { SessionSettings } from "./SessionSettings";

interface ISessionTemplate {
  children: ReactNode;
  session: Session;
  refetchSession: any
}

const SessionTemplate = ({ children, session, refetchSession }: ISessionTemplate) => {

  return (
    <div className="ui">
      <nav className="navbar app">
        <div className="brand">
          <GiTomato /> Pomodoro With Me
        </div>
        <div className="actions">
          <button className="btn-faint"><FaShareAlt /></button>
          <button className="btn-faint"><FaRegBell /></button>
          <SessionSettings />
          <button className="btn-faint"><FaUserCircle /></button>
        </div>
      </nav>
      <nav className="navbar board">
        <div className="nav-left">
          <select>
            <option>Tasks</option>
            <option>Timeline</option>
          </select>
          <div className="nav-label">{session.name}</div>
        </div>
        <div className="nav-right">
          <TimeDisplay status={session.status} timesheet={session.timesheet} end={session.end} />
          <TimeButton status={session.status} refetchSession={refetchSession} />
        </div>
      </nav>
      {children}
    </div>
  )
};

export default SessionTemplate;
