import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'


function Logout() {
    const navigate = useNavigate();
 
    const hadleLogout = () =>{
        localStorage.removeItem('token')
        navigate('/login')
    }
  return (
    <button onClick={hadleLogout}>logout</button>
  )
}

export default Logout