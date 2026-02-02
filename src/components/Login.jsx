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
        /* Main Container: Pure Black */
        <div className='flex flex-col items-center justify-center w-full min-h-screen py-12 bg-black'>
            
            {/* === BOX 1: LOGIN FORM (White Card) === */}
            <div className='mx-auto w-full max-w-lg bg-white rounded-2xl p-10 shadow-[0_0_20px_rgba(255,255,255,0.1)]'>
                <div className="mb-4 flex justify-center">
                    <span className="inline-block w-full max-w-[100px]">
                        <Logo width="100%" />
                    </span>
                </div>
                
                <h2 className="text-center text-3xl font-bold text-black tracking-tight">
                    Welcome Back
                </h2>
                <p className="mt-2 text-center text-base text-gray-600">
                    Sign in to your account
                </p>

                {error && (
                    <p className="text-red-600 mt-6 text-center text-sm font-medium">{error}</p>
                )}
                
                <form onSubmit={handleSubmit(login)} className='mt-8'>
                    <div className='space-y-5'>
                        <Input
                            label="Email"
                            placeholder="Enter your email"
                            type="email"
                            labelClassName="text-black font-semibold"
                            className="text-black border-gray-300 focus:border-black"
                            {...register("email", {
                                required: true,
                                validate: {
                                    matchPatern: (value) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                                    "Please enter a valid email address",
                                }
                            })}
                        />
                        <Input
                            label="Password"
                            type="password"
                            placeholder="••••••••"
                            labelClassName="text-black font-semibold"
                            className="text-black border-gray-300 focus:border-black"
                            {...register("password", {
                                required: true,
                            })}
                        />
                        <Button
                            type="submit"
                            className="w-full py-3 bg-black text-white hover:bg-gray-800 transition-colors"
                        >
                            Sign In
                        </Button>
                    </div>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-500">
                        Don&apos;t have an account?&nbsp;
                        <Link
                            to="/signup"
                            className="font-bold text-black hover:underline"
                        >
                            Sign Up
                        </Link>
                    </p>
                </div>
            </div>

            {/* === BOX 2: DEMO CREDENTIALS (White Card) === */}
            <div className='mt-8 w-full max-w-sm bg-white rounded-xl p-6 shadow-lg border border-gray-100'>
                <h3 className='text-sm font-bold uppercase tracking-widest text-gray-400 mb-4 flex items-center justify-center gap-2'>
                    <span>✨</span> Demo Access <span>✨</span>
                </h3>
                
                <div className='space-y-3'>
                    <div className='flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-200'>
                        <strong className='text-xs text-gray-500 uppercase'>Email:</strong> 
                        <span className='font-mono text-xs text-black font-semibold truncate ml-2'>
                            eee@student.nitandhra.ac.in
                        </span>
                    </div>
                    
                    <div className='flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-200'>
                        <strong className='text-xs text-gray-500 uppercase'>Pass:</strong> 
                        <span className='font-mono text-xs text-black font-semibold ml-2'>
                            123456789
                        </span>
                    </div>
                </div>
            </div>

            {/* Navigation outside the white boxes needs to be white/gray */}
            <Link to="/" className="mt-8 text-sm text-gray-500 hover:text-white transition-colors">
                ← Back to Home
            </Link>
        </div>
    )
}

export default Login