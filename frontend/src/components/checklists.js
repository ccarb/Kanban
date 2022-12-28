import React, { useEffect, useState } from 'react';
import { API_URL } from '..';

function Checklists(props){
    const [checklists, setChecklists] = useState([]);

    function getChecklists(){
        return fetch(API_URL).then(response => response.json()).then(data => setChecklists(data));
    }

    useEffect(()=>{
        getChecklists();
    },[]);

    return(
        <div className="d-container-fluid d-sm-block card mt-3 mx-3" style={{width: "460px"}}>
            <div className="card-header">
                <p className="card-title h3">Checklists</p>
            </div>
            <div className="card-body">
                <ul className="list-group">
                    {checklists.map(checklist => (<li key={checklist.pk} className='list-group-item'>{checklist.name} <span className="float-end"><i className="bi bi-trash3-fill"></i></span> </li>))}
                </ul>
            </div>
        </div>
    );

}

export default Checklists;
