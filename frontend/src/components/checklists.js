import React, { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

import { API_URL } from '..';

function Checklists(props){
    const [checklists, setChecklists] = useState([]);

    function getChecklists(){
        return fetch(API_URL).then(response => response.json()).then(data => setChecklists(data));
    }

    useEffect(()=>{
        getChecklists();
    },[]);

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleRemove = () => {
        //TODO delete checklist fetch request
        setShow(false);
    };

    return(
        <>
            <div className="d-container-fluid d-sm-block card mt-3 mx-3" style={{width: "460px"}}>
                <div className="card-header">
                    <p className="card-title h3">Checklists</p>
                </div>
                <div className="card-body">
                    <ul className="list-group">
                        {checklists.map(checklist => (<li key={checklist.pk} className='list-group-item'>{checklist.name} <span className="float-end" onClick={handleShow}><i className="bi bi-trash3-fill"></i></span> </li>))}
                    </ul>
                </div>
            </div>
            <Modal show={show} onHide={handleClose} className='modal-sm'>
                <Modal.Header closeButton>
                    <Modal.Title>Erase checklist?</Modal.Title>
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

export default Checklists;
