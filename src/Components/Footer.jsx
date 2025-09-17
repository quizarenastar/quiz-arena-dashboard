import React from 'react';

const Footer = () => {
    return (
        <footer className='bg-blue-100 dark:bg-gray-900 text-gray-900 dark:text-black shadow-md transition-colors duration-200'>
            <div className='container mx-auto flex flex-col md:flex-row items-center justify-between px-4'>
                {/* Left Side (now empty) */}
                <div className='mb-4 md:mb-0 text-left w-full md:w-1/3'></div>
                {/* Middle (empty) */}
                <div className='mb-4 md:mb-0 w-full md:w-1/3 flex flex-col items-center'></div>
                {/* Right Side (empty) */}
                <div className='w-full md:w-1/3 flex justify-end gap-4'></div>
            </div>
            <div className='container mx-auto text-center text-xs mt-4 opacity-80 h-10'>
                &copy; {new Date().getFullYear()} QuizArena. All rights
                reserved.
            </div>
        </footer>
    );
};

export default Footer;
