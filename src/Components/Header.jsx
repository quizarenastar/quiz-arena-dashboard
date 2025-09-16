import React, { useState } from 'react';
import { Menu, X, Brain, Home, BookOpen, Trophy } from 'lucide-react';
import QuizArenaLogo from '../assets/namelogo.png';

function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navItems = [
        { href: '/', label: 'Dashboard', icon: Home },
        { href: '/stats', label: 'Stats', icon: Trophy },
        { href: '/quizzes', label: 'Quizzes', icon: BookOpen },
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
                    <div className='flex items-center h-8 w-20'>
                        <img src={QuizArenaLogo} alt='Quiz Arena' />
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
