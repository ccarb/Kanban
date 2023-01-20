import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup'

function EditableListInCard(props) {
  return (
    <Card style={{ width: '18rem' }}>
      <Card.Body>
        <Card.Title>{props.title}</Card.Title>
        <Card.Text>
          {props.description}
        </Card.Text>
        <ListGroup variant="flush">
          {props.items.map(item => (<ListGroup.Item key={item}>{item}<span className="float-end"><i className="bi bi-trash3-fill"></i></span> </ListGroup.Item>))}
          <ListGroup.Item>Create...</ListGroup.Item>
        </ListGroup>
      </Card.Body>
    </Card>
  );
}

export default EditableListInCard;