import { FC, ReactNode } from "react";

interface ISessionTemplate {
}

export const SessionTemplate: FC<ISessionTemplate> = ({ children }) => {
  return (
    <div className="ui">
      <nav className="navbar app">App bar</nav>
      <nav className="navbar board">Board bar</nav>
      {children}
    </div>
  )
};
