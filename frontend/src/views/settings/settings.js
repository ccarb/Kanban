import { useEffect, useState } from 'react';
import {useLoaderData} from 'react-router';

import { BOARD_API_URL } from '../../constants/apiUrls';
import ErrorModal from '../../components/errorModal';
import { apiGet} from './fetchData';

function Settings(){
    const boardId = useLoaderData();
    const [board, setBoard] = useState({id: -1, name: 'Loading...', created: ''})
    const [columns, setColumns] = useState([{id: -1, name: '', type: 'N', order: -1, created: '', board: boardId}])

    useEffect(() => {
        const getSettingsData = async (boardId) => {
            const boardData = await apiGet(`${BOARD_API_URL}${boardId}`);
            const columnsData = await apiGet(`${BOARD_API_URL}${boardId}/columns`);
            setBoard(boardData['0']);
            setColumns(columnsData.columns);
        }
        getSettingsData(boardId);
        
    },[boardId]);
    
    return (
        <>
        <div>
            <h1>
                {board.name}
            </h1>
            <ul>
            {columns.map(column => (<li key={column.id}>{column.name}</li>) )}
            </ul>
        </div>
        
        <ErrorModal/>
        </>
    )

}

export default Settings