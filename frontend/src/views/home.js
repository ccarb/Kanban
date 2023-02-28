import React from 'react';
import './home.css';
import background from '../assets/HomeBackground.svg';
import {ReactComponent as HeaderLargeImg} from '../assets/HomeHeader.svg';


function Home(props){
    const styles = {
        backgroundImage: `url(${background})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'absolute',
        top: '0 px',
        left: '0 px',        
        width: '100%',
        height: '100%'
    };

    function Header(props){
        return(
            <header  className="sticky-top" style={{height:'33%'}}>
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
                <div style={{position:'relative', left:'2em', top:'1em'}}>
                    <h1 className='text-primary'>Cecilia's Sandbox</h1>
                    <h4>Contact me</h4>
                </div>
            </header>
        )
    }

    return (
        <>
            <div style={styles}>
                <Header/>
                <div id="body" className='container mt-3 mx-3'>
                    <h2>Welcome! This site maps my journey to become a professional web developer. </h2>
                    <p>You can see the current milestone clicking the cross on the left.</p>
                    <p>You can also check previous milestones scrolling down.</p>
                </div>
            </div>
        </>
    )
}

export default Home;