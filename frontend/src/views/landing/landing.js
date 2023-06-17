import {useEffect, useState} from 'react'
import Header from '../../components/header'

function Landing(){
    const [user, setUser] = useState({username:'Anonymus User'})

    useEffect(() => {
        // get/save user
        // get boards
        // sync changes with api
    })

    return(
        <>
        <Header>
            <div className='row align-items-center m-0'>
                <div className='col'>
                    <h1 className='fw-bold ps-2'>Kanban</h1>
                </div>
                <div className='col-auto'>
                    {user.username.split(' ',2).map((line) => <h5 className='text-info text-end m-0'>{line}</h5>)}
                </div>
                <div className='col-auto'>
                    <i className='bi bi-person-circle text-info pe-2' style={{fontSize: '48px'}}></i>
                </div>
            </div>
            <div className='row justify-content-end m-0'>
                <div className='col-auto'>
                    <h5>Log in</h5>
                </div>
                <div className='col-auto'>
                    <h5 className='pe-2'>Sign up</h5>
                </div>
            </div>
        </Header>
        <h2 className='ps-3 fw-bold'>My Boards</h2>
        <div className='card mx-3'>
            <div className='card-body row'>
                <div className='col h5 m-0'>Example board</div>
                <div className='col-auto'><i className='bi bi-gear-fill'></i></div>
                <div className='col-auto'><i className='bi bi-trash-fill'></i></div>
            </div>
        </div>
        <div className='m-3'>
            <h5 className='text-info'>Create new board...</h5>
        </div>
        </>
    )
}

export default Landing