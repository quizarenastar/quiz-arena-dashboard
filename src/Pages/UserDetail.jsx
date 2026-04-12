import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    Gift,
    Wallet,
    Trophy,
    FileText,
    Users,
    Clock,
} from 'lucide-react';
import toast from 'react-hot-toast';
import UserService from '../service/UserService';

const tabs = ['Overview', 'Registered Quizzes', 'Attempts', 'Transactions'];

const UserDetail = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('Overview');
    const [data, setData] = useState(null);

    const [showBonusModal, setShowBonusModal] = useState(false);
    const [bonusAmount, setBonusAmount] = useState('');
    const [bonusReason, setBonusReason] = useState('');
    const [bonusLoading, setBonusLoading] = useState(false);

    const fetchDetail = useCallback(async () => {
        try {
            setLoading(true);
            const res = await UserService.getUserDetail(userId);
            if (res.success) {
                setData(res.data);
            } else {
                toast.error(res.message || 'Failed to fetch user detail');
            }
        } catch {
            toast.error('Failed to fetch user detail');
        } finally {
            setLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        fetchDetail();
    }, [fetchDetail]);

    const handleGiveBonus = async () => {
        const amount = parseFloat(bonusAmount);
        if (!amount || amount <= 0) {
            toast.error('Enter a valid amount');
            return;
        }
        setBonusLoading(true);
        try {
            const res = await UserService.giveBonusToUser(
                userId,
                amount,
                bonusReason,
            );
            if (res.success) {
                toast.success(res.message || 'Bonus given successfully');
                setShowBonusModal(false);
                setBonusAmount('');
                setBonusReason('');
                fetchDetail();
            } else {
                toast.error(res.message || 'Failed to give bonus');
            }
        } catch {
            toast.error('Failed to give bonus');
        } finally {
            setBonusLoading(false);
        }
    };

    if (loading) {
        return (
            <div className='min-h-screen flex items-center justify-center'>
                <div className='animate-spin rounded-full h-16 w-16 border-b-2 border-yellow-500'></div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className='min-h-screen flex items-center justify-center'>
                <p className='text-gray-500 dark:text-gray-400'>
                    User not found
                </p>
            </div>
        );
    }

    const { user, registeredQuizzes, attempts, transactions } = data;

    const getStatusColor = (status) => {
        const colors = {
            pending: 'bg-yellow-100 text-yellow-800',
            completed: 'bg-green-100 text-green-800',
            failed: 'bg-red-100 text-red-800',
            approved: 'bg-green-100 text-green-800',
            rejected: 'bg-red-100 text-red-800',
            cancelled: 'bg-gray-100 text-gray-800',
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    return (
        <div className='min-h-screen p-6'>
            <div className='max-w-7xl mx-auto'>
                {/* Header */}
                <div className='flex items-center justify-between mb-6'>
                    <div className='flex items-center gap-4'>
                        <button
                            onClick={() => navigate('/userlist')}
                            className='p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700'
                        >
                            <ArrowLeft className='w-5 h-5 text-gray-600 dark:text-gray-400' />
                        </button>
                        <div>
                            <h1 className='text-2xl font-bold text-gray-900 dark:text-white'>
                                {user.username || 'Unknown User'}
                            </h1>
                            <p className='text-sm text-gray-500 dark:text-gray-400'>
                                {user.email}
                            </p>
                        </div>
                        <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                                !user.blocked
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                            }`}
                        >
                            {!user.blocked ? 'Active' : 'Blocked'}
                        </span>
                    </div>
                    <button
                        onClick={() => setShowBonusModal(true)}
                        className='inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium rounded-lg hover:from-green-600 hover:to-emerald-700 shadow-sm'
                    >
                        <Gift className='w-4 h-4' />
                        Give Bonus
                    </button>
                </div>

                {/* Stat Cards */}
                <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-6'>
                    <div className='bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700'>
                        <div className='flex items-center gap-2 mb-1'>
                            <Wallet className='w-4 h-4 text-blue-500' />
                            <span className='text-xs text-gray-500 dark:text-gray-400'>
                                Balance
                            </span>
                        </div>
                        <p className='text-xl font-bold text-gray-900 dark:text-white'>
                            ₹{user.currentBalance}
                        </p>
                    </div>
                    <div className='bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700'>
                        <div className='flex items-center gap-2 mb-1'>
                            <Trophy className='w-4 h-4 text-green-500' />
                            <span className='text-xs text-gray-500 dark:text-gray-400'>
                                Total Earned
                            </span>
                        </div>
                        <p className='text-xl font-bold text-green-600'>
                            ₹{user.totalEarn}
                        </p>
                    </div>
                    <div className='bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700'>
                        <div className='flex items-center gap-2 mb-1'>
                            <FileText className='w-4 h-4 text-orange-500' />
                            <span className='text-xs text-gray-500 dark:text-gray-400'>
                                Total Spent
                            </span>
                        </div>
                        <p className='text-xl font-bold text-orange-600'>
                            ₹{user.totalRedeem}
                        </p>
                    </div>
                    <div className='bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700'>
                        <div className='flex items-center gap-2 mb-1'>
                            <Users className='w-4 h-4 text-purple-500' />
                            <span className='text-xs text-gray-500 dark:text-gray-400'>
                                Quizzes Attempted
                            </span>
                        </div>
                        <p className='text-xl font-bold text-gray-900 dark:text-white'>
                            {user.analytics?.quizzesAttempted || 0}
                        </p>
                    </div>
                </div>

                {/* Tabs */}
                <div className='flex gap-2 mb-6 overflow-x-auto'>
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-colors ${
                                activeTab === tab
                                    ? 'bg-yellow-600 text-white'
                                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div className='bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700'>
                    {activeTab === 'Overview' && (
                        <div className='p-6 space-y-4'>
                            <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>
                                User Information
                            </h3>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                <InfoRow
                                    label='Username'
                                    value={user.username}
                                />
                                <InfoRow label='Email' value={user.email} />
                                <InfoRow
                                    label='Phone'
                                    value={user.phone || 'Not provided'}
                                />
                                <InfoRow
                                    label='Status'
                                    value={user.blocked ? 'Blocked' : 'Active'}
                                />
                                <InfoRow
                                    label='Joined'
                                    value={new Date(
                                        user.createdAt,
                                    ).toLocaleDateString('en-IN', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    })}
                                />
                                <InfoRow
                                    label='Quizzes Created'
                                    value={user.analytics?.quizzesCreated || 0}
                                />
                                <InfoRow
                                    label='Quizzes Attempted'
                                    value={
                                        user.analytics?.quizzesAttempted || 0
                                    }
                                />
                                <InfoRow
                                    label='Average Score'
                                    value={`${user.analytics?.averageScore || 0}%`}
                                />
                            </div>
                        </div>
                    )}

                    {activeTab === 'Registered Quizzes' && (
                        <div className='p-6'>
                            {registeredQuizzes.length === 0 ? (
                                <p className='text-center text-gray-500 dark:text-gray-400 py-8'>
                                    No registered quizzes
                                </p>
                            ) : (
                                <div className='overflow-x-auto'>
                                    <table className='w-full'>
                                        <thead className='bg-gray-50 dark:bg-gray-700'>
                                            <tr>
                                                <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase'>
                                                    Title
                                                </th>
                                                <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase'>
                                                    Topic
                                                </th>
                                                <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase'>
                                                    Type
                                                </th>
                                                <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase'>
                                                    Price
                                                </th>
                                                <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase'>
                                                    Status
                                                </th>
                                                <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase'>
                                                    Start Time
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className='divide-y divide-gray-200 dark:divide-gray-700'>
                                            {registeredQuizzes.map((quiz) => (
                                                <tr
                                                    key={quiz._id}
                                                    className='hover:bg-gray-50 dark:hover:bg-gray-700'
                                                >
                                                    <td className='px-4 py-3 text-sm font-medium text-gray-900 dark:text-white'>
                                                        {quiz.title}
                                                    </td>
                                                    <td className='px-4 py-3 text-sm text-gray-600 dark:text-gray-400'>
                                                        {quiz.topic}
                                                    </td>
                                                    <td className='px-4 py-3'>
                                                        <span
                                                            className={`px-2 py-1 rounded-full text-xs font-medium ${quiz.isPaid ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}
                                                        >
                                                            {quiz.isPaid
                                                                ? 'Paid'
                                                                : 'Free'}
                                                        </span>
                                                    </td>
                                                    <td className='px-4 py-3 text-sm text-gray-600 dark:text-gray-400'>
                                                        ₹{quiz.price || 0}
                                                    </td>
                                                    <td className='px-4 py-3'>
                                                        <span
                                                            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(quiz.status)}`}
                                                        >
                                                            {quiz.status}
                                                        </span>
                                                    </td>
                                                    <td className='px-4 py-3 text-sm text-gray-600 dark:text-gray-400'>
                                                        {new Date(
                                                            quiz.startTime,
                                                        ).toLocaleString(
                                                            'en-IN',
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'Attempts' && (
                        <div className='p-6'>
                            {attempts.length === 0 ? (
                                <p className='text-center text-gray-500 dark:text-gray-400 py-8'>
                                    No quiz attempts
                                </p>
                            ) : (
                                <div className='overflow-x-auto'>
                                    <table className='w-full'>
                                        <thead className='bg-gray-50 dark:bg-gray-700'>
                                            <tr>
                                                <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase'>
                                                    Quiz
                                                </th>
                                                <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase'>
                                                    Score
                                                </th>
                                                <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase'>
                                                    Correct
                                                </th>
                                                <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase'>
                                                    Total
                                                </th>
                                                <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase'>
                                                    Status
                                                </th>
                                                <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase'>
                                                    Date
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className='divide-y divide-gray-200 dark:divide-gray-700'>
                                            {attempts.map((attempt) => (
                                                <tr
                                                    key={attempt._id}
                                                    className='hover:bg-gray-50 dark:hover:bg-gray-700'
                                                >
                                                    <td className='px-4 py-3 text-sm font-medium text-gray-900 dark:text-white'>
                                                        {attempt.quizId
                                                            ?.title ||
                                                            'Deleted Quiz'}
                                                    </td>
                                                    <td className='px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white'>
                                                        {attempt.score}
                                                    </td>
                                                    <td className='px-4 py-3 text-sm text-green-600'>
                                                        {attempt.correctAnswers}
                                                    </td>
                                                    <td className='px-4 py-3 text-sm text-gray-600 dark:text-gray-400'>
                                                        {attempt.totalQuestions}
                                                    </td>
                                                    <td className='px-4 py-3'>
                                                        <span
                                                            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(attempt.status)}`}
                                                        >
                                                            {attempt.status}
                                                        </span>
                                                    </td>
                                                    <td className='px-4 py-3 text-sm text-gray-600 dark:text-gray-400'>
                                                        {new Date(
                                                            attempt.createdAt,
                                                        ).toLocaleString(
                                                            'en-IN',
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'Transactions' && (
                        <div className='p-6'>
                            {transactions.length === 0 ? (
                                <p className='text-center text-gray-500 dark:text-gray-400 py-8'>
                                    No transactions
                                </p>
                            ) : (
                                <div className='overflow-x-auto'>
                                    <table className='w-full'>
                                        <thead className='bg-gray-50 dark:bg-gray-700'>
                                            <tr>
                                                <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase'>
                                                    Type
                                                </th>
                                                <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase'>
                                                    Amount
                                                </th>
                                                <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase'>
                                                    Before
                                                </th>
                                                <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase'>
                                                    After
                                                </th>
                                                <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase'>
                                                    Status
                                                </th>
                                                <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase'>
                                                    Description
                                                </th>
                                                <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase'>
                                                    Date
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className='divide-y divide-gray-200 dark:divide-gray-700'>
                                            {transactions.map((tx) => (
                                                <tr
                                                    key={tx._id}
                                                    className='hover:bg-gray-50 dark:hover:bg-gray-700'
                                                >
                                                    <td className='px-4 py-3'>
                                                        <span
                                                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                                tx.type ===
                                                                'bonus'
                                                                    ? 'bg-green-100 text-green-800'
                                                                    : tx.type ===
                                                                        'penalty'
                                                                      ? 'bg-red-100 text-red-800'
                                                                      : tx.type ===
                                                                          'earning'
                                                                        ? 'bg-emerald-100 text-emerald-800'
                                                                        : tx.type ===
                                                                            'payment'
                                                                          ? 'bg-blue-100 text-blue-800'
                                                                          : tx.type ===
                                                                              'withdrawal'
                                                                            ? 'bg-orange-100 text-orange-800'
                                                                            : 'bg-gray-100 text-gray-800'
                                                            }`}
                                                        >
                                                            {tx.type}
                                                        </span>
                                                    </td>
                                                    <td className='px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white'>
                                                        ₹{tx.amount}
                                                    </td>
                                                    <td className='px-4 py-3 text-sm text-gray-600 dark:text-gray-400'>
                                                        ₹{tx.balanceBefore}
                                                    </td>
                                                    <td className='px-4 py-3 text-sm text-gray-600 dark:text-gray-400'>
                                                        ₹{tx.balanceAfter}
                                                    </td>
                                                    <td className='px-4 py-3'>
                                                        <span
                                                            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(tx.status)}`}
                                                        >
                                                            {tx.status}
                                                        </span>
                                                    </td>
                                                    <td className='px-4 py-3 text-sm text-gray-600 dark:text-gray-400 max-w-xs truncate'>
                                                        {tx.description}
                                                    </td>
                                                    <td className='px-4 py-3 text-sm text-gray-600 dark:text-gray-400'>
                                                        {new Date(
                                                            tx.createdAt,
                                                        ).toLocaleString(
                                                            'en-IN',
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Bonus Modal */}
            {showBonusModal && (
                <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
                    <div className='bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md mx-4'>
                        <h3 className='text-lg font-bold text-gray-900 dark:text-white mb-4'>
                            Give Bonus to {user.username}
                        </h3>
                        <div className='space-y-4'>
                            <div>
                                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                                    Amount (₹)
                                </label>
                                <input
                                    type='number'
                                    min='1'
                                    value={bonusAmount}
                                    onChange={(e) =>
                                        setBonusAmount(e.target.value)
                                    }
                                    className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-green-500'
                                    placeholder='Enter bonus amount'
                                />
                            </div>
                            <div>
                                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                                    Reason
                                </label>
                                <textarea
                                    value={bonusReason}
                                    onChange={(e) =>
                                        setBonusReason(e.target.value)
                                    }
                                    className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-green-500'
                                    rows={3}
                                    placeholder='Reason for bonus (optional)'
                                />
                            </div>
                        </div>
                        <div className='flex justify-end gap-3 mt-6'>
                            <button
                                onClick={() => {
                                    setShowBonusModal(false);
                                    setBonusAmount('');
                                    setBonusReason('');
                                }}
                                className='px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600'
                            >
                                Cancel
                            </button>
                            <button
                                disabled={!bonusAmount || bonusLoading}
                                onClick={handleGiveBonus}
                                className='px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 disabled:opacity-50'
                            >
                                {bonusLoading ? 'Processing...' : 'Give Bonus'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const InfoRow = ({ label, value }) => (
    <div className='flex flex-col'>
        <span className='text-sm text-gray-500 dark:text-gray-400'>
            {label}
        </span>
        <span className='text-sm font-medium text-gray-900 dark:text-white'>
            {value}
        </span>
    </div>
);

export default UserDetail;
