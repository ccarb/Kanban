import React from 'react';
import background from '../../assets/HomeBackground.svg';
import {ReactComponent as HeaderLargeImg} from '../../assets/HomeHeader.svg';
import {ReactComponent as MapRoute} from '../../assets/MapRoute.svg';
import {ReactComponent as MapX} from '../../assets/MapX.svg';
import {ReactComponent as MapPoint} from '../../assets/MapPoint.svg';
import {ReactComponent as MapStart} from '../../assets/MapStart.svg';
import { Link } from 'react-router-dom';


function Home(props){
    const styles = {
        backgroundImage: `url(${background})`,
        backgroundSize: 'cover',
        backgroundPosition: 'left',
        backgroundAttachment: 'fixed',
        overflow: 'auto'
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
                <div className='d-none d-xl-block d-xxl-none' style={{position:'absolute', width:'100%'}}>
                    <HeaderLargeImg width='100%' height='100%' viewBox='0 100 1400 325'/>
                </div>
                <div className='d-none d-xxl-block' style={{position:'absolute', width:'100%'}}>
                    <HeaderLargeImg width='100%' height='100%' viewBox='0 150 1400 325'/>
                </div>
                <div style={{position:'relative', left:'2em', top:'1em', width:'80%'}}>
                    <h1 className='fw-bold text-primary'>Cecilia's Sandbox</h1>
                    <Link className='h4 text-body' to='https://www.linkedin.com/in/cecilia-andrea-carbonaro/'>Contact me</Link>
                </div>
            </header>
        )
    }

    return (
        <div className='container-fluid h-100 p-0' style={styles}>
            <Header/>
            <div>
                <div id="intro" className='mt-3 mx-3'>
                    <h2>Welcome! This site maps my journey to become a professional web developer. </h2>
                    <p>You can see my latest mileston below. You can check previous milestones scrolling down.</p>
                </div> 
                <div className='w-100 pt-3 m-0'>
                    <div className='w-100 p-0' style={{margin: '0px', height: '21em'}}>
                        <div style={{margin:'0px', width:'30%', padding:'0', textAlign: 'center'}}>
                            <MapRoute style={{width:'100%', height: '26.25em', padding:'5.25em 0 0 0', margin:'auto'}}/>
                        </div>
                        <div style={{margin: '-26.25em 0px 0px 0px', width: '30%', padding:'0', textAlign: 'center'}}>
                            <MapX style={{width: '100%', height:'10.5em', padding:'0'}}/>
                        </div>            
                        <div style={{margin: '-10.5em 30%', width:'70%', height:'10.5em', padding:'0', display:'table'}}>
                            <div className='p-3' style={{display: 'table-cell', verticalAlign: 'middle'}}>
                                <h3 className='d-none d-md-inline'>It is time to start the real project, the one I set to accomplish. Behold my Kanban board...</h3>
                                <p className='d-inline d-md-none'>It is time to start the real project, the one I set to accomplish. Behold my Kanban board...</p>
                                <p className='text-center'><Link className='btn btn-primary' to='kanban/5'>Take me to the board!</Link></p>
                            </div>
                        </div>
                    </div>
                    <div className='w-100 p-0' style={{margin: '0px', height: '21em'}}>
                        <div style={{margin: '0', width:'30%', padding:'0', textAlign: 'center'}}>
                            <MapRoute style={{width:'100%', height: '26.25em', padding:'5.25em 0 0 0', margin:'auto'}}/>
                        </div>
                        <div style={{margin: '-26.25em 0 0 0', width: '30%', padding:'0', textAlign: 'center'}}>
                            <MapPoint style={{width: '100%', height:'10.5em', padding:'0'}}/>
                        </div>            
                        <div style={{margin: '-10.5em 30%', width:'70%', height:'10.5em', padding:'0', display:'table'}}>
                            <div className='p-3' style={{display: 'table-cell', verticalAlign: 'middle'}}>
                                <h3 className='d-none d-md-inline'>Here I feel like building a some lists, I will save them somewhere safe...</h3>
                                <p className='d-inline d-md-none'>Here I feel like building a some lists, I will save them somewhere safe...</p>
                                <p className='text-center'><Link className='btn btn-primary' to='checklists'>Take me to the lists!</Link></p>
                            </div>
                        </div>
                    </div>
                    <div className='w-100 p-0 m-0'>
                        <div style={{margin: '0 0 0 0', width: '30%', padding:'0', textAlign: 'center'}}>
                            <MapStart style={{width: '100%', height:'10.5em', padding:'0'}}/>
                        </div>
                        <div style={{margin: '-10.5em 30%', width:'70%', height:'10.5em', padding:'0', display:'table'}}>
                            <div className='p-3' style={{display: 'table-cell', verticalAlign: 'middle'}}>
                                <h3 className='d-none d-md-inline'>Journey's start</h3>
                                <p className='d-inline d-md-none'>Journey's start</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home;