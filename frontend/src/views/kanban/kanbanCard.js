import { useState } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/esm/Button';
import RemoveModal from '../../components/removeModal';

function KanbanCard(props){
    const [editing, setEditing]=useState(false);

    function toggleEdit(){
        if (editing){
            setEditing(false);
        }
        else{
            setEditing(true);
        }
    }

    let card;

    if (editing){
    card=(
        <Card className="text-start m-2 align-self-center">
            <Card.Header>
               <Card.Title>
                    {props.title}
                    <RemoveModal
                    removedEntity={props.elementType}
                    selected={props.pk}
                    removeHandler={props.removeHandler}
                    />
                </Card.Title> 
            </Card.Header>
            <Card.Body>
            <Card.Text>

                {props.description}
                
            </Card.Text>
            <Button variant='primary' onClick={toggleEdit}>Save</Button>
            <Button variant='secondary' className='float-end' onClick={toggleEdit}>Cancel</Button>
            </Card.Body>
        </Card>
        );
    }
    else{
        card=(
            <Card className="text-start align-self-center m-2" onClick={toggleEdit}>
                <Card.Header>
                    <Card.Title>
                        {props.title}
                    </Card.Title>
                </Card.Header>
            <Card.Body>
            <Card.Text>
                {props.description}
            </Card.Text>
            </Card.Body>
            </Card>
        );
    }

    return card;
}

export default KanbanCard