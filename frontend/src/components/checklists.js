import React, { createRef, useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';

import { CHECKLIST_API_URL } from '../constants/apiUrls';

function Checklists(props){
    const [checklists, setChecklists] = useState([]);
    const [selected, setSelected] = useState(0);

    function getChecklists(){
        return fetch(CHECKLIST_API_URL).then(response => response.json()).then(data =>setChecklists([...data]));
    }

    useEffect(()=>{
        getChecklists();
    },[]);

    

    const [showRemoveModal, setShowRemoveModal] = useState(false);

    const handleCloseRemoveModal = () => setShowRemoveModal(false);
    function handleShowRemoveModal (sel) {
        setSelected(sel);
        setShowRemoveModal(true);  
    }
    
    const handleRemove = () => {
        
        fetch(CHECKLIST_API_URL + selected, {"method": "DELETE"});
        getChecklists();
        setShowRemoveModal(false);
    };
    
    const [showCreateModal, setShowCreateModal] = useState(false);
    
    const handleCloseCreateModal = () => setShowCreateModal(false);
    const handleShowCreateModal= () => setShowCreateModal(true);

    let checklistName=createRef();
    let checklistDescription=createRef();

    const handleCreate = () => {
        fetch(CHECKLIST_API_URL, {
            method: "POST", 
            headers: new Headers({'content-type': 'application/json'}),
            body: '{"name": "'+ checklistName.current.value +'","description": "' + checklistDescription.current.value + '"}',
        });
        getChecklists();
        setShowCreateModal(false);
    }
    
    

    return(
        <>
            <div className="d-container-fluid d-sm-block card mt-3 mx-3" style={{width: "460px"}}>
                <div className="card-header">
                    <p className="card-title h3">Checklists</p>
                </div>
                <div className="card-body">
                    <ul className="list-group">
                        {checklists.map(checklist => (<li key={checklist.pk} className='list-group-item'><Link to={'/checklists/'+checklist.pk}>{checklist.pk+': '+checklist.name}</Link> <span className="float-end" onClick={() => handleShowRemoveModal(checklist.pk)}><i className="bi bi-trash3-fill"></i></span> </li>))}
                        <li className='list-group-item text-muted' onClick={handleShowCreateModal} >Create...</li>
                    </ul>
                </div>
            </div>
            <Modal show={showRemoveModal} onHide={handleCloseRemoveModal} className='modal-sm'>
                <Modal.Header closeButton>
                    <Modal.Title>Erase checklist?</Modal.Title>
                </Modal.Header>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseRemoveModal}>
                        No
                    </Button>
                    <Button variant="primary" onClick={handleRemove}>
                        Yes
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={showCreateModal} onHide={handleCloseCreateModal}>
                <form>
                    <Modal.Header>
                        <Modal.Title>Create Checklist</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>                        
                            <label for='Name' className='form-label'>Name</label>
                            <input name='Name' id='Name' className='form-control' ref={checklistName} required></input>
                            <label for='Description' className='form-label'>Description</label>
                            <textarea name='Description' id='Description' className='form-control' ref={checklistDescription} required></textarea>
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

export default Checklists;
