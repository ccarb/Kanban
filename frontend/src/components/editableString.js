import {useState} from "react";
import Form from "react-bootstrap/Form";


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
      <Form onSubmit={toggleEdit}>
        <Form.Group>
          <Form.Control onChange={handleEdit} value={name}></Form.Control>
        </Form.Group>
      </Form>
  }
  else{
    listItem = <span onClick={toggleEdit}>{props.item.name}</span>;
  }

  return listItem;
}

export default EditableString;