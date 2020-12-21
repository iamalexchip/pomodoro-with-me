import { FC, ReactNode } from "react";

interface IModal {
  children: ReactNode;
  isOpen: any;
}

export const Modal: FC<IModal> = ({ children, isOpen }) => {
  if (!isOpen) return <></>;

  return (
    <div className="modal">
      <div className="modal-content">
        {children}
      </div>
    </div>
  )
};
