import { Modal } from '../../molecules/Modal';

export const SessionSettings = () => {
  return (
    <Modal isOpen={true}>
      <div className="mb-2">
        Name <input />
      </div>
      <div className="mb-2">
        Pomodoro length <input />
      </div>
      <div>
        Break length <input />
      </div>
    </Modal>
  )
}
