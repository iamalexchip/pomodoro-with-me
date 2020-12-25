import { useState } from "react";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { FaCog } from 'react-icons/fa';

export const SessionSettings = () => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <button className="btn-faint" onClick={handleShow}><FaCog /></button>
      <Modal
        show={show}
        backdrop={false}
        onHide={handleClose}
      >
        <Modal.Header closeButton>
          <Modal.Title>Session settings</Modal.Title>
        </Modal.Header>
      
        <Modal.Body>
          <Form.Group controlId="pomodoro">
            <Form.Label>Pomodoro length (minutes)</Form.Label>
            <Form.Control type="number" placeholder="Pomodoro length (minutes)" />
          </Form.Group>
        </Modal.Body>
      
        <Modal.Footer>
          <Button variant="secondary">Cancel</Button>
          <Button variant="primary">Save changes</Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}
