import React, { useState } from 'react';
import {
    Eye,
    EyeOff,
    User,
    Mail,
    Lock,
    Shield,
    CheckCircle,
    AlertCircle,
    UserPlus,
} from 'lucide-react';

import { useNavigate } from 'react-router-dom';
import AuthService from '../service/AuthService';
import toast from 'react-hot-toast';

const SignUp = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        secretCode: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [focusedField, setFocusedField] = useState('');
    const navigate = useNavigate();

    // Password strength checker
    const checkPasswordStrength = (password) => {
        let strength = 0;
        if (password.length >= 8) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[a-z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;
        return strength;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }

        // Update password strength
        if (name === 'password') {
            setPasswordStrength(checkPasswordStrength(value));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) newErrors.name = 'Full name is required';
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.email))
            newErrors.email = 'Email is invalid';
        if (!formData.password) newErrors.password = 'Password is required';
        else if (formData.password.length < 8)
            newErrors.password = 'Password must be at least 8 characters';

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = validateForm();

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setIsSubmitting(true);
        setErrors({}); // Clear any previous errors

        try {
            const response = await AuthService.signupUser(formData);
            console.log(response);
            if (response.success) {
                // Store the token if provided
                if (response.token) {
                    console.log('Token would be stored:', response.token);
                }
                toast.success('Account created successfully');
                navigate('/login'); // Redirect to login page after successful signup
            } else {
                const message = response.message || 'Signup failed';
                setErrors({ submit: message });
                toast.error(message);
            }
        } catch (err) {
            console.log(err);
            toast.error('An error occurred during signup');
        } finally {
            setIsSubmitting(false);
        }
    };

    const getPasswordStrengthColor = () => {
        if (passwordStrength <= 2) return 'bg-red-400';
        if (passwordStrength <= 3) return 'bg-orange-400';
        return 'bg-green-400';
    };

    const getPasswordStrengthText = () => {
        if (passwordStrength <= 2) return 'Weak';
        if (passwordStrength <= 3) return 'Medium';
        return 'Strong';
    };

    return (
        <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 p-4 sm:p-6 lg:p-8'>
            {/* Background decorative elements */}
            <div className='absolute inset-0 overflow-hidden pointer-events-none'>
                <div className='absolute top-1/4 left-1/4 w-72 h-72 bg-blue-300 dark:bg-blue-600 rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-xl opacity-20 animate-pulse'></div>
                <div className='absolute top-3/4 right-1/4 w-96 h-96 bg-purple-300 dark:bg-purple-600 rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-xl opacity-20 animate-pulse delay-1000'></div>
                <div className='absolute bottom-1/4 left-1/2 w-80 h-80 bg-indigo-300 dark:bg-indigo-600 rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-xl opacity-20 animate-pulse delay-500'></div>
            </div>

            <div className='relative w-full max-w-lg mx-auto'>
                {/* Main card */}
                <div className='backdrop-blur-lg bg-white/70 dark:bg-gray-800/70 rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 overflow-hidden'>
                    {/* Header */}
                    <div className='px-8 pt-8 pb-6 text-center'>
                        <div className='w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg'>
                            <UserPlus className='w-8 h-8 text-white' />
                        </div>
                        <h1 className='text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent'>
                            Create Account
                        </h1>
                        <p className='text-gray-600 dark:text-gray-400 mt-2 font-medium'>
                            Join QuizArena and start your learning journey
                        </p>
                    </div>

                    {/* Form */}
                    <div className='px-8 pb-8 space-y-6'>
                        {/* Submit Error message */}
                        {errors.submit && (
                            <div className='flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl text-red-700 dark:text-red-300 animate-in slide-in-from-top-1 duration-300'>
                                <AlertCircle className='w-5 h-5 flex-shrink-0' />
                                <span className='text-sm font-medium'>
                                    {errors.submit}
                                </span>
                            </div>
                        )}

                        {/* Full Name field */}
                        <div className='space-y-2'>
                            <label
                                htmlFor='name'
                                className='block text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1'
                            >
                                Full Name
                            </label>
                            <div className='relative'>
                                <div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none'>
                                    <User
                                        className={`w-5 h-5 transition-colors duration-200 ${
                                            focusedField === 'name'
                                                ? 'text-blue-500'
                                                : 'text-gray-400 dark:text-gray-500'
                                        }`}
                                    />
                                </div>
                                <input
                                    id='name'
                                    type='text'
                                    name='name'
                                    value={formData.name}
                                    onChange={handleChange}
                                    onFocus={() => setFocusedField('name')}
                                    onBlur={() => setFocusedField('')}
                                    placeholder='Enter your full name'
                                    className={`w-full pl-12 pr-4 py-4 bg-white/50 dark:bg-gray-700/50 border rounded-2xl focus:outline-none focus:ring-2 focus:border-transparent dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-200 text-base backdrop-blur-sm ${
                                        errors.name
                                            ? 'border-red-300 focus:ring-red-500'
                                            : 'border-gray-200 dark:border-gray-600 focus:ring-blue-500'
                                    }`}
                                />
                            </div>
                            {errors.name && (
                                <div className='flex items-center gap-2 text-red-500 dark:text-red-400 text-sm mt-1 ml-1'>
                                    <AlertCircle className='w-4 h-4 flex-shrink-0' />
                                    <span>{errors.name}</span>
                                </div>
                            )}
                        </div>

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
                                    name='email'
                                    value={formData.email}
                                    onChange={handleChange}
                                    onFocus={() => setFocusedField('email')}
                                    onBlur={() => setFocusedField('')}
                                    placeholder='Enter your email address'
                                    className={`w-full pl-12 pr-4 py-4 bg-white/50 dark:bg-gray-700/50 border rounded-2xl focus:outline-none focus:ring-2 focus:border-transparent dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-200 text-base backdrop-blur-sm ${
                                        errors.email
                                            ? 'border-red-300 focus:ring-red-500'
                                            : 'border-gray-200 dark:border-gray-600 focus:ring-blue-500'
                                    }`}
                                />
                            </div>
                            {errors.email && (
                                <div className='flex items-center gap-2 text-red-500 dark:text-red-400 text-sm mt-1 ml-1'>
                                    <AlertCircle className='w-4 h-4 flex-shrink-0' />
                                    <span>{errors.email}</span>
                                </div>
                            )}
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
                                    name='password'
                                    value={formData.password}
                                    onChange={handleChange}
                                    onFocus={() => setFocusedField('password')}
                                    onBlur={() => setFocusedField('')}
                                    placeholder='Create a strong password'
                                    className={`w-full pl-12 pr-12 py-4 bg-white/50 dark:bg-gray-700/50 border rounded-2xl focus:outline-none focus:ring-2 focus:border-transparent dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-200 text-base backdrop-blur-sm ${
                                        errors.password
                                            ? 'border-red-300 focus:ring-red-500'
                                            : 'border-gray-200 dark:border-gray-600 focus:ring-blue-500'
                                    }`}
                                />
                                <button
                                    type='button'
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    className='absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200'
                                >
                                    {showPassword ? (
                                        <EyeOff className='w-5 h-5' />
                                    ) : (
                                        <Eye className='w-5 h-5' />
                                    )}
                                </button>
                            </div>

                            {/* Password Strength Indicator */}
                            {formData.password && (
                                <div className='mt-3 px-1'>
                                    <div className='flex items-center gap-3'>
                                        <div className='flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden'>
                                            <div
                                                className={`h-full ${getPasswordStrengthColor()} transition-all duration-500`}
                                                style={{
                                                    width: `${
                                                        (passwordStrength / 5) *
                                                        100
                                                    }%`,
                                                }}
                                            ></div>
                                        </div>
                                        <span
                                            className={`text-sm font-medium ${
                                                passwordStrength <= 2
                                                    ? 'text-red-500'
                                                    : passwordStrength <= 3
                                                    ? 'text-orange-500'
                                                    : 'text-green-500'
                                            }`}
                                        >
                                            {getPasswordStrengthText()}
                                        </span>
                                    </div>
                                </div>
                            )}

                            {errors.password && (
                                <div className='flex items-center gap-2 text-red-500 dark:text-red-400 text-sm mt-1 ml-1'>
                                    <AlertCircle className='w-4 h-4 flex-shrink-0' />
                                    <span>{errors.password}</span>
                                </div>
                            )}
                        </div>

                        {/* Secret Code field */}
                        <div className='space-y-2'>
                            <label
                                htmlFor='secretCode'
                                className='block text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1'
                            >
                                <div className='flex items-center gap-2'>
                                    Admin/Moderator Code
                                    <span className='text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-1 rounded-full'>
                                        Optional
                                    </span>
                                </div>
                            </label>
                            <div className='relative'>
                                <div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none'>
                                    <Shield
                                        className={`w-5 h-5 transition-colors duration-200 ${
                                            focusedField === 'secretCode'
                                                ? 'text-blue-500'
                                                : 'text-gray-400 dark:text-gray-500'
                                        }`}
                                    />
                                </div>
                                <input
                                    id='secretCode'
                                    type='text'
                                    name='secretCode'
                                    value={formData.secretCode}
                                    onChange={handleChange}
                                    onFocus={() =>
                                        setFocusedField('secretCode')
                                    }
                                    onBlur={() => setFocusedField('')}
                                    placeholder='Enter admin/moderator code (if applicable)'
                                    className='w-full pl-12 pr-4 py-4 bg-white/50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-200 text-base backdrop-blur-sm'
                                />
                            </div>
                            <p className='text-xs text-gray-500 dark:text-gray-400 mt-2 ml-1'>
                                Only enter a code if you've been provided one
                                for admin or moderator access
                            </p>
                        </div>

                        {/* Submit button */}
                        <button
                            type='submit'
                            disabled={isSubmitting}
                            onClick={handleSubmit}
                            className='w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-blue-400 disabled:to-purple-400 text-white font-semibold py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:transform-none disabled:cursor-not-allowed flex items-center justify-center gap-2 text-base'
                        >
                            {isSubmitting ? (
                                <>
                                    <div className='w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin'></div>
                                    Creating Your Account...
                                </>
                            ) : (
                                <>
                                    <CheckCircle className='w-5 h-5' />
                                    Create My Account
                                </>
                            )}
                        </button>

                        {/* Login link */}
                        <div className='text-center pt-4 text-sm'>
                            <div className='text-gray-600 dark:text-gray-400'>
                                Already have an account?{' '}
                                <a
                                    href='/login'
                                    className='text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors duration-200 hover:underline'
                                >
                                    Sign In
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
            </div>
        </div>
    );
};

export default SignUp;
