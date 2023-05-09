import { useState } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/esm/Button';
import RemoveModal from '../../components/removeModal';
import Stack from 'react-bootstrap/Stack';
import Form from 'react-bootstrap/Form';

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

    function handleEdit(event){ 
        event.preventDefault();
        setEditing(false);
        props.editHandler(event.target, {id: props.pk});
    }

    let card;

    if (editing){
    card=(
        <Card className="text-start m-2 align-self-center">
          <Form onSubmit={(event) => handleEdit(event)}>
            <Form.Group controlId='EditedCard'>
              <Card.Header>
                <Card.Title>
                  <Stack direction='horizontal' gap='1'>
                    <Form.Control 
                      type="text" 
                      name="name" 
                      required
                      defaultValue={props.title}
                    />
                    <RemoveModal
                      removedEntity={props.elementType}
                      selected={props.pk}
                      removeHandler={props.removeHandler}
                    />
                  </Stack>
                </Card.Title> 
              </Card.Header>
              <Card.Body>
                <Card.Text>
                  <Form.Control 
                    as="textarea" 
                    name="description" 
                    rows={3}
                    required
                    defaultValue={props.description}
                  />
                </Card.Text>
              </Card.Body>
            </Form.Group>
              <Card.Footer>
                <Button variant='secondary' className='float-end' onClick={toggleEdit}>Cancel</Button>
                <Button variant='primary' type='submit'>Save</Button>
              </Card.Footer>
          </Form>
        </Card>
        );
    }
    else{
        card=(
            <Card ref={props.innerRef} className="text-start align-self-center m-2" onClick={toggleEdit}>
              <Card.Header>
                <Card.Title>
                  {props.title}
                </Card.Title>
              </Card.Header>
              <Card.Body>
                {props.description.split('\n').map((line, x) => <Card.Text key={x} >{line}</Card.Text>)}
              </Card.Body>
            </Card>
        );
    }

    return card;
}

export default KanbanCard