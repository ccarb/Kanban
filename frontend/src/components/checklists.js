import React from 'react';
import { API_URL } from '..';

class Checklists extends React.Component {
    state={
        checklists: []
    };
    getChecklists(){
        return fetch(API_URL).then(response => response.json()).then(data => this.setState({checklists: data}));
    }
    resetState(){
        this.getChecklists();
    }
    componentDidMount(){
        this.resetState();
    }
    render(){
        return (
                <div className="d-container-fluid d-sm-block card mt-3 mx-3" style={{width: "460px"}}>
                    <div className="card-header">
                        <p className="card-title h3">Checklists</p>
                    </div>
                    <div className="card-body">
                        <ul className="list-group">
                            {this.state.checklists.map(checklist => (<li key={checklist.pk} className='list-group-item'>{checklist.name} <span class="float-end"><i class="bi bi-trash3-fill"></i></span> </li>))}
                        </ul>
                    </div>
                </div>
          );
    }
}

export default Checklists;
