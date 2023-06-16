import {ReactComponent as HeaderLargeImg} from '../assets/HomeHeader.svg';

function Header({children, style={}, className=''}){
    return(
        <header  className="sticky-top" style={{height:'10em'}}>
            <div style={{height:'10em'}}>
                <div className='d-block d-sm-none align-items-start' >
                        <HeaderLargeImg width='100%' height='100%' viewBox='5 5 805 325'/>
                </div>
                <div className='d-none d-sm-block d-md-none'>
                    <HeaderLargeImg width='100%' height='100%' viewBox='5 5 1405 325'/>
                </div>
                <div className='d-none d-md-block d-xl-none'>
                    <HeaderLargeImg width='100%' height='100%' viewBox='5 5 1920 325'/>
                </div>
                <div className='d-none d-xl-block d-xxl-none'>
                    <HeaderLargeImg width='100%' height='100%' viewBox='5 100 1405 325'/>
                </div>
                <div className='d-none d-xxl-block'>
                    <HeaderLargeImg width='100%' height='100%' viewBox='5 150 1405 325'/>
                </div>
            </div>
            <div style={{margin: '-10em 0 0 0'}}>
                <div style={style} className={className}>
                    {children}
                </div>
            </div>
        </header>
    )
}

export default Header;