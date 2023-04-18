import React from 'react';
import './home.css';
import background from '../assets/HomeBackground.svg';
import {ReactComponent as HeaderLargeImg} from '../assets/HomeHeader.svg';
import {ReactComponent as MapPath} from '../assets/MapPath.svg';
import { Link } from 'react-router-dom';


function Home(props){
    const styles = {
        backgroundImage: `url(${background})`,
        backgroundSize: 'cover',
        backgroundPosition: 'left',
    };

    function Header(props){
        return(
            <header  className="sticky-top" style={{height:'10em'}}>
                <div className='d-block d-sm-none' style={{position:'absolute', width:'100%'}}>
                    <HeaderLargeImg width='100%' height='100%' viewBox='0 0 800 325'/>
                </div>
                <div className='d-none d-sm-block d-md-none' style={{position:'absolute', width:'100%'}}>
                    <HeaderLargeImg width='100%' height='100%' viewBox='0 0 1400 325'/>
                </div>
                <div className='d-none d-md-block d-xl-none' style={{position:'absolute', width:'100%'}}>
                    <HeaderLargeImg width='100%' height='100%'/>
                </div>
                <div className='d-none d-xl-block' style={{position:'absolute', width:'100%'}}>
                    <HeaderLargeImg width='100%' height='100%' viewBox='0 100 1400 325'/>
                </div>
                <div style={{position:'relative', left:'2em', top:'1em', width:'80%'}}>
                    <h1 className='text-primary'>Cecilia's Sandbox</h1>
                    <h4>Contact me</h4>
                </div>
            </header>
        )
    }

    return (
        <div className='container-fluid h-100 p-0' style={styles}>
            <Header/>
            <div id="intro" className='mt-3 mx-3'>
                <h2>Welcome! This site maps my journey to become a professional web developer. </h2>
                <p>You can check previous milestones scrolling down.</p>
            </div>
            <div className='container'>
                <MapPath width='20%' height='100%' className='d-none d-md-block float-start align-top mt-3 ' />
                <MapPath width='39%' height='100%' className='d-block d-md-none float-start align-top mt-3 ' />
                <span id="x-marks-the-spot" className='d-none d-md-block w-75 align-top float-end my-3 mx-3'>
                    <h3>With pictures of the Kanban site fresh in my mind, I continue forward. I arrive at a checklist app... </h3>
                    <div className='w-100 text-center'>
                        <Link to="/checklists" className="btn btn-primary">Take me there</Link>
                    </div>
                </span>
                <span id="x-marks-the-spot" className='d-block d-md-none w-50 align-top float-end mt-3 mx-3'>
                    With pictures of the Kanban site fresh in my mind, I continue forward. I arrive at a checklist app...
                    <div className='w-100 text-center mt-1'>
                        <Link to="/checklists" className="btn btn-primary">Take me there</Link>
                    </div>
                </span>
            </div>
        </div>
    )
}

export default Home;