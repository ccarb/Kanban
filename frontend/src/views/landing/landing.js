import {useEffect, useState} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Header from '../../components/header'
import FormModal from '../../components/formModal'
import { Form } from 'react-bootstrap'
import {ReactComponent as PlusIcon} from '../../assets/plusIcon.svg';
import { BOARD_API_URL } from '../../constants/apiUrls';
import { apiDelete, apiGet, apiPost, apiPut, apiPutMultiple} from '../../utils/fetchData';

function Landing(){
    const navigate = useNavigate();
    const [apiAction, setApiAction] = useState('get');
    const [user, setUser] = useState({username:'Anonymus User', token:''})
    const [boards, setBoards] = useState({
        public: [
            {
                id: '0',
                name: 'Loading...',
                created: '',
                owner: '',
            },
        ],
        private: [
            {
                id: '0',
                name: 'Loading...',
                created: '',
                owner: '',
            },
        ]
    }
    )

    useEffect(() => {
        const getUser_ = async () => getUser();
        const getBoards_ = async () => getBoards(); 
        
        switch (apiAction){
            case 'get':
                getUser_();
                getBoards_();
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

    async function getBoards(){
        const boardData = await apiGet(`${BOARD_API_URL}`);
        setBoards({public: boardData.filter((board) => board.owner===null), private: boardData.filter((board) => board.owner!==null)})
    };

    function handleDeleteBoard(){
        return 0;
    }

    function handleCreateBoard(){

    }

    return(
        <>
        <Header>
            <div className='row align-items-center m-0'>
                <div className='col'>
                    <h1 className='fw-bold ps-2'>Kanban</h1>
                </div>
                <FormModal className='col-auto d-none d-md-block' title='Log in' submitText='Submit'
                form={  <Form.Group controlId='Log in'>
                            <Form.Label>Username: </Form.Label>
                            <Form.Control type="text" name="username" required/>
                            <Form.Label>Password: </Form.Label>
                            <Form.Control type="password" name="password" required/>
                        </Form.Group>
                }>
                    <h5>Log in</h5>
                </FormModal>
                <FormModal className='col-auto d-none d-md-block' title='Sign up' 
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
                <FormModal className='col-auto' title='Log in' submitText='Submit'
                form={  <Form.Group controlId='Log in'>
                            <Form.Label>Username: </Form.Label>
                            <Form.Control type="text" name="username" required/>
                            <Form.Label>Password: </Form.Label>
                            <Form.Control type="password" name="password" required/>
                        </Form.Group>
                }>
                    <h5>Log in</h5>
                </FormModal>
                <FormModal className='col-auto' title='Sign up' 
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
        <div id='privateBoards'>
            <h2 className='ps-3 fw-bold'>My Boards</h2>
            {
                boards.private.map((board) => (
                    <div className='card mx-3 my-2 d-block d-md-none' key={board.id}>
                        <div className='card-body row'>
                            <div className='col h5 m-0' onClick={() => navigate(`${board.id}`)}>{board.name}</div>
                            <div className='col-auto' onClick={() => navigate(`${board.id}/config`)}><i className='bi bi-gear-fill'></i></div>
                            <div className='col-auto' onClick={handleDeleteBoard}><i className='bi bi-trash-fill'></i></div>
                        </div>
                    </div>
                ))
            }
            <div className='m-3 d-block d-md-none' onClick={handleCreateBoard}>
                <h5 className='text-info'>Create new board...</h5>
            </div>
            <div className='row px-2 d-none d-md-flex'>
                {
                    boards.private.map((board) => (
                        <div className='col-md-3 col-xl-2 card mx-3' key={board.id}>
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
                                    <span className='text-decoration-underline' onClick={handleDeleteBoard}>Delete</span>
                                </div>
                            </div>
                        </div>
                    ))
                }
                <div className='col-md-3 col-xl-2 card text-bg-info mx-3'>
                    <div className='card-body row'>
                        <div className='col mb-3' onClick={handleCreateBoard}><h5>Create new board</h5><div className='text-center'><PlusIcon/></div></div>
                    </div>
                </div>
            </div>
        </div>


        <div id='publicBoards'>
            <h2 className='ps-3 fw-bold'>Public Boards</h2>
            {
                boards.public.map((board) => (
                    <div className='card mx-3 my-2 d-block d-md-none' key={board.id}>
                        <div className='card-body row'>
                            <div className='col h5 m-0' onClick={() => navigate(`${board.id}`)}>{board.name}</div>
                            <div className='col-auto' onClick={() => navigate(`${board.id}/config`)}><i className='bi bi-gear-fill'></i></div>
                            <div className='col-auto' onClick={handleDeleteBoard}><i className='bi bi-trash-fill'></i></div>
                        </div>
                    </div>
                ))
            }
            <div className='m-3 d-block d-md-none' onClick={handleCreateBoard}>
                <h5 className='text-info'>Create new board...</h5>
            </div>

            <div className='row px-2 d-none d-md-flex'>
                {
                    boards.public.map((board) => (
                        <div className='col-md-3 col-xl-2 card mx-3' key={board.id}>
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
                                    <span className='text-decoration-underline' onClick={handleDeleteBoard}>Delete</span>
                                </div>
                            </div>
                        </div>
                    ))
                }
                <div className='col-md-3 col-xl-2 card text-bg-info mx-3'>
                    <div className='card-body row'>
                        <div className='col mb-3' onClick={handleCreateBoard}><h5>Create new board</h5><div className='text-center'><PlusIcon/></div></div>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}

export default Landing