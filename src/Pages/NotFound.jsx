import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Settings } from 'lucide-react';

const NotFound = () => {
    return (
        <div className='min-h-[80vh] flex items-center justify-center px-4 py-12 bg-gray-50 dark:bg-gray-900'>
            <div className='text-center'>
                {/* 404 Number with animated gradient */}
                <div className='relative'>
                    <h1 className='text-9xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-transparent bg-clip-text animate-gradient bg-300'>
                        404
                    </h1>
                    <div className='absolute -top-4 -right-4 animate-spin-slow'>
                        <Settings className='w-12 h-12 text-gray-300 dark:text-gray-600' />
                    </div>
                </div>

                {/* Message */}
                <h2 className='mt-8 text-3xl font-semibold text-gray-800 dark:text-gray-200'>
                    Dashboard Page Not Found
                </h2>
                <p className='mt-4 text-gray-600 dark:text-gray-400 max-w-md mx-auto'>
                    The page you're looking for doesn't exist or you may not
                    have access to it.
                </p>

                {/* Action Buttons */}
                <div className='mt-8 flex flex-col sm:flex-row gap-4 justify-center'>
                    <Link
                        to='/'
                        className='inline-flex items-center px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl'
                    >
                        <Home className='w-5 h-5 mr-2' />
                        Dashboard Home
                    </Link>
                    <button
                        onClick={() => window.history.back()}
                        className='inline-flex items-center px-6 py-3 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 transition-all duration-200 shadow-md hover:shadow-lg'
                    >
                        <ArrowLeft className='w-5 h-5 mr-2' />
                        Go Back
                    </button>
                </div>

                {/* Decorative Elements */}
                <div className='mt-12'>
                    <div className='flex justify-center space-x-2'>
                        <div
                            className='w-2 h-2 rounded-full bg-blue-500 animate-bounce'
                            style={{ animationDelay: '0ms' }}
                        ></div>
                        <div
                            className='w-2 h-2 rounded-full bg-purple-500 animate-bounce'
                            style={{ animationDelay: '150ms' }}
                        ></div>
                        <div
                            className='w-2 h-2 rounded-full bg-pink-500 animate-bounce'
                            style={{ animationDelay: '300ms' }}
                        ></div>
                    </div>
                    <p className='mt-4 text-sm text-gray-500 dark:text-gray-400'>
                        Contact the administrator if you think this is a mistake
                    </p>
                </div>
            </div>

            {/* Add custom styles for animations */}
            <style jsx>{`
                @keyframes gradient {
                    0% {
                        background-position: 0% 50%;
                    }
                    50% {
                        background-position: 100% 50%;
                    }
                    100% {
                        background-position: 0% 50%;
                    }
                }
                .animate-gradient {
                    animation: gradient 3s ease infinite;
                    background-size: 300% 300%;
                }
                .animate-spin-slow {
                    animation: spin 6s linear infinite;
                }
                .bg-300 {
                    background-size: 300% 300%;
                }
            `}</style>
        </div>
    );
};

export default NotFound;
