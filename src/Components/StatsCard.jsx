import { Users, UserPlus, Book } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function StatsCard() {
    const navigate = useNavigate();

    // Mock data (replace with real values when API is ready)
    const mockStats = {
        totalSignups: 856,
        totalQuizzes: 325,
        dashboardUserList: 78,
        userList: 45,
    };

    const cards = [
        {
            key: 'signups',
            title: 'Total Signups',
            value: mockStats.totalSignups,
            icon: (
                <div className='rounded-xl bg-emerald-100/70 dark:bg-emerald-900/30 p-3'>
                    <UserPlus className='w-7 h-7 text-emerald-600 dark:text-emerald-400' />
                </div>
            ),
            to: '/signup',
            gradient:
                'from-emerald-50 to-emerald-100 dark:from-slate-800 dark:to-slate-800/60',
        },
        {
            key: 'quizzes',
            title: 'Total Quizzes',
            value: mockStats.totalQuizzes,
            icon: (
                <div className='rounded-xl bg-indigo-100/70 dark:bg-indigo-900/30 p-3'>
                    <Book className='w-7 h-7 text-indigo-600 dark:text-indigo-400' />
                </div>
            ),
            to: '/',
            gradient:
                'from-indigo-50 to-indigo-100 dark:from-slate-800 dark:to-slate-800/60',
        },
        {
            key: 'dashboardUsers',
            title: 'Dashboard Users',
            value: mockStats.dashboardUserList,
            icon: (
                <div className='rounded-xl bg-sky-100/70 dark:bg-sky-900/30 p-3'>
                    <Users className='w-7 h-7 text-sky-600 dark:text-sky-400' />
                </div>
            ),
            to: '/dashboarduserlist',
            gradient:
                'from-sky-50 to-sky-100 dark:from-slate-800 dark:to-slate-800/60',
        },
        {
            key: 'users',
            title: 'Users',
            value: mockStats.userList,
            icon: (
                <div className='rounded-xl bg-rose-100/70 dark:bg-rose-900/30 p-3'>
                    <Users className='w-7 h-7 text-rose-600 dark:text-rose-400' />
                </div>
            ),
            to: '/userlist',
            gradient:
                'from-rose-50 to-rose-100 dark:from-slate-800 dark:to-slate-800/60',
        },
    ];

    return (
        <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 p-4'>
            {cards.map((card) => (
                <button
                    key={card.key}
                    onClick={() => navigate(card.to)}
                    type='button'
                    className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${card.gradient} p-6 shadow-sm ring-1 ring-black/5 transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500`}
                >
                    <div
                        className='absolute inset-0 pointer-events-none opacity-60 group-hover:opacity-80 transition-opacity duration-300'
                        style={{
                            backgroundImage:
                                'radial-gradient(circle at 20% 10%, rgba(255,255,255,0.6), transparent 25%), radial-gradient(circle at 80% 0%, rgba(255,255,255,0.3), transparent 25%)',
                        }}
                    />
                    <div className='relative flex items-center justify-between'>
                        <div>
                            <p className='text-gray-600 dark:text-gray-300 text-sm font-medium tracking-wide'>
                                {card.title}
                            </p>
                            <h3 className='text-3xl font-extrabold text-gray-900 dark:text-white mt-2'>
                                {card.value.toLocaleString()}
                            </h3>
                        </div>
                        <div className='transform transition-transform duration-300 group-hover:scale-110'>
                            {card.icon}
                        </div>
                    </div>
                    <div className='mt-5 flex items-center text-blue-600 dark:text-blue-400 font-medium'>
                        <span className='mr-2'>View details</span>
                        <svg
                            className='w-4 h-4 transform transition-transform duration-300 group-hover:translate-x-1'
                            fill='currentColor'
                            viewBox='0 0 20 20'
                            aria-hidden='true'
                        >
                            <path
                                fillRule='evenodd'
                                d='M10.293 3.293a1 1 0 011.414 0l5 5a1 1 0 010 1.414l-5 5a1 1 0 11-1.414-1.414L13.586 10 10.293 6.707a1 1 0 010-1.414z'
                                clipRule='evenodd'
                            ></path>
                        </svg>
                    </div>
                </button>
            ))}
        </div>
    );
}

export default StatsCard;
