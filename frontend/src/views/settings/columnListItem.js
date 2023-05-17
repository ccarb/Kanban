import { useState } from "react"

function ColumnLI({columnObj, handleDelete, handleEdit, handleReorder}){
    [editing, setEditing] = useState(false);

    function toggleEdit(){
        setEditing((prev) => !prev);
    }

    let item;
    if (editing){
        item=(
        <div className='row align-items-center'>
            <div className='col'><input name="name" type="text"></input></div>
            <div className='col-2' onClick={handleEdit}><i className='bi-check2'></i></div>
            <div className='col-2' onClick={handleDelete}><i className='bi-trash-fill'></i></div>
            <div className='col-2' onClick={toggleEdit}><i className='bi-x-circle-fill'></i></div>
        </div>
        )
    } else {
        item=(
        <div className='row align-items-center' onDoubleClick={toggleEdit}>
            <div className='col'>{columnObj.name}</div>
            <div className='col-2'><div className='row' onClick={handleReorder}><i className='bi-chevron-up'></i></div><div className='row'><i className='bi-dash-lg'></i></div></div>
            <div className='col-2'><i className='bi-pencil-fill'></i></div>
        </div>
        )
    }
    return(
        <li>
            {item}
        </li>
    )
}