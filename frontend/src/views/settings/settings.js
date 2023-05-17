import { useEffect, useState } from 'react';
import { useNavigate, useLoaderData} from 'react-router';

import { BOARD_API_URL } from '../../constants/apiUrls';
import ErrorModal from '../../components/errorModal';
import { apiDelete, apiGet, apiPut} from './fetchData';

function Settings(){
    const navigate = useNavigate();
    const boardId = useLoaderData();
    const [board, setBoard] = useState({id: -1, name: 'Loading...', created: ''})
    const [columns, setColumns] = useState([{id: -1, name: '', type: 'N', order: -1, created: '', board: boardId}])
    const plusIconSize=2;//em

    useEffect(() => {
        const getSettingsData = async (boardId) => {
            const boardData = await apiGet(`${BOARD_API_URL}${boardId}`);
            const columnsData = await apiGet(`${BOARD_API_URL}${boardId}/columns`);
            setBoard(boardData['0']);
            setColumns(columnsData.columns);
        }
        getSettingsData(boardId);
    },[boardId]);

    async function handleEditBoard(event){
        const form = event.target;
        const newName = form.elements.name.value;
        const oldBoardObject = {...board};
        const newBoardObject = {...board};//HEADS UP works because values are inmutable
        newBoardObject.name=newName;
        setBoard(newBoardObject);
        const ok = await apiPut(newBoardObject, `${BOARD_API_URL}${boardId}`);
        if (!ok) {
            setBoard(oldBoardObject);
        }
    };
    async function handleDeleteBoard(){
        const BoardObjectBackUp = {...board};//HEADS UP works because values are inmutable
        const ok = await apiDelete(`${BOARD_API_URL}${boardId}`);
        if (ok) {
            alert('Board erased');
            navigate("/");
        } else {
            setBoard(BoardObjectBackUp);
        }
    };

    async function handleEditColumn(){};
    async function handleDeleteColumn(){};
    async function handleCreateColumn(){};
    async function handleReorderColumn(){};

    return (
        <>
        <div className='p-3 bg-secondary text-light'>
            <h1>{board.name}</h1>
            <h1>Settings</h1>
        </div>
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
            <p>Backlog and archive columns can only be renamed.</p>
            <ul className='list-group pb-3'>
                <li className='list-group-item ms-5 me-3'>
                    <div className='row align-items-center'>
                        <div className='col'>Test</div>
                        <div className='col-2'><div className='row'><i className='bi-dash-lg'></i></div><div className='row'><i className='bi-chevron-down'></i></div></div>
                        <div className='col-2'><i className='bi-pencil-fill'></i></div>
                    </div>
                </li>
                <div className='row align-items-center' style={{height:`${plusIconSize}em`, margin:`-${plusIconSize/2}em 0px -${plusIconSize/2}em`}}>
                    <div className='col'><i className='bi-plus-circle-fill h3'></i></div>
                </div>
                <li className='list-group-item ms-5 me-3'>
                    <div className='row align-items-center'>
                        <div className='col'>Aset</div>
                        <div className='col-2'><div className='row' onClick={handleReorderColumn}><i className='bi-chevron-up'></i></div><div className='row' onClick={handleReorderColumn}><i className='bi-chevron-down'></i></div></div>
                        <div className='col-2' onClick={handleEditColumn}><i className='bi-pencil-fill'></i></div>
                    </div>
                </li>
                <div className='row align-items-center' style={{height:`${plusIconSize}em`, margin:`-${plusIconSize/2}em 0px -${plusIconSize/2}em`}}>
                    <div className='col'><i className='bi-plus-circle-fill h3'></i></div>
                </div>
                <li className='list-group-item ms-5 me-3'>
                    <div className='row align-items-center'>
                        <div className='col'>Ipsum</div>
                        <div className='col-2'><div className='row'><i className='bi-chevron-up'></i></div><div className='row'><i className='bi-dash-lg'></i></div></div>
                        <div className='col-2'><i className='bi-pencil-fill'></i></div>
                    </div>
                </li>
            </ul>
        </div>
        <ErrorModal/>
        </>
    )

}

export default Settings