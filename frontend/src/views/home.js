import React from 'react';
import mySVG from '../assets/HomeBackground.svg';


function Home(props){
    const styles = {
        backgroundImage: `url(${mySVG})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'absolute',
        top: '0 px',
        left: '0 px'
    };

    return (
        <>
            <div style={styles}>
                <div id="body" className='container mt-3 mx-3'>
                    <h1>Cecilia's Sandbox</h1>
                    <h2>Welcome! This site maps my journey to become a professional web developer. </h2>
                    <p>You can see the current milestone clicking the cross on the left.</p>
                    <p>You can also check previous milestones scrolling down.</p>
                </div>
            </div>
        </>
    )
}

export default Home;