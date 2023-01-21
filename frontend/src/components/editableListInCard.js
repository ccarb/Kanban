import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup'
import RemoveModal from '../components/removeModal';

function EditableListInCard(props) {
  return (
    <Card style={{ width: '18rem' }}>
      <Card.Body>
        <Card.Title>{props.title}</Card.Title>
        <Card.Text>
          {props.description}
        </Card.Text>
        <ListGroup variant="flush">
          {props.items.map(item => (<ListGroup.Item key={item}>{item} <RemoveModal removedEntity={props.listElementType} removeURL={props.removeURL} selected={0} removeHandler={props.removeHandler} /> </ListGroup.Item>))}
          <ListGroup.Item>Create...</ListGroup.Item>
        </ListGroup>
      </Card.Body>
    </Card>
  );
}

export default EditableListInCard;