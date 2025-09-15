import React, { useState } from 'react';

const SignUp = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle signup logic here
    };

    return (
        <div className='min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900'>
            <form
                onSubmit={handleSubmit}
                className='bg-white dark:bg-gray-800 p-8 rounded shadow-md w-full max-w-md'
            >
                <h2 className='text-2xl font-bold mb-6 text-gray-900 dark:text-white'>
                    Sign Up
                </h2>
                <div className='mb-4'>
                    <label
                        className='block text-gray-700 dark:text-gray-300 mb-2'
                        htmlFor='name'
                    >
                        Name
                    </label>
                    <input
                        id='name'
                        type='text'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className='w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500'
                    />
                </div>
                <div className='mb-4'>
                    <label
                        className='block text-gray-700 dark:text-gray-300 mb-2'
                        htmlFor='email'
                    >
                        Email
                    </label>
                    <input
                        id='email'
                        type='email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className='w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500'
                    />
                </div>
                <div className='mb-6'>
                    <label
                        className='block text-gray-700 dark:text-gray-300 mb-2'
                        htmlFor='password'
                    >
                        Password
                    </label>
                    <input
                        id='password'
                        type='password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className='w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500'
                    />
                </div>
                <button
                    type='submit'
                    className='w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition-colors'
                >
                    Sign Up
                </button>
            </form>
        </div>
    );
};

export default SignUp;
