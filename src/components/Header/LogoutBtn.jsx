import React from 'react'
import {useDispatch} from 'react-redux'
import authService from '../../appwrite/auth'
import {logout} from '../../store/authSlice'

function LogoutBtn() {
    const dispatch = useDispatch()
    const logoutHandler = () => {
        authService.logout().then(() => {
            dispatch(logout())
        })
    }
  return (
    <button
    className="text-white uppercase text-sm font-semibold tracking-wider 
         px-10 py-1 rounded-full 
         duration-200 hover:text-yellow-300 
         active:scale-95"
    onClick={logoutHandler}
    >Logout</button>
  )
}

export default LogoutBtn