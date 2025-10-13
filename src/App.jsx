import { BrowserRouter as Router } from 'react-router-dom';
import { useState } from 'react';
import { Menu } from 'lucide-react';
import RoutesComponent from './RoutesComponent';
import Sidebar from './Components/Sidebar';
import Footer from './Components/Footer';
import { Toaster } from 'react-hot-toast';
import { hasAuthToken } from './utils/authToken';

const App = () => {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <Router basename='/'>
            <div className='flex min-h-screen bg-blue-50 dark:bg-gray-900'>
                <Sidebar
                    isCollapsed={isSidebarCollapsed}
                    setIsCollapsed={setIsSidebarCollapsed}
                    isMobileOpen={isMobileMenuOpen}
                    setIsMobileOpen={setIsMobileMenuOpen}
                />
                <div
                    className={`flex flex-col flex-1 transition-all duration-300 
                        ${isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'}
                    `}
                >
                    {/* Mobile Header with Menu Button */}
                    {hasAuthToken() && (
                        <div className='lg:hidden sticky top-0 z-30 bg-white dark:bg-gray-800 shadow-md p-4 flex items-center'>
                            <button
                                onClick={() => setIsMobileMenuOpen(true)}
                                className='p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700'
                                aria-label='Open menu'
                            >
                                <Menu size={24} />
                            </button>
                            <span className='ml-3 text-lg font-semibold text-gray-800 dark:text-gray-200'>
                                Quiz Arena
                            </span>
                        </div>
                    )}

                    <main className='flex-1 p-6'>
                        <RoutesComponent />
                    </main>
                    {/* <Footer /> */}
                </div>
            </div>
            <Toaster position='top-right' />
        </Router>
    );
};

export default App;
