import { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/esm/Button';
import RemoveModal from '../../components/removeModal';
import Stack from 'react-bootstrap/Stack';
import Form from 'react-bootstrap/Form';

function KanbanCard(props){
    const [editing, setEditing]=useState(false);
    const [dueRisk, setDueRisk]=useState('');
    const REFRESH_INTERVAL= 5 * 1000;
    
    useEffect(
      () => {
        function calculateRisk(){
          if (props.card.dueDate) {
            const fromDate = new Date();
            const dueDate = new Date(props.card.dueDate.split('-'));
            const MS_IN_A_DAY = 86400000;
            const MS_IN_A_WEEK = MS_IN_A_DAY * 7;
            let remainingTime = dueDate.getTime() - fromDate.getTime();
            setDueRisk(prevDueRisk => {
              if (remainingTime<0 && 'text-muted' !== prevDueRisk){
                setDueRisk('text-muted')
              } else if (remainingTime < MS_IN_A_DAY && 'text-danger' !== prevDueRisk){
                setDueRisk('text-danger');
              } else if (remainingTime < MS_IN_A_WEEK && 'text-warning' !== prevDueRisk){
                setDueRisk('text-warning');
              } else if ('' !== prevDueRisk){
                setDueRisk('');
              } 
            })
          }
        }

        calculateRisk();
        const intervalId=setInterval(calculateRisk(), REFRESH_INTERVAL);
        return () => clearInterval(intervalId);
      },[REFRESH_INTERVAL, props.card.dueDate]
    )
    
    
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
        props.editHandler(event.target, {id: props.card.id});
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
                      defaultValue={props.card.name}
                    />
                    <RemoveModal
                      removedEntity='card'
                      selected={props.card.id}
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
                    defaultValue={props.card.description}
                  />
                </Card.Text>
                <Card.Text>
                  <Form.Label>Due date:</Form.Label>
                  <Form.Control 
                    as="input"
                    type="date"
                    name="dueDate"
                    defaultValue={props.card.dueDate}
                  />
                </Card.Text>
                <Card.Text>
                  <Form.Label>Due date:</Form.Label>
                  <Form.Control 
                    as="input"
                    type="file"
                    name="cover"
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
            <Card ref={props.innerRef} className={`text-start align-self-center m-2`} onClick={toggleEdit}>
              <Card.Header>
                
                <Stack direction='horizontal'>
                  <Card.Title className='me-auto'>
                    {props.card.name}
                  </Card.Title>
                  { dueRisk !== '' && <i className={`bi bi-clock-fill h5 ${dueRisk}`}></i>}
                </Stack>
                
              </Card.Header>
              <Card.Body>
                {props.card.description.split('\n').map((line, x) => <Card.Text key={x} >{line}</Card.Text>)}
              </Card.Body>
              {props.card.dueDate &&
              (<Card.Footer>
                 <Card.Text>
                    Due on: {props.card.dueDate}
                  </Card.Text>
              </Card.Footer>)}
            </Card>
        );
    }
    
    return card;
}

export default KanbanCard