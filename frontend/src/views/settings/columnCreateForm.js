import Form from "react-bootstrap/Form";

function ColumnCreateForm(props){
  return(
    <>
      <Form.Group controlId="Card">
        <Form.Label>Name: </Form.Label>
        <Form.Control type="text" name="name" required/>
      </Form.Group>    
    </>
  )
}

export default ColumnCreateForm;