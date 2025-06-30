import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { baseUrl } from '../utilities/Utilities';

const useSuperUser = () => {
    const [isSuperUser, setIsSuperUser] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const checkSuperUser = async () => {
            try {
                const token = localStorage.getItem('access');
                if (!token) {
                    navigate('/login');
                    return;
                }

                const response = await fetch(`${baseUrl}check-superuser/`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                const data = await response.json();

                if (response.ok) {
                    setIsSuperUser(data.is_superuser);
                } else {
                    throw new Error(data.message || 'Failed to verify superuser status');
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        checkSuperUser();
    }, [navigate]);

    return { isSuperUser, isLoading, error };
};

export default useSuperUser; 