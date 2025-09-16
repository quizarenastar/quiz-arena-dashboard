import React, { useState } from 'react';
import { Menu, X, Brain, Home, MapPin, BookOpen, Sparkles } from 'lucide-react';

// Enhanced Logo SVG component
const QuizArenaLogo = () => (
    <svg
        width='40'
        height='40'
        viewBox='0 0 48 48'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
        className='inline-block align-middle mr-3'
    >
        <circle
            cx='24'
            cy='24'
            r='22'
            fill='url(#gradient)'
            stroke='rgba(255,255,255,0.2)'
            strokeWidth='1'
        />
        <path
            d='M24 32v-2m0-2c0-3 4-3.5 4-7a4 4 0 1 0-8 0'
            stroke='#fff'
            strokeWidth='2.5'
            strokeLinecap='round'
            strokeLinejoin='round'
            fill='none'
        />
        <circle cx='24' cy='36' r='1.5' fill='#fff' />
        <defs>
            <linearGradient id='gradient' x1='0%' y1='0%' x2='100%' y2='100%'>
                <stop offset='0%' stopColor='#3b82f6' />
                <stop offset='100%' stopColor='#1d4ed8' />
            </linearGradient>
        </defs>
    </svg>
);

function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navItems = [
        { href: '/', label: 'Dashboard', icon: Home },
        { href: '/states', label: 'States', icon: MapPin },
        { href: '/quizes', label: 'Quizes', icon: BookOpen },
        { href: '/ai-quiz', label: 'AI-Quiz', icon: Brain },
    ];

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <header className='bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 backdrop-blur-lg border-b border-white/10 sticky top-0 z-50'>
            <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
                <div className='flex items-center justify-between h-16 lg:h-18'>
                    {/* Logo/Brand */}
                    <div className='flex items-center'>
                        <div className='flex items-center text-white'>
                            <QuizArenaLogo />
                            <span className='text-xl lg:text-2xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent'>
                                QuizArena
                            </span>
                        </div>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className='hidden lg:flex items-center space-x-1'>
                        {navItems.map((item) => {
                            const IconComponent = item.icon;
                            return (
                                <a
                                    key={item.href}
                                    href={item.href}
                                    className='flex items-center space-x-2 px-4 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-all duration-200 font-medium group'
                                >
                                    <IconComponent
                                        size={18}
                                        className='group-hover:scale-110 transition-transform duration-200'
                                    />
                                    <span>{item.label}</span>
                                </a>
                            );
                        })}
                    </nav>

                    {/* Desktop Auth Buttons */}
                    <div className='hidden lg:flex items-center space-x-3'>
                        <a
                            href='/login'
                            className='px-5 py-2.5 text-slate-300 hover:text-white font-medium transition-colors duration-200 hover:bg-white/5 rounded-lg'
                        >
                            Login
                        </a>
                        <a
                            href='/signup'
                            className='px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-lg transition-all duration-200 shadow-lg hover:shadow-blue-500/25 transform hover:scale-105'
                        >
                            Sign Up
                        </a>
                    </div>

                    {/* Mobile menu button */}
                    <div className='lg:hidden'>
                        <button
                            onClick={toggleMenu}
                            className='p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-all duration-200'
                            aria-expanded={isMenuOpen}
                            aria-label='Toggle navigation menu'
                        >
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation Menu */}
                {isMenuOpen && (
                    <div className='lg:hidden'>
                        <div className='px-2 pt-2 pb-6 space-y-1 border-t border-white/10 mt-4'>
                            {navItems.map((item) => {
                                const IconComponent = item.icon;
                                return (
                                    <a
                                        key={item.href}
                                        href={item.href}
                                        className='flex items-center space-x-3 px-4 py-3 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-all duration-200 font-medium'
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        <IconComponent size={20} />
                                        <span>{item.label}</span>
                                    </a>
                                );
                            })}

                            {/* Mobile Auth Buttons */}
                            <div className='pt-4 space-y-2 border-t border-white/10 mt-4'>
                                <a
                                    href='/login'
                                    className='block w-full px-4 py-3 text-center text-slate-300 hover:text-white font-medium transition-colors duration-200 hover:bg-white/5 rounded-lg'
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Login
                                </a>
                                <a
                                    href='/signup'
                                    className='block w-full px-4 py-3 text-center bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-lg transition-all duration-200 shadow-lg'
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Sign Up
                                </a>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
}

export default Header;
