import React, {useState} from 'react'
import authService from '../appwrite/auth'
import {Link ,useNavigate} from 'react-router-dom'
import {login} from '../store/authSlice'
import {Button, Input, Logo} from './index.js'
import {useDispatch} from 'react-redux'
import {useForm} from 'react-hook-form'

function Signup() {
    const navigate = useNavigate()
    const [error, setError] = useState("")
    const dispatch = useDispatch()
    const {register, handleSubmit} = useForm()

    const create = async(data) => {
        setError("")
        try {
            const userData = await authService.createAccount(data)
            if (userData) {
                const userData = await authService.getCurrentUser()
                if(userData) dispatch(login(userData));
                navigate("/")
            }
        } catch (error) {
            setError(error.message)
        }
    }

  return (
    /* Main Container: Pure Black Background */
    <div className="flex flex-col items-center justify-center w-full min-h-screen py-12 bg-black">
            
            {/* === SIGNUP FORM CARD (White) === */}
            <div className={`mx-auto w-full max-w-lg bg-white rounded-2xl p-10 shadow-[0_0_20px_rgba(255,255,255,0.1)]`}>
                <div className="mb-4 flex justify-center">
                    <span className="inline-block w-full max-w-[100px]">
                        <Logo width="100%" />
                    </span>
                </div>
                
                <h2 className="text-center text-3xl font-bold text-black tracking-tight">Create Account</h2>
                <p className="mt-2 text-center text-base text-gray-600">
                    Already have an account?&nbsp;
                    <Link
                        to="/login"
                        className="font-bold text-black hover:underline underline-offset-4"
                    >
                        Sign In
                    </Link>
                </p>

                {error && <p className="text-red-600 mt-6 text-center text-sm font-medium">{error}</p>}

                <form onSubmit={handleSubmit(create)} className='mt-8'>
                    <div className='space-y-5'>
                        <Input
                            label="Full Name"
                            placeholder="Enter your full name"
                            className="text-black border-gray-300 focus:border-black"
                            {...register("name", {
                                required: true,
                            })}
                        />
                        <Input
                            label="Email"
                            placeholder="Enter your email"
                            type="email"
                            className="text-black border-gray-300 focus:border-black"
                            {...register("email", {
                                required: true,
                                validate: {
                                    matchPatern: (value) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                                    "Email address must be a valid address",
                                }
                            })}
                        />
                        <Input
                            label="Password"
                            type="password"
                            placeholder="Create a password"
                            className="text-black border-gray-300 focus:border-black"
                            {...register("password", {
                                required: true,
                            })}
                        />
                        <Button 
                            type="submit" 
                            className="w-full py-3 bg-black text-white hover:bg-gray-800 transition-colors"
                        >
                            Create Account
                        </Button>
                    </div>
                </form>
            </div>

            {/* Back to Home Link */}
            <Link to="/" className="mt-8 text-sm text-gray-500 hover:text-white transition-colors">
                ← Back to Home
            </Link>
    </div>
  )
}

export default Signup