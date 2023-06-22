import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

function FormModal({children, className='', style={}, createdEntity='', title=`Create ${createdEntity}`, submitText='Create', additionalInfo={}, form, formHandler=(form=new Element(),info={})=>{}}){
    const [show, setShow] = useState(false);
    
    const handleClose = () => setShow(false);
    const handleShow= () => setShow(true);
    const handleForm = (event) => {
        event.preventDefault();
        setShow(false);
        formHandler(event.target, additionalInfo);
    };

    return(
        <>
          <div onClick={handleShow} className={className} style={style}> {children} </div>
          <Modal show={show} onHide={handleClose} >
            <Form onSubmit={(event) => handleForm(event)}>
              <Modal.Header>
                <Modal.Title>{title}</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {form}
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                  Cancel
                </Button>
                <Button variant="primary" type='submit'>
                  {submitText}
                </Button>
              </Modal.Footer>
            </Form>
          </Modal>
        </>
    )
}

export default FormModal;
