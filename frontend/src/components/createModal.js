import { useState, createRef } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup"

function CreateModal(props){
    const [show, setShow] = useState(false);
    
    const handleCloseCreateModal = () => setShow(false);
    const handleShowCreateModal= () => setShow(true);
    
    const handleCreate = () => {
        props.createHandler(checklistName.current.value);
        setShow(false);
    };

    let checklistName=createRef();

    return (
        <>
            <ListGroup.Item key="999" onClick={handleShowCreateModal}>Create...</ListGroup.Item>
            <Modal show={show} onHide={handleCloseCreateModal}>
                <form>
                    <Modal.Header>
                        <Modal.Title>Create {props.createdEntity}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>                        
                            <label for='Name' className='form-label'>Name</label>
                            <input name='Name' id='Name' className='form-control' ref={checklistName} required></input>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseCreateModal}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={handleCreate}>
                            Create
                        </Button>
                    </Modal.Footer>
                </form>
            </Modal>
        </>
    );
}

export default CreateModal;