import {ReactComponent as HeaderLargeImg} from '../assets/HomeHeader.svg';

function Header({children, style={}, className=''}){
    return(
        <header  className="sticky-top" style={{height:'10em'}}>
            <div>
                <div className='d-block d-sm-none'>
                    <div className='text-bg-primary' style={{width:'100%', height:'5em', margin:'0 0 -1em 0'}}></div>
                    <HeaderLargeImg width='100%' height='5em' preserveAspectRatio="xMinYMin slice"/>
                </div>
                <div className='d-none d-sm-block d-md-none'>
                    <div className='text-bg-primary' style={{width:'100%', height:'5em', margin:'0 0 -1em 0'}}></div>
                    <HeaderLargeImg width='100%' height='5em' preserveAspectRatio="xMinYMin slice"/>
                </div>
                <div className='d-none d-md-block d-lg-none'>
                    <div className='text-bg-primary' style={{width:'100%', height:'4em', margin:'0 0 -1em 0'}}></div>
                    <HeaderLargeImg width='100%' height='6em' preserveAspectRatio="xMinYMin slice"/>
                </div>
                <div className='d-none d-lg-block d-xl-none'>
                    <div className='text-bg-primary' style={{width:'100%', height:'4em', margin:'0 0 -1em 0'}}></div>
                    <HeaderLargeImg width='100%' height='6em' preserveAspectRatio="xMinYMin slice"/>
                </div>
                <div className='d-none d-xl-block d-xxl-none'>
                    <div className='text-bg-primary' style={{width:'100%', height:'4em', margin:'0 0 -1em 0'}}></div>
                    <HeaderLargeImg width='100%' height='6em' preserveAspectRatio="xMinYMin slice"/>
                </div>
                <div className='d-none d-xxl-block'>
                    <div className='text-bg-primary' style={{width:'100%', height:'4.5em', margin:'0 0 -.5em 0'}}></div>
                    <HeaderLargeImg width='100%' height='6em' viewBox='0 10 1728 114' preserveAspectRatio="xMinYMin slice"/>
                </div>
            </div>
            <div style={{margin:'-9em 0 0 0'}}>
                <div style={style} className={className}>
                    {children}
                </div>
            </div>
        </header>
    )
}

export default Header;