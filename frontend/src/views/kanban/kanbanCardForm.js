import Form from "react-bootstrap/Form";

function KanbanCardForm(props){
  return(
    <>
      <Form.Group controlId="Card">
        <Form.Label>Name: </Form.Label>
        <Form.Control type="text" name="name" required/>
        <Form.Label>Description:</Form.Label> 
        <Form.Control type="textArea" name="description" required/>
      </Form.Group>    
    </>
  )
}

export default KanbanCardForm;
