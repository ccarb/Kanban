import {useState} from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";


function EditableString(props){
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(props.item.name);

  function toggleEdit(){
    if (editing) {
      setEditing(false);
      let editedItem={...props.item};
      editedItem.name=name;
      props.editHandler(editedItem);
    }
    else
      setEditing(true);
  }

  function handleEdit(event){
    setName(event.target.value);
  }

  let listItem;
  if (editing){
    listItem = 
      
        <Form onSubmit={toggleEdit}><div className="d-inline-flex justify-content-between align-self-center">
            <Form.Control autoFocus onChange={handleEdit} value={name}></Form.Control>
            <Button className='m-1' variant="primary" type="submit"><i className="bi bi-check-lg"/></Button>
        </div></Form>
      
  }
  else{
    listItem = <span onClick={toggleEdit}>{props.item.name}</span>;
  }

  return listItem;
}

export default EditableString;