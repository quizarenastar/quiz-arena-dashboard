import React from 'react';
import StatsCard from '../Components/StatsCard';

const Home = () => {
    return (
        <div className='container mx-auto bg-blue-50 dark:bg-gray-900 min-h-screen transition-colors duration-200'>
            <h1 className='text-3xl text-center font-bold text-gray-900 dark:text-white mb-6'>
                Welcome to the Admin Dashboard
            </h1>
            <StatsCard />
        </div>
    );
};

export default Home;
