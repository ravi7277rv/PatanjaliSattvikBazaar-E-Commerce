import React, { Fragment, useEffect } from 'react';
import Metadata from '../layout/MetaData';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Loader from '../layout/Loader/Loader';
import { useNavigate } from 'react-router-dom';
import './Profile.css'




const Profile = () => {

    const navigate = useNavigate();
    const { user, loading, isAuthenticated } = useSelector(state => state.user);

    useEffect(() => {

        if (isAuthenticated === false) {
            navigate("/login");
        }

    }, [navigate, isAuthenticated, loading])

    return (
        <Fragment>
            {loading ? (
                <Loader />
            ) : (
                <Fragment>
                    <Metadata title={`${user.name}'s Profile`} />
                    <div className="maincontainer">
                        <div className="profileContainer">
                            <h1 className='headingh1'>My Profile  As : {user.role}</h1>
                            <img src={user.avatar.url} alt={user.name} />
                            <Link className='editLink' to="/me/updateProfile" >Edit Profile</Link>
                        </div>
                        <div className='profiledetails'>
                            <div className='profilename'>
                                <h4>Full Name</h4>
                                <p>{user.name}</p>
                            </div>
                            <div className='profileemail'>
                                <h4>Email</h4>
                                <p>{user.email}</p>
                            </div>
                            <div className='profilejoindate'>
                                <h4>Joined On</h4>
                                <p>{String(user.createdAt).substr(0, 10)}</p>
                            </div>

                            <div className='buttonlink'>
                                <Link className='btnorderlink' to="/orders">My Orders</Link>
                                <Link className='btnpasslink' to="/password/update">Change Password</Link>
                            </div>
                        </div>
                    </div>
                </Fragment>
            )}
        </Fragment>
    );
}

export default Profile;
