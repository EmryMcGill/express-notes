import { Outlet } from "react-router"
import { useNavigate } from "react-router";
import { useEffect } from "react";

import { usePocket } from "../PbContext"


const Protected = () => {
    
    const navigate = useNavigate();
    const { user } = usePocket();

    // check if user token exists
    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    })

    return (
        <Outlet />
    );
}

export default Protected;