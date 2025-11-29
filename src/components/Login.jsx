import React, {useState} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import { login as authLogin } from '../store/authSlice'
import {Button, Input, Logo} from "./index"
import {useDispatch} from "react-redux"
import authService from "../appwrite/auth"
import {useForm} from "react-hook-form"

function Login() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const {register, handleSubmit} = useForm()
    const [error, setError] = useState("")

    const login = async(data) => {
        setError("")
        try {
            const session = await authService.login(data)
            if (session) {
                const userData = await authService.getCurrentUser()
                if(userData) dispatch(authLogin(userData));
                navigate("/")
            }
        } catch (error) {
            setError(error.message)
        }
    }

    return (
        // Main container uses flex-col to stack items vertically and centers them
        <div className='flex flex-col items-center justify-center w-full py-8'>
            
            {/* === BOX 1: LOGIN FORM (Max width: lg) === */}
            <div className={`mx-auto w-full max-w-lg bg-gray-100 rounded-xl p-10 border border-black/10`}>
                <div className="mb-2 flex justify-center">
                    <span className="inline-block w-full max-w-[100px]">
                        <Logo width="100%" />
                    </span>
                </div>
                <h2 className="text-center text-2xl font-bold leading-tight">Sign in to your account</h2>
                <p className="mt-2 text-center text-base text-black/60">
                    Don&apos;t have any account?&nbsp;
                    <Link
                        to="/signup"
                        className="font-medium text-primary transition-all duration-200 hover:underline"
                    >
                        Sign Up
                    </Link>
                </p>
                {error && <p className="text-red-600 mt-8 text-center">{error}</p>}
                
                {/* Login Form */}
                <form onSubmit={handleSubmit(login)} className='mt-8'>
                    <div className='space-y-5'>
                        <Input
                            label="Email: "
                            placeholder="Enter your email"
                            type="email"
                            {...register("email", {
                                required: true,
                                validate: {
                                    matchPatern: (value) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                                    "Email address must be a valid address",
                                }
                            })}
                        />
                        <Input
                            label="Password: "
                            type="password"
                            placeholder="Enter your password"
                            {...register("password", {
                                required: true,
                            })}
                        />
                        <Button
                            type="submit"
                            className="w-full"
                        >Sign in</Button>
                    </div>
                </form>
            </div>
            {/* ==================================================== */}


            {/* === BOX 2: DEMO CREDENTIALS (Centered, Smaller Width: sm, with gap-y) === */}
            <div className={`mt-8 w-full max-w-sm bg-gray-100 rounded-xl p-6 border border-black/10`}>
                
                <h3 className='text-lg font-bold mb-3 text-black/80 flex items-center justify-center'>
                    ✨ Demo Access
                </h3>
                
                {/* Username Row */}
                <div className='flex justify-between items-center mb-2 p-2 bg-white rounded-lg border border-gray-200'>
                    <strong className='text-sm text-black/70 w-1/3'>Email:</strong> 
                    <span 
                        className='font-mono text-sm text-black/90 w-2/3 truncate text-right font-semibold'
                    >
                        eee@student.nitandhra.ac.in
                    </span>
                </div>
                
                {/* Password Row */}
                <div className='flex justify-between items-center p-2 bg-white rounded-lg border border-gray-200'>
                    <strong className='text-sm text-black/70 w-1/3'>Password:</strong> 
                    <span 
                        className='font-mono text-sm text-black/90 w-2/3 truncate text-right font-semibold'
                    >
                        123456789
                    </span>
                </div>
                
                <p className='mt-4 text-xs text-black/50 text-center'>
                    Use these credentials to try out the application instantly.
                </p>
            </div>
            {/* ==================================================== */}

        </div>
    )
}

export default Login