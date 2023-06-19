import React, { useEffect, useState } from 'react';
import { useNavigate, useLoaderData} from 'react-router';
import { Form } from 'react-bootstrap'

import { BOARD_API_URL } from '../../constants/apiUrls';
import Header from '../../components/header';
import ErrorModal from '../../components/errorModal';
import FormModal from '../../components/formModal';
import { apiDelete, apiGet, apiPost, apiPut, apiPutMultiple} from '../../utils/fetchData';
import { ColumnLIMobile } from './columnListItem';

function Settings(){
    const navigate = useNavigate();
    const boardId = useLoaderData();
    const [board, setBoard] = useState({id: -1, name: 'Loading...', created: ''})
    const [columns, setColumns] = useState([{id: -1, name: '', colType: 'N', order: -1, created: '', board: boardId}])
    const [previousColumns, setPreviousColumns] = useState(columns)
    const [apiAction, setApiAction] = useState('get')
    const plusIconSize=2;//em
    const MAX_EDITABLE_ORDER=columns.length-2;
    let previousBoard;

    useEffect(() => {
        const getSettingData_ = async () => getSettingsData();
        const saveEditedBoard_ = async () => saveEditedBoard();
        const deleteBoard_ = async() => deleteBoard();
        const createColumn_ = async() => createColumn();
        const saveEditedColumn_ = async () => saveEditedColumn();
        const deleteColumn_ = async () => deleteColumn();
        const reorderColumns_ = async() => reorderColumns();

        switch (apiAction) {
            case 'get':
                getSettingData_();
                setApiAction('');
                break;
            case 'editBoard':
                saveEditedBoard_();
                setApiAction('');
                break;
            case 'removeBoard':
                deleteBoard_();
                setApiAction('');
                break;
            case 'createColumn':
                createColumn_();
                setApiAction('');
                break;
            case 'editColumn':
                saveEditedColumn_();
                setApiAction('');
                break;
            case 'removeColumn':
                deleteColumn_();
                setApiAction('');
                break;
            case 'reorderColumns':
                reorderColumns_();
                setApiAction('');
                break;
            default:
                break;
        }



    },[apiAction]);

    async function getSettingsData(){
        const boardData = await apiGet(`${BOARD_API_URL}${boardId}`);
        const columnsData = await apiGet(`${BOARD_API_URL}${boardId}/columns`);
        columnsData.columns.sort((a,b) => a.order - b.order)
        setBoard(boardData['0']);
        setColumns(columnsData.columns);
        setPreviousColumns(() => {
            return JSON.parse(JSON.stringify(columns))
        });
    }

    function handleEditBoard(event){
        event.preventDefault();
        const form = event.target;
        const newName = form.elements.name.value;
        previousBoard = {...board};
        const newBoardObject = {...board};//HEADS UP works because values are inmutable
        newBoardObject.name=newName;
        setBoard(newBoardObject);
        setApiAction('editBoard');
    };
    
    async function saveEditedBoard(){
        const ok = await apiPut(board, `${BOARD_API_URL}${boardId}`);
        if (!ok) {
            setBoard(previousBoard);
        }
    }

    function handleDeleteBoard(){
        setApiAction('removeBoard')
    };

    async function deleteBoard(){
        previousBoard = {...board};//HEADS UP works because values are inmutable
        const ok = await apiDelete(`${BOARD_API_URL}${boardId}`);
        if (ok) {
            alert('Board erased');
            navigate("/");
        } else {
            setBoard(previousBoard);
        }
    }

    function handleEditColumn(event, columnObj){
        setPreviousColumns(() => {
            return JSON.parse(JSON.stringify(columns))
        });
        const form = event.target;
        const newName = form.elements.name.value;
        const newColumnObject = {...columnObj};//HEADS UP works because values are inmutable
        newColumnObject.name=newName
        setColumns((columns)=>{
            const column=columns.find((col) => col === columnObj);
            column.name=newName;
            return columns;
        });
        setApiAction('editColumn');
    };

    async function saveEditedColumn(){
        let editedColumn;
        columns.forEach(
            (col, index) => {
                if (col.name !== previousColumns[index].name) {editedColumn = col}
            }
        )
        if (editedColumn){
            const ok = await apiPut(editedColumn, `${BOARD_API_URL}columns/${editedColumn.id}`);
            if (!ok) {
                setColumns(previousColumns);
            }
        }
    };

    function handleDeleteColumn(columnObject){
        const columnObjectBackUp = {...columnObject};
        setPreviousColumns(() => JSON.parse(JSON.stringify(columns)));
        setColumns((prevCols) => {
            const newColumns = [...prevCols];
            newColumns.splice(columnObjectBackUp.order, 1);
            newColumns.forEach((col,index) => col.order !== 11 ? col.order=index : {});
            return newColumns;
        });
        setApiAction('removeColumn')
    };

    async function deleteColumn(){
        let deletedColumn;
        let i;
        for (i=0; i<columns.length-1 && !deletedColumn; i++)
        {
            if (columns[i].id !== previousColumns[i].id ) {
                deletedColumn = previousColumns[i];  
            }
        }
        if (!deletedColumn){
            deletedColumn=previousColumns[i];
        }
        if (deletedColumn){
            // this has to be done in a single transaction
            // TODO modify reorder endpoint to a full bulk update implementation
            let ok = await apiDelete(`${BOARD_API_URL}columns/${deletedColumn.id}`);
            if (!ok) {
                setColumns(previousColumns);
            }
            ok = await apiPutMultiple(columns.slice(1,columns.length-1), `${BOARD_API_URL}columns/reorder`);
            if (!ok) {
                console.log('handle problems with order');
            }
        }
        
    }

    function handleCreateColumn(form,additional){
        setPreviousColumns(JSON.parse(JSON.stringify(columns)));
        const order = additional.order+1;
        const createdCol = {
            id: -1,
            name: form.elements.name.value,
            colType: 'N',
            order: order,
            board: parseInt(boardId),
        };
        setColumns((prevCols)=> {
            const newCols = [...prevCols];
            //create part
            newCols.splice(order,0,createdCol);
            //reorder part
            newCols.slice(1,newCols.length-1).forEach((col, index) => col.order = index+1);
            
            return newCols;
        })
        setApiAction('createColumn')
    };

    async function createColumn(){
        let createdColumn;
        for (let i=0; i < columns.length && !createdColumn; i++){
            if (columns[i].id !== previousColumns[i].id){
                createdColumn = columns[i];
            }
        }
        if (createdColumn){
            delete createdColumn.id;
            const backendCol = await apiPost(createdColumn, `${BOARD_API_URL}${boardId}/columns`);
            if (!backendCol) {
                setColumns(previousColumns);
            }
            createdColumn.id=backendCol.id;
            setColumns([...columns]);
            setApiAction('reorderColumns');
        }
    }


    function handleReorderColumnMobile(direction, columnObj){
        setPreviousColumns(JSON.parse(JSON.stringify(columns)));
        const order = columnObj.order;
        setColumns((columns) => {
            const newColumns = [...columns];
            if (order > 0 || order <= MAX_EDITABLE_ORDER) {
                if (direction==='up' && order > 1){
                    newColumns[order].order = order-1;
                    newColumns[order-1].order = order;
                    newColumns.sort((a,b) => a.order - b.order)
                    return newColumns;
                } else if (direction==='down' && order <= MAX_EDITABLE_ORDER-1){
                    newColumns[order].order = order+1;
                    newColumns[order+1].order = order;
                    newColumns.sort((a,b) => a.order - b.order)
                    return newColumns;
                }
            }
            return newColumns;
        })
        setApiAction('reorderColumns')
    };

    async function reorderColumns(){
        const ok = await apiPutMultiple(columns.slice(1,columns.length-1),`${BOARD_API_URL}columns/reorder`);
        if (!ok){
            setColumns(previousColumns);
        }
    }

    return (
        <>
        <Header className='p-3'>
            <div className='row'>
                <div className='col'>
                    <h1 className='fw-bold'>{`Kanban > ${board.name} > Settings`}</h1>
                </div>
                <div className='col-auto d-block d-lg-none' onClick={() => navigate(`/kanban/${boardId}`)}>
                    <i className='bi-arrow-left h1'></i>
                </div>
            </div>
        </Header>
        <div className='px-3'>
            <h2 className='pt-2'>Board</h2>
            <form onSubmit={(event) => handleEditBoard(event)}>
                <label className='pt-2 h5' htmlFor='name'>Rename</label>
                <div className='input-group py-2'>
                    <input className='form-control' name='name' type='text' placeholder='New name'></input>
                    <button className='btn text-center' type='submit'>
                        <i className='bi-check2'></i>
                    </button>
                </div>
            </form>
            <button className='btn btn-primary py-1' onClick={handleDeleteBoard}>Delete</button>
        </div>
        <div className='px-3 pt-3'>
            <h2>Modify columns</h2>
            {/* <p>{columns[0].name} and {columns[columns.length-1].name} columns can only be renamed.</p> */}
            <ul className='list-group py-3'>
                {columns.map((column,_,cols) =>
                    (
                        <React.Fragment key={column.id}>
                        <ColumnLIMobile columnObj={column} deleteHandler={handleDeleteColumn} editHandler={handleEditColumn} reorderHandler={handleReorderColumnMobile} lastEditableOrder={MAX_EDITABLE_ORDER}/>
                        {column.order!==11 && 
                            (<div id={column.order+.5} className='row align-items-center' style={{height:`${plusIconSize}em`, margin:`-${plusIconSize/2}em 0px -${plusIconSize/2}em`}}>
                                <FormModal className='col' createdEntity="column" formHandler={handleCreateColumn} additionalInfo={{order: column.order}}
                                form={(
                                    <Form.Group controlId="Column">
                                        <Form.Label>Name: </Form.Label>
                                        <Form.Control type="text" name="name" required/>
                                    </Form.Group>
                                )}>
                                    <i className='bi-plus-circle-fill h3'></i>
                                </FormModal>
                            </div>)
                        }
                        </React.Fragment>
                    )
                )}
            </ul>
        </div>
        <ErrorModal/>
        </>
    )

}

export default Settings;