import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({isAuthenticated, children, isAdmin}) => {

    const { user } = useSelector(state => state.user);

    if(!isAuthenticated) {
        return <Navigate  to={"/login"} />
    }

    if(isAdmin === true && user.role !== "admin"){
        return <Navigate to={"/login"} /> 
    }

    return children ? children : <Outlet />
}

export default ProtectedRoute;




  // <Fragment>

        // { !loading && (
        //     <Route 
        //         {...rest}
        //         render = {(props) => {
        //             if(!isAuthenticated){
        //                 return <Navigate to="/login" />
        //             }


        //             return <Component {...props} />
        //         }}
        //     />
        // )}

        // </Fragment>