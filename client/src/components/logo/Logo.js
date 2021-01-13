import React from 'react';
import Tilt from 'react-tilt';
import brain from './brain.png'

const Logo = () => {
    return (
        <div className="ml4 mt0">
            <Tilt className="Tilt br2" options={{ max: 40 }} style={{ height: 150, width: 150 }} >
                <div className="Tilt-inner" style={{display:'flex',}}>
                    <img className="pointer grow" height="80px" width="80px" alt="logo" src={brain}/>
                </div>
            </Tilt>
        </div>
    )
}

export default Logo;