function KanbanCardForm(props){
  let formData={};

  function handleCreate(){
    props.createHandler()
  }

  return(
    <>
        <form>
          <label>
            Name: 
            <input type="text" name="name" />
          </label>
          <label>
            Description: 
            <input type="textArea" name="description"></input>
          </label>
        </form>
    </>
  )
}

export default KanbanCardForm;
