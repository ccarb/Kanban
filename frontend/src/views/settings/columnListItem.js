import { useState } from "react";
import RemoveModal from "../../components/removeModal";

function ColumnLIMobile({columnObj, deleteHandler, editHandler, reorderHandler, lastEditableOrder=3}){
    const [editing, setEditing] = useState(false);

    function toggleEdit(){
        setEditing((prev) => !prev);
    }

    function handleSubmit(event){
        event.preventDefault();
        editHandler(event, columnObj);
        toggleEdit();
    }

    function handleDelete(){
        deleteHandler(columnObj);
    }

    const handleMoveUp = () => reorderHandler('up', columnObj)
    const handleMoveDown = () => reorderHandler('down', columnObj)

    const top = () => columnObj.order === 1;
    const bot = () => columnObj.order === lastEditableOrder;

    let item;
    if (editing){
        item=(
            <form onSubmit={(event) => handleSubmit(event)}>
                <div className='input-group align-items-center'>
                    <div className='col'><input className="form-control" name="name" type="text" defaultValue={columnObj.name}></input></div>
                    <div className='col-2 text-center'><button className="btn" type="submit"><i className='bi-check2'></i></button></div>
                    {columnObj.colType === 'N' && <div className='col-2 text-center'><RemoveModal removeHandler={handleDelete} removedEntity='Column'/></div>}
                    <div className='col-2 text-center' onClick={toggleEdit}><i className='bi-x-circle-fill'></i></div>   
                </div>
            </form>
        )
    } else {
        item=(
        <div className='row align-items-center w-100 m-0' onDoubleClick={toggleEdit}>
            <div className='col'>{columnObj.name}</div>
            {columnObj.colType === 'N' && <div className='col-2 text-center'><div className='row' onClick={handleMoveUp}><i className={top() ? 'bi-dash-lg' : 'bi-chevron-up'}></i></div><div className='row'><i onClick={handleMoveDown} className={bot() ? 'bi-dash-lg' : 'bi-chevron-down'}></i></div></div>}
            <div className='col-2 text-center' onClick={toggleEdit}><i className='bi-pencil-fill'></i></div>
        </div>
        )
    }
    return(
        <li className="list-group-item ms-5 ms-3">
            {item}
        </li>
    )
}

function ColumnLIDesktop(){
    
}

export {ColumnLIMobile};
export {ColumnLIDesktop};