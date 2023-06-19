import {useEffect, useState} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Header from '../../components/header'
import FormModal from '../../components/formModal'
import { Form } from 'react-bootstrap'
import {ReactComponent as PlusIcon} from '../../assets/plusIcon.svg';

function Landing(){
    const [user, setUser] = useState({username:'Anonymus User'})
    const navigate = useNavigate();
    const [boards, setBoards] = useState([
        {
            id: '0',
            name: 'Loading...',
            created: '',
            owner: '',
        },
    ])

    useEffect(() => {
        // get/save user
        // get boards
        // sync changes with api
    })

    function handleDeleteBoard(){
        return 0;
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
                    {user.username.split(' ',2).map((line) => <h5 className='text-info text-end m-0'>{line}</h5>)}
                </div>
                <div className='col-auto'>
                    <i className='bi bi-person-circle text-info pe-2' style={{fontSize: '48px'}}></i>
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
        <h2 className='ps-3 fw-bold'>My Boards</h2>
        <div className='card mx-3 d-block d-md-none'>
            <div className='card-body row'>
                <div className='col h5 m-0'>Example board</div>
                <div className='col-auto' onClick={() => navigate(`${boards[0].id}/config`)}><i className='bi bi-gear-fill'></i></div>
                <div className='col-auto' onClick={handleDeleteBoard}><i className='bi bi-trash-fill'></i></div>
            </div>
        </div>
        <div className='m-3 d-block d-md-none'>
            <h5 className='text-info'>Create new board...</h5>
        </div>

        <div className='row px-2 d-none d-md-flex'>
            <div className='col-md-3 col-xl-2 card mx-3'>
                <div className='card-body row'>
                    <div className='col m-0'>
                        <h5>Example board</h5>
                        <p>Created on 07/05/2023</p>
                        <Link className='text-white' to={`${boards[0].id}/config`} >Configure</Link> <span className='text-decoration-underline' onClick={handleDeleteBoard}>Delete</span>
                    </div>
                </div>
            </div>
            <div className='col-md-3 col-xl-2 card text-bg-info mx-3'>
                <div className='card-body row'>
                    <div className='col mb-3'><h5>Create new board</h5><div className='text-center'><PlusIcon/></div></div>
                </div>
            </div>
            
        </div>
        </>
    )
}

export default Landing