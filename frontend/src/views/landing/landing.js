import {useEffect, useState} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Header from '../../components/header'
import FormModal from '../../components/formModal'
import { Form } from 'react-bootstrap'
import {ReactComponent as PlusIcon} from '../../assets/plusIcon.svg';
import { AUTH_API_URL, BOARD_API_URL } from '../../constants/apiUrls';
import { apiDelete, apiGet, apiPost, apiPut, apiPutMultiple} from '../../utils/fetchData';

function Landing(){
    const navigate = useNavigate();
    const [apiAction, setApiAction] = useState('getUser');
    const [user, setUser] = useState({username:'Anonymus User', token:''})
    const [boards, setBoards] = useState({
        public: [
            {
                id: '0',
                name: 'Loading...',
                created: '',
                owner: null,
            },
        ],
        private: [
            {
                id: '0',
                name: 'Loading...',
                created: '',
                owner: -1,
            },
        ]
    }
    );
    const [previousBoards, setPreviousBoards] = useState({...boards});

    useEffect(() => {
        const getUser_ = async () => getUser();
        const getBoards_ = async () => getBoards(); 
        const postBoard_ = async (type) => postBoard(type);
        const deleteBoard_ = async (type) => deleteBoard(type);
        
        switch (apiAction){
            case 'getUser':
                getUser_();
                setApiAction('getBoards');
                break;
            case 'getBoards':
                getBoards_();
                setApiAction('')
                break;
            case 'createPublic':
                postBoard_('public');
                setApiAction('');
                break;
            case 'createPrivate':
                postBoard_('private');
                setApiAction('');
                break;
            case 'deletePublic':
                deleteBoard_('public');
                setApiAction('');
                break;
            case 'deletePrivate':
                deleteBoard_('private');
                setApiAction('');
                break;
            default:
                break;
                
        }
    }, [apiAction])

    async function getUser(){
        // Retrieve the username and bearer token
        let storedUsername = localStorage.getItem("username");
        let storedBearerToken = localStorage.getItem("bearerToken");

        // Check if the values exist
        if (storedUsername && storedBearerToken) {
            // set the stored values
            setUser({username: storedUsername, token: storedBearerToken})
        }
    }

    async function logIn(form, info){
        const username = form.elements.username.value
        const password = form.elements.password.value
        const credentials = btoa(`${username}:${password}`)
        const response = await fetch(`${AUTH_API_URL}/login/`, {
            method: 'POST',
            headers: new Headers({'Authorization': `Basic ${credentials}`})
        });
        if (!response.ok){
            document.dispatchEvent(new CustomEvent("error", {detail: 'Something went wrong, try again.'}));
        } else {
            const data= await response.json();
            localStorage.setItem("username", username);
            localStorage.setItem("bearerToken", data.token);
            setApiAction('getUser')
        }
    }

    async function logOut(){

    }

    async function signUp(event, info){

    }

    async function getBoards(){
        const boardData = await apiGet(`${BOARD_API_URL}`, user.token);
        setBoards({public: boardData.filter((board) => board.owner===null), private: boardData.filter((board) => board.owner!==null)});
    };

    async function postBoard(type){
        const createdBoard = type === 'private' ? boards.private.find((board) => board.id === -1) : boards.public.find((board) => board.id === -1);
        
        if (createdBoard){
            delete createdBoard.id;
            delete createdBoard.created;
        }
        const backendBoard = await apiPost(createdBoard, `${BOARD_API_URL}`, type === 'private' ? user.token : '')
        if (!backendBoard){
            setBoards(previousBoards);
        }
        createdBoard.id = backendBoard.id;
        createdBoard.created = backendBoard.created;
        createdBoard.owner = backendBoard.owner;
        setBoards({
            private: boards.private,
            public: boards.public
        });
    }

    async function deleteBoard(type){
        let i;
        let deletedBoard;
        if (type === 'public'){
            for (i=0; i < boards.public.length && boards.public[i].id === previousBoards.public[i].id; i++){

            }
            if (i === boards.public.length) {
            deletedBoard = previousBoards.public[i];
            }
        }
        if (type === 'private'){
            for (i=0; i < boards.private.length && boards.private[i].id === previousBoards.private[i].id; i++){
                
            }
            if (i === boards.private.length) {
                deletedBoard = previousBoards.private[i];
            }
        }
        let ok = await apiDelete(`${BOARD_API_URL}${deletedBoard.id}`, user.token);
        if (!ok){
            setBoards(previousBoards)
        }
        
    }

    function handleDeleteBoard(board){
        const boardBackUp = {...board};
        console.log(board)
        setPreviousBoards(() => JSON.parse(JSON.stringify(boards)));
        setBoards((prevBoards => {
            if (board.owner){
                const newPrivate = [...prevBoards.private];
                newPrivate.splice(newPrivate.indexOf(board),1);
                return {
                    public: prevBoards.public,
                    private: newPrivate,
                }
            } else {
                const newPublic = [...prevBoards.public];
                newPublic.splice(newPublic.indexOf(board),1);
                return {
                    public: newPublic,
                    private: prevBoards.private,
                }
            }
        }));

        if (board.owner){
            setApiAction('deletePrivate');
        } else {
            setApiAction('deletePublic');
        }
    }

    function handleCreateBoard(form, info){
        setPreviousBoards(JSON.parse(JSON.stringify(boards)));

        const createdBoard = {
            id: -1,
            name: form.elements.name.value,
            created: new Date().toISOString().slice(0,10)
        };

        setBoards((prevBoards) => {
            if (info.type === 'private') {
                const newPrivate = [...prevBoards.private];
                newPrivate.push(createdBoard);
                return {
                    private: newPrivate,
                    public: prevBoards.public,
                }
            } else {
                const newPublic = [...prevBoards.public];
                newPublic.push(createdBoard);
                return {
                    private: prevBoards.private,
                    public: newPublic,
                }
            }
        });

        if (info.type === 'private'){
            setApiAction('createPrivate');
        } else {
            setApiAction('createPublic');
        }
    }

    return(
        <>
        <Header>
            <div className='row align-items-center m-0'>
                <div className='col'>
                    <h1 className='fw-bold ps-2'>Kanban</h1>
                </div>
                <FormModal className='col-auto d-none d-md-block' title='Log in' submitText='Submit' formHandler={logIn}
                form={  <Form.Group controlId='Log in'>
                            <Form.Label>Username: </Form.Label>
                            <Form.Control type="text" name="username" required/>
                            <Form.Label>Password: </Form.Label>
                            <Form.Control type="password" name="password" required/>
                        </Form.Group>
                }>
                    <h5>Log in</h5>
                </FormModal>
                <FormModal className='col-auto d-none d-md-block' title='Sign up' formHandler={signUp}
                form={  <Form.Group controlId="Sign up">
                            <Form.Label>Username: </Form.Label>
                            <Form.Control type="text" name="username" required/>
                            <Form.Label>Password: </Form.Label>
                            <Form.Control type="password" name="password" required/>
                            <Form.Label>Repeat password: </Form.Label>
                            <Form.Control type="password" name="password" required/>
                        </Form.Group>}>
                    <h5 className='pe-2'>Sign up</h5>
                </FormModal>
                <div className='col-auto'>
                    { user.username === 'Anonymus User' ?
                    user.username.split(' ',2).map((line, index) => <h5 className='text-info text-end m-0' key={index}>{line}</h5>):
                    user.username.split(' ',2).map((line, index) => <h5 className='text-body text-end m-0' key={index}>{line}</h5>)
                    }
                </div>
                <div className='col-auto'>
                    {user.username === 'Anonymus User'? 
                    <i className='bi bi-person-circle text-info pe-2' style={{fontSize: '48px'}}></i>:
                    <i className='bi bi-person-circle text-body pe-2' style={{fontSize: '48px'}}></i>
                    }
                </div>
            </div>
            <div className='row justify-content-end m-0 d-flex d-md-none'>
                <FormModal className='col-auto' title='Log in' submitText='Submit' formHandler={logIn}
                form={  <Form.Group controlId='Log in'>
                            <Form.Label>Username: </Form.Label>
                            <Form.Control type="text" name="username" required/>
                            <Form.Label>Password: </Form.Label>
                            <Form.Control type="password" name="password" required/>
                        </Form.Group>
                }>
                    <h5>Log in</h5>
                </FormModal>
                <FormModal className='col-auto' title='Sign up' formHandler={signUp}
                form={  <Form.Group controlId="Sign up">
                            <Form.Label>Username: </Form.Label>
                            <Form.Control type="text" name="username" required/>
                            <Form.Label>Password: </Form.Label>
                            <Form.Control type="password" name="password" required/>
                            <Form.Label>Repeat password: </Form.Label>
                            <Form.Control type="password" name="password" required/>
                        </Form.Group>}>
                    <h5 className='pe-2'>Sign up</h5>
                </FormModal>
            </div>
        </Header>


        {user.token !== '' && <div id='privateBoards'>
            <h2 className='ps-3 fw-bold'>My Boards</h2>
            {
                boards.private.map((board) => (
                    <div className='card mx-3 my-2 d-block d-md-none' key={board.id}>
                        <div className='card-body row'>
                            <div className='col h5 m-0' onClick={() => navigate(`${board.id}`)}>{board.name}</div>
                            <div className='col-auto' onClick={() => navigate(`${board.id}/config`)}><i className='bi bi-gear-fill'></i></div>
                            <div className='col-auto' onClick={() => handleDeleteBoard(board)}><i className='bi bi-trash-fill'></i></div>
                        </div>
                    </div>
                ))
            }
            <FormModal className='m-3 d-block d-md-none' createdEntity='board' additionalInfo={{type: 'private',}} formHandler={handleCreateBoard} form={(
                <Form.Group controlId='createBoard'>
                    <Form.Label>Name: </Form.Label>
                    <Form.Control type="text" name="name" required/>
                </Form.Group>
            )} >
                <h5 className='text-info'>Create new board...</h5>
            </FormModal>

            <div className='row px-2 d-none d-md-flex'>
                {
                    boards.private.map((board) => (
                        <div className='col-md-3 col-xl-2 card mx-3 my-2' key={board.id}>
                            <div className='card-body row' onClick={() => navigate(`${board.id}`)}>
                                <div className='col m-0'>
                                    <h5>{board.name}</h5>
                                    <p>{`Created on ${board.created}`}</p>
                                </div>
                            </div>
                            <div className='card-footer row'>
                                <div className='col'>
                                <Link className='text-white' to={`${board.id}/config`} >Configure</Link> 
                                </div>
                                <div className='col'>
                                    <span className='text-decoration-underline' onClick={() => handleDeleteBoard(board)}>Delete</span>
                                </div>
                            </div>
                        </div>
                    ))
                }
                <FormModal className='col-md-3 col-xl-2 card text-bg-info mx-3' createdEntity='board' additionalInfo={{type: 'private',}} formHandler={handleCreateBoard} form={(
                    <Form.Group controlId='createBoard'>
                        <Form.Label>Name: </Form.Label>
                        <Form.Control type="text" name="name" required/>
                    </Form.Group>
                )} >
                    <div className='card-body row'>
                        <div className='col mb-3'><h5>Create new board</h5><div className='text-center'><PlusIcon/></div></div>
                    </div>
                </FormModal>
            </div>
        </div>}


        <div id='publicBoards'>
            <h2 className='ps-3 fw-bold'>Public Boards</h2>
            {
                boards.public.map((board) => (
                    <div className='card mx-3 my-2 d-block d-md-none' key={board.id}>
                        <div className='card-body row'>
                            <div className='col h5 m-0' onClick={() => navigate(`${board.id}`)}>{board.name}</div>
                            <div className='col-auto' onClick={() => navigate(`${board.id}/config`)}><i className='bi bi-gear-fill'></i></div>
                            <div className='col-auto' onClick={() => handleDeleteBoard(board)}><i className='bi bi-trash-fill'></i></div>
                        </div>
                    </div>
                ))
            }
            <FormModal className='m-3 d-block d-md-none' createdEntity='board' additionalInfo={{type: 'public',}} formHandler={handleCreateBoard} form={(
                <Form.Group controlId='createBoard'>
                    <Form.Label>Name: </Form.Label>
                    <Form.Control type="text" name="name" required/>
                </Form.Group>
            )} >
                <h5 className='text-info'>Create new board...</h5>
            </FormModal>

            <div className='row px-2 d-none d-md-flex'>
                {
                    boards.public.map((board) => (
                        <div className='col-md-3 col-xl-2 card mx-3 my-2' key={board.id}>
                            <div className='card-body row' onClick={() => navigate(`${board.id}`)}>
                                <div className='col m-0'>
                                    <h5>{board.name}</h5>
                                    <p>{`Created on ${board.created}`}</p>
                                </div>
                            </div>
                            <div className='card-footer row'>
                                <div className='col'>
                                <Link className='text-white' to={`${board.id}/config`} >Configure</Link> 
                                </div>
                                <div className='col'>
                                    <span className='text-decoration-underline' onClick={() => handleDeleteBoard(board)}>Delete</span>
                                </div>
                            </div>
                        </div>
                    ))
                }
                <FormModal className='col-md-3 col-xl-2 card text-bg-info mx-3 my-2' createdEntity='board' additionalInfo={{type: 'public'}} formHandler={handleCreateBoard} form={(
                    <Form.Group controlId='createBoard'>
                        <Form.Label>Name: </Form.Label>
                        <Form.Control type="text" name="name" required/>
                    </Form.Group>
                )} >
                    <div className='card-body row'>
                        <div className='col mb-3'><h5>Create new board</h5><div className='text-center'><PlusIcon/></div></div>
                    </div>
                </FormModal>
            </div>
        </div>
        </>
    )
}

export default Landing