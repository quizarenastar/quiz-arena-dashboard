import { useState, useEffect } from 'react';
import {
    Home,
    User,
    LogOut,
    Shield,
    Wallet,
    ChevronLeft,
    ChevronRight,
    Users,
    MessageSquare,
    X,
    BarChart3,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { hasAuthToken, clearAuthToken } from '../utils/authToken';
import QuizArenaLogo from '../assets/namelogo.png';
import QuizArenaShortLogo from '../assets/quizarenashortlogo.jpg';

function Sidebar({
    isCollapsed,
    setIsCollapsed,
    isMobileOpen,
    setIsMobileOpen,
}) {
    const [isLoggedIn, setIsLoggedIn] = useState(hasAuthToken());

    // Check auth status on component mount and when location changes
    useEffect(() => {
        const checkAuth = () => {
            setIsLoggedIn(hasAuthToken());
        };

        // Check immediately
        checkAuth();

        // Listen for storage changes (when token is set/removed)
        window.addEventListener('storage', checkAuth);

        // Custom event for same-tab auth changes
        window.addEventListener('authChange', checkAuth);

        return () => {
            window.removeEventListener('storage', checkAuth);
            window.removeEventListener('authChange', checkAuth);
        };
    }, []);

    const navItems = [
        { href: '/', label: 'Dashboard', icon: Home },
        { href: '/quiz-management', label: 'Quiz Management', icon: Shield },
        { href: '/quiz-analytics', label: 'Quiz Analytics', icon: BarChart3 },
        { href: '/wallet-management', label: 'Wallet', icon: Wallet },
        { href: '/userlist', label: 'Users', icon: User },
        { href: '/dashboarduserlist', label: 'Admins', icon: Users },
        { href: '/contacts', label: 'Contact Support', icon: MessageSquare },
    ];

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };

    const handleLogout = () => {
        try {
            clearAuthToken();

            // Dispatch custom event to notify components of auth change
            window.dispatchEvent(new Event('authChange'));

            toast.success('Logged out');
            window.location.href = '/login';
        } catch (err) {
            console.log(err);
            toast.error('Failed to logout');
        }
    };

    if (!isLoggedIn) {
        return null; // Don't show sidebar on login/signup pages
    }

    return (
        <>
            {/* Overlay for mobile */}
            {isMobileOpen && (
                <div
                    className='fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden'
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed left-0 top-0 h-screen bg-white dark:bg-gray-800 shadow-lg transition-all duration-300 z-50 
                    ${isCollapsed ? 'w-20' : 'w-64'}
                    ${
                        isMobileOpen
                            ? 'translate-x-0'
                            : '-translate-x-full lg:translate-x-0'
                    }
                `}
            >
                <div className='flex flex-col h-full'>
                    {/* Logo Section */}
                    <div className='flex items-center justify-center p-4 border-b border-gray-200 dark:border-gray-700'>
                        {isCollapsed ? (
                            <img
                                src={QuizArenaShortLogo}
                                alt='QA'
                                className='h-10 w-10 rounded-lg object-cover'
                            />
                        ) : (
                            <img
                                src={QuizArenaLogo}
                                alt='Quiz Arena'
                                className='h-8'
                            />
                        )}
                    </div>

                    {/* Toggle Button - Hidden on mobile */}
                    <button
                        onClick={toggleSidebar}
                        className='absolute -right-3 top-5 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-1 shadow-lg transition-all duration-200 hidden lg:block'
                        aria-label={
                            isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'
                        }
                    >
                        {isCollapsed ? (
                            <ChevronRight size={20} />
                        ) : (
                            <ChevronLeft size={20} />
                        )}
                    </button>

                    {/* Navigation Links */}
                    <nav className='flex-1 overflow-y-auto py-4'>
                        <ul className='space-y-1 px-3'>
                            {navItems.map((item) => {
                                const IconComponent = item.icon;
                                const isActive =
                                    window.location.pathname === item.href;

                                return (
                                    <li key={item.href}>
                                        <a
                                            href={item.href}
                                            onClick={() =>
                                                setIsMobileOpen(false)
                                            }
                                            className={`flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-200 group ${
                                                isActive
                                                    ? 'bg-blue-600 text-white'
                                                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                            }`}
                                            title={
                                                isCollapsed ? item.label : ''
                                            }
                                        >
                                            <IconComponent
                                                size={20}
                                                className='flex-shrink-0'
                                            />
                                            {!isCollapsed && (
                                                <span className='font-medium'>
                                                    {item.label}
                                                </span>
                                            )}
                                        </a>
                                    </li>
                                );
                            })}
                        </ul>
                    </nav>

                    {/* User Section */}
                    <div className='border-t border-gray-200 dark:border-gray-700 p-3'>
                        <a
                            href='/profile'
                            onClick={() => setIsMobileOpen(false)}
                            className='flex items-center space-x-3 px-3 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 mb-2'
                            title={isCollapsed ? 'Profile' : ''}
                        >
                            <User size={20} className='flex-shrink-0' />
                            {!isCollapsed && (
                                <span className='font-medium'>Profile</span>
                            )}
                        </a>
                        <button
                            onClick={handleLogout}
                            className='w-full flex items-center space-x-3 px-3 py-3 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-all duration-200'
                            title={isCollapsed ? 'Logout' : ''}
                        >
                            <LogOut size={20} className='flex-shrink-0' />
                            {!isCollapsed && (
                                <span className='font-medium'>Logout</span>
                            )}
                        </button>
                    </div>

                    {/* Close button for mobile */}
                    <button
                        onClick={() => setIsMobileOpen(false)}
                        className='absolute top-4 right-4 lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700'
                        aria-label='Close menu'
                    >
                        <X size={20} />
                    </button>
                </div>
            </aside>
        </>
    );
}

export default Sidebar;
