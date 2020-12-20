import { useState } from "react";
import { FC } from "react";
import { FaShareAlt, FaRegBell, FaCog, FaUserCircle, FaCaretDown } from 'react-icons/fa';
import { GiTomato } from "react-icons/gi";
import SessionLabel from "./SessionLabel";

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
          <button className="nav-button"><FaShareAlt /></button>
          <button className="nav-button"><FaRegBell /></button>
          <button className="nav-button"><FaCog /></button>
          <button className="nav-button"><FaUserCircle /></button>
        </div>
      </nav>
      <nav className="navbar board">
        <div className="nav-left">
          <button className="menu-button">Task <FaCaretDown /></button>
          <SessionLabel />
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
