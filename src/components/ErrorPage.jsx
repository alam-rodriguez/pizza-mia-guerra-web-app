// React
import { useEffect } from 'react';

// React Router
import { useNavigate } from 'react-router-dom'

function ErrorPage() {

    const navigate = useNavigate();

    useEffect( () => {
        navigate('/home');
    });
}

export default ErrorPage;
