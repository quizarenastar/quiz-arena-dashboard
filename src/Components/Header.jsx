import React from 'react';

// Logo SVG as a component
const QuizArenaLogo = () => (
    <svg
        width='36'
        height='36'
        viewBox='0 0 48 48'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
        className='inline-block align-middle mr-2'
    >
        <circle
            cx='24'
            cy='24'
            r='22'
            fill='#2563eb'
            stroke='#fff'
            strokeWidth='2'
        />
        <path
            d='M24 32v-2m0-2c0-3 4-3.5 4-7a4 4 0 1 0-8 0'
            stroke='#fff'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
            fill='none'
        />
        <circle cx='24' cy='36' r='1.5' fill='#fff' />
    </svg>
);

function Header() {
    return (
        <header className='bg-blue-700 text-white shadow-md'>
            <div className='container mx-auto flex items-center justify-between py-4 px-6'>
                {/* Left Side: Logo/Brand */}
                <div className='flex items-center text-2xl font-bold tracking-wide'>
                    <QuizArenaLogo />
                    QuizArena
                </div>
                {/* Right Side: Navigation */}
                <nav>
                    <ul className='flex items-center space-x-6'>
                        <li>
                            <a
                                href='/'
                                className='hover:text-blue-200 transition'
                            >
                                Dashboard
                            </a>
                        </li>
                        <li>
                            <a
                                href='/states'
                                className='hover:text-blue-200 transition'
                            >
                                States
                            </a>
                        </li>
                        <li>
                            <a
                                href='/quizes'
                                className='hover:text-blue-200 transition'
                            >
                                Quizes
                            </a>
                        </li>
                        <li>
                            <a
                                href='/ ai-quiz'
                                className='hover:text-blue-200 transition'
                            >
                                AI-Quiz
                            </a>
                        </li>
                        <li>
                            <a
                                href='/login'
                                className='bg-white text-blue-700 px-4 py-2 rounded hover:bg-blue-100 transition font-semibold'
                            >
                                Login
                            </a>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    );
}

export default Header;
