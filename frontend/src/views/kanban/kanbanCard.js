import { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/esm/Button';
import RemoveModal from '../../components/removeModal';
import Stack from 'react-bootstrap/Stack';
import Form from 'react-bootstrap/Form';

function KanbanCard(props){
    const [editing, setEditing]=useState(false);
    const [changingImg, setChangingImg] = useState(false);
    const [imgToBeDeleted, setImgToBeDeleted] = useState(false);
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
            setImgToBeDeleted(false);
            setChangingImg(false);
            setEditing(false);
        }
        else{
            setEditing(true);
        }
    }

    function toggleChangeImage(){
      setChangingImg((changingImg) => !changingImg);
    }

    function toggleImgDelition(){
      setImgToBeDeleted((imgToBeDeleted) => !imgToBeDeleted);
      setChangingImg(false);
    }

    function handleEdit(event){ 
        event.preventDefault();
        props.editHandler(event.target, {id: props.card.id}, imgToBeDeleted);
        toggleEdit();
    }

    let card;

    if (editing){
    card=(
        <Card className="text-start m-2 align-self-center">
          <Form onSubmit={(event) => handleEdit(event)}>
            <Form.Group controlId='EditedCard'>
              <Card.Header className='p-0'>
                {(props.card.cover && !imgToBeDeleted) ? <Card.Img variant='top' src={props.card.cover}/> : <Card.Img variant='top' src='/camera.svg'/>}
                <div className='h5' style={{margin: '-2em 0 .3em'}}>
                  <span><h5> </h5></span>
                {changingImg 
                ? (<><i className='bi bi-x-circle-fill p-2' onClick={toggleChangeImage}></i><RemoveModal removedEntity='cover' selected={props.card.id} removeHandler={toggleImgDelition} /></>)
                : (<i className='bi bi-pencil-fill p-2' onClick={toggleChangeImage}></i>)
                }
                </div>
                {(changingImg) && (
                <Card.Text className='p-2'>
                  <Form.Label>Cover image:</Form.Label>
                  <Form.Control 
                    as="input"
                    type="file"
                    name="cover"
                    defaultValue=''
                  />
                </Card.Text>)}
                <Card.Title className='p-2'>
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
              <Card.Header className='p-0' >
              {props.card.cover && <Card.Img variant='top' src={props.card.cover}/>}
                <Stack direction='horizontal' className='p-2'>
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