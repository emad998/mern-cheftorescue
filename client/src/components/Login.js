import React from 'react'
import { GoogleLogin } from 'react-google-login';
import axios from 'axios'
import {useDispatch, useSelector} from 'react-redux'
import {addToken} from '../redux/user'
import { useHistory } from "react-router-dom";

function Login() {
    const dispatch = useDispatch()
    let history = useHistory();

    const {stayLoggedIn} = useSelector((state) => state.user)

    const handleLogin = async (googleData) => {
        
        try {
          const res= await axios.post('http://localhost:5000/api/v1/auth/google', {
            token: googleData.tokenId
          });
          await dispatch(addToken(googleData.tokenId))
        //   console.log(res);
          history.push('/welcome')
          
        } catch (error) {
          console.error(error);
        }
      }
    return (
        <div>
           <h1>Welcome to chef to Rescue</h1>
      <GoogleLogin
    clientId="418479286522-kdaphilh80lfvodbnn8dnehv1htea6rp.apps.googleusercontent.com"
    buttonText="Login"
    onSuccess={handleLogin}
    onFailure={handleLogin}
    isSignedIn={true}
    cookiePolicy={'single_host_origin'}
  />, 
        </div>
    )
}

export default Login
