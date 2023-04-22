import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

function FormModal(props){
    const [show, setShow] = useState(false);
    
    const handleClose = () => setShow(false);
    const handleShow= () => setShow(true);
    const handleForm = (event) => {
        event.preventDefault();
        setShow(false);
        props.formHandler(event.target, props.additionalInfo);
    };

    return(
        <>
          <div onClick={handleShow}> {props.children} </div>
          <Modal show={show} onHide={handleClose} >
            <Form onSubmit={(event) => handleForm(event)}>
              <Modal.Header>
                <Modal.Title>Create {props.createdEntity}</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {props.form}
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                  Cancel
                </Button>
                <Button variant="primary" type='submit'>
                  Create
                </Button>
              </Modal.Footer>
            </Form>
          </Modal>
        </>
    )
}

export default FormModal;
