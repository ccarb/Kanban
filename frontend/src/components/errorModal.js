import { useState } from 'react'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/esm/Button';

function ErrorModal(props){
    const [show, setShow] = useState(false);
    const [message, setMessage] = useState("There was an error.");

    const handleClose = () => setShow(false);
    
    const handleShow = (event) => {
        setMessage(event.detail.message);
        setShow(true);
    };

    document.addEventListener("error", (event) => (handleShow(event)));

    return (
        <Modal className='modal-md' show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Something went wrong...</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {message}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleClose}>
                        Ok
                    </Button>
                </Modal.Footer>
            </Modal>
    )
}

export default ErrorModal;