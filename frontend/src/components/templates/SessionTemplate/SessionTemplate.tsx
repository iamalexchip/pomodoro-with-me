import { FC } from "react";
import { FaShareAlt, FaRegBell, FaCog, FaUserCircle, FaCaretDown } from 'react-icons/fa';
import { GiTomato } from "react-icons/gi";

interface ISessionTemplate {
}

const SessionTemplate: FC<ISessionTemplate> = ({ children }) => {

  return (
    <div className="ui">
      <nav className="navbar app">
        <div className="brand">
          <GiTomato /> Pomodoro With Me
        </div>
        <div className="actions">
          <button className="btn-faint"><FaShareAlt /></button>
          <button className="btn-faint"><FaRegBell /></button>
          <button className="btn-faint"><FaCog /></button>
          <button className="btn-faint"><FaUserCircle /></button>
        </div>
      </nav>
      <nav className="navbar board">
        <div className="nav-left">
          <select>
            <option>Tasks</option>
            <option>Timeline</option>
          </select>
          <div className="nav-label">Board bar</div>
        </div>
        <div className="nav-right">
          <div className="session-timer">01:14:32</div>
          <div className="pomodoro-timer">14:32</div>
          <button className="timer-button">Break</button>
        </div>
      </nav>
      {children}
    </div>
  )
};

export default SessionTemplate;
