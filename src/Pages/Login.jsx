import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User, AlertCircle } from 'lucide-react';
import AuthService from '../service/AuthService';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [focusedField, setFocusedField] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        console.log('test');

        try {
            const response = await AuthService.loginUser({ email, password });
            console.log(response);
            if (response.success) {
                // Note: In a real app, you'd use proper token storage
                console.log('Token would be stored:', response.data.token);
                localStorage.setItem('authToken', response.data.token);
                toast.success('Logged in successfully');
                navigate('/');
            } else {
                const message = response.message || 'Login failed';
                setError(message);
                toast.error(message);
            }
        } catch (err) {
            console.log(err);
            toast.error('An error occurred during login');
        } finally {
            setIsLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 p-4 sm:p-6 lg:p-8'>
            {/* Background decorative elements */}
            <div className='absolute inset-0 overflow-hidden pointer-events-none'>
                <div className='absolute top-1/4 left-1/4 w-72 h-72 bg-blue-300 dark:bg-blue-600 rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-xl opacity-20 animate-pulse'></div>
                <div className='absolute top-3/4 right-1/4 w-96 h-96 bg-purple-300 dark:bg-purple-600 rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-xl opacity-20 animate-pulse delay-1000'></div>
                <div className='absolute bottom-1/4 left-1/2 w-80 h-80 bg-indigo-300 dark:bg-indigo-600 rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-xl opacity-20 animate-pulse delay-500'></div>
            </div>

            <div className='relative w-full max-w-md mx-auto'>
                {/* Main card */}
                <div className='backdrop-blur-lg bg-white/70 dark:bg-gray-800/70 rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 overflow-hidden'>
                    {/* Header */}
                    <div className='px-8 pt-8 pb-6 text-center'>
                        <div className='w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg'>
                            <User className='w-8 h-8 text-white' />
                        </div>
                        <h1 className='text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent'>
                            Welcome Back
                        </h1>
                        <p className='text-gray-600 dark:text-gray-400 mt-2 font-medium'>
                            Sign in to your account
                        </p>
                    </div>

                    {/* Form */}
                    <div className='px-8 pb-8 space-y-6'>
                        {/* Error message */}
                        {error && (
                            <div className='flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl text-red-700 dark:text-red-300 animate-in slide-in-from-top-1 duration-300'>
                                <AlertCircle className='w-5 h-5 flex-shrink-0' />
                                <span className='text-sm font-medium'>
                                    {error}
                                </span>
                            </div>
                        )}

                        {/* Email field */}
                        <div className='space-y-2'>
                            <label
                                htmlFor='email'
                                className='block text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1'
                            >
                                Email Address
                            </label>
                            <div className='relative'>
                                <div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none'>
                                    <Mail
                                        className={`w-5 h-5 transition-colors duration-200 ${
                                            focusedField === 'email'
                                                ? 'text-blue-500'
                                                : 'text-gray-400 dark:text-gray-500'
                                        }`}
                                    />
                                </div>
                                <input
                                    id='email'
                                    type='email'
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    onFocus={() => setFocusedField('email')}
                                    onBlur={() => setFocusedField('')}
                                    required
                                    placeholder='Enter your email'
                                    className='w-full pl-12 pr-4 py-4 bg-white/50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-200 text-base backdrop-blur-sm'
                                />
                            </div>
                        </div>

                        {/* Password field */}
                        <div className='space-y-2'>
                            <label
                                htmlFor='password'
                                className='block text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1'
                            >
                                Password
                            </label>
                            <div className='relative'>
                                <div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none'>
                                    <Lock
                                        className={`w-5 h-5 transition-colors duration-200 ${
                                            focusedField === 'password'
                                                ? 'text-blue-500'
                                                : 'text-gray-400 dark:text-gray-500'
                                        }`}
                                    />
                                </div>
                                <input
                                    id='password'
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    onFocus={() => setFocusedField('password')}
                                    onBlur={() => setFocusedField('')}
                                    required
                                    placeholder='Enter your password'
                                    className='w-full pl-12 pr-12 py-4 bg-white/50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-200 text-base backdrop-blur-sm'
                                />
                                <button
                                    type='button'
                                    onClick={togglePasswordVisibility}
                                    className='absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200'
                                >
                                    {showPassword ? (
                                        <EyeOff className='w-5 h-5' />
                                    ) : (
                                        <Eye className='w-5 h-5' />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Submit button */}
                        <button
                            type='submit'
                            disabled={isLoading}
                            onClick={handleSubmit}
                            className='w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-blue-400 disabled:to-purple-400 text-white font-semibold py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:transform-none disabled:cursor-not-allowed flex items-center justify-center gap-2 text-base'
                        >
                            {isLoading ? (
                                <>
                                    <div className='w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin'></div>
                                    Signing in...
                                </>
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
