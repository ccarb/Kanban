import useState from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

function CreateModal(props){
    const [show, setShow] = useState(false);
    
    const handleClose = () => setShow(false);
    const handleShow= () => setShow(true);

    return(
        <>
          <div onClick={handleShow}> {props.placeholder} </div>
          <Modal show={show} onHide={handleClose}>
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
                <Button variant="primary" onClick={props.createHandler}>
                  Create
                </Button>
              </Modal.Footer>
          </Modal>
        </>
    )
}

export default CreateModal;
