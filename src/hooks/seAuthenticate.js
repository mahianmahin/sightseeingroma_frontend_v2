import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { baseUrl } from "../utilities/Utilities";

export default function useAuthenticate(parameter) {
    const verifyHeader = {
        mode: 'cors',
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            token: window.localStorage['refresh']
        })
    };
    
    const refreshHeader = {
        mode: 'cors',
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            refresh: window.localStorage['refresh']
        })
    };

    const navigate = useNavigate();

    useEffect(() => {
        if (!window.localStorage['refresh']) {
            // navigate('/login/');
        } else {
            fetch(`${baseUrl}api/token/verify/`, verifyHeader)
                .then(response => {
                    if (response.ok) {
                        parameter(true);
                    } else {
                        parameter(false);
                    }
                })
        }
    }, [])
}