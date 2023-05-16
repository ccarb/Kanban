import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

function RemoveModal(props){
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleRemove = () => {
        props.removeHandler(props.selected);
        setShow(false);
    };

    return(
        <>
            <span onClick={handleShow}><i className="bi bi-trash3-fill"></i></span>
            <Modal className='modal-sm' show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Delete {props.removedEntity}?</Modal.Title>
                </Modal.Header>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        No
                    </Button>
                    <Button variant="primary" onClick={handleRemove}>
                        Yes
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default RemoveModal;