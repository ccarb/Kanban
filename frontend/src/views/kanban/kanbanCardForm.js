import Form from "react-bootstrap/Form";

function KanbanCardForm(props){
  return(
    <>
      <Form.Group controlId="Card">
        <Form.Label>Name: </Form.Label>
        <Form.Control type="text" name="name" required/>
        <Form.Label>Description:</Form.Label> 
        <Form.Control type="textArea" name="description" required/>
        <Form.Label>Due date:</Form.Label> 
        <Form.Control type="date" name="dueDate" />
        <Form.Label>Cover image:</Form.Label> 
        <Form.Control type="file" name="cover" />
      </Form.Group>    
    </>
  )
}

export default KanbanCardForm;
