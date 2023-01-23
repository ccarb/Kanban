import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup'
import RemoveModal from '../components/removeModal';
import CreateModal from './createModal';

function EditableListInCard(props) {
  return (
    <Card style={{ width: '18rem' }}>
      <Card.Body>
        <Card.Title>{props.title}</Card.Title>
        <Card.Text>
          {props.description}
        </Card.Text>
        <ListGroup variant="flush">
          {props.items.map(item => (
            <ListGroup.Item key={item.pk}>
              {item.name} <RemoveModal 
                removedEntity={props.listElementType}
                selected={item.pk} 
                removeHandler={props.removeHandler}
              /> 
            </ListGroup.Item>))}
          <CreateModal
            createdEntity={props.listElementType}
            createHandler={props.createHandler}
          />
        </ListGroup>
      </Card.Body>
    </Card>
  );
}

export default EditableListInCard;