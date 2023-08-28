import { useState, useEffect } from 'react';

const UseScreenSize = () => {

    const [heigth, setHeight] = useState(window.innerHeight);
    const [width, setWidth] = useState(window.innerWidth);
    
    useEffect( () => {
        window.addEventListener('resize', handleResize);
        
        return ()=>{
            window.addEventListener('resize', handleResize);
        }
        
    }, [] );
    
    const handleResize = () => {
        setHeight(window.innerHeight);
        setWidth(window.innerWidth);
    }
    return { heigth, width };

}

export default UseScreenSize;