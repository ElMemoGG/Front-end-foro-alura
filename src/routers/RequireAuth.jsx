import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";
/* import { useEffect } from "react"; */


const RequireAuth = () => {
    const {auth} = useAuth();
    const location = useLocation();
/*     const navigate = useNavigate();
    const from = location?.pathname || "/"; */


/*     useEffect(()=>{
        //console.log(auth, " requireAuth")
        if(auth !== null){
            navigate(from, { replace: true });
        }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[auth]) */

/*     if(!auth ){
        navigate(from, { replace: true });
    } */
  
    return ( 
         auth?.jwtToken ?
            <Outlet/>
            :
            <Navigate to="/login" state={{from: location }} replace/>
     );
}
 
export default RequireAuth;