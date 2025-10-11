import React, { useState, useEffect } from 'react';
import {
    CheckCircle,
    XCircle,
    Eye,
    Clock,
    Users,
    DollarSign,
    AlertTriangle,
    Search,
} from 'lucide-react';
import toast from 'react-hot-toast';
import AdminService from '../service/AdminService';

const QuizManagement = () => {
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('pending');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedQuiz, setSelectedQuiz] = useState(null);
    const [showQuizModal, setShowQuizModal] = useState(false);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        fetchQuizzes();
    }, [filter]);

    const fetchQuizzes = async () => {
        try {
            setLoading(true);
            const response =
                filter === 'pending'
                    ? await AdminService.getPendingQuizzes()
                    : await AdminService.getAllQuizzes({ status: filter });
            setQuizzes(response.data.quizzes || []);
        } catch (error) {
            toast.error(error.message || 'Failed to fetch quizzes');
            console.error('Fetch Quizzes Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleApproveQuiz = async (quizId, feedback = '') => {
        setActionLoading(true);
        try {
            await AdminService.approveQuiz(quizId, feedback);
            toast.success('Quiz approved successfully!');
            fetchQuizzes();
            setShowQuizModal(false);
        } catch (error) {
            toast.error(error.message || 'Failed to approve quiz');
            console.error('Approve Quiz Error:', error);
        } finally {
            setActionLoading(false);
        }
    };

    const handleRejectQuiz = async (quizId, reason) => {
        if (!reason.trim()) {
            toast.error('Please provide a reason for rejection');
            return;
        }

        setActionLoading(true);
        try {
            await AdminService.rejectQuiz(quizId, reason);
            toast.success('Quiz rejected successfully!');
            fetchQuizzes();
            setShowQuizModal(false);
        } catch (error) {
            toast.error(error.message || 'Failed to reject quiz');
            console.error('Reject Quiz Error:', error);
        } finally {
            setActionLoading(false);
        }
    };

    const openQuizModal = async (quiz) => {
        try {
            const response = await AdminService.getQuizDetails(quiz._id);
            setSelectedQuiz(response.data.quiz);
            setShowQuizModal(true);
        } catch (error) {
            toast.error('Failed to fetch quiz details');
            console.error('Quiz Details Error:', error);
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            pending: 'bg-yellow-100 text-yellow-800',
            approved: 'bg-green-100 text-green-800',
            rejected: 'bg-red-100 text-red-800',
            draft: 'bg-gray-100 text-gray-800',
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const filteredQuizzes = quizzes.filter((quiz) => {
        const titleMatch = quiz.title
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase());
        const creatorNameMatch = quiz.creator?.name
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase());
        const categoryMatch = quiz.category
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase());

        return titleMatch || creatorNameMatch || categoryMatch;
    });

    if (loading) {
        return (
            <div className='min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center'>
                <div className='text-center'>
                    <div className='animate-spin rounded-full h-32 w-32 border-b-2 border-yellow-500 mx-auto'></div>
                    <p className='mt-4 text-gray-600 dark:text-gray-400'>
                        Loading quiz management...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className='min-h-screen bg-gray-50 dark:bg-gray-900 p-6'>
            <div className='max-w-7xl mx-auto'>
                {/* Header */}
                <div className='mb-6'>
                    <h1 className='text-3xl font-bold text-gray-900 dark:text-white mb-2'>
                        Quiz Management
                    </h1>
                    <p className='text-gray-600 dark:text-gray-400'>
                        Review and manage quiz submissions
                    </p>
                </div>

                {/* Filters and Search */}
                <div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6'>
                    <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
                        {/* Status Filter */}
                        <div className='flex space-x-2'>
                            {['pending', 'approved', 'rejected', 'all'].map(
                                (status) => (
                                    <button
                                        key={status}
                                        onClick={() => setFilter(status)}
                                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                            filter === status
                                                ? 'bg-yellow-600 text-white'
                                                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                        }`}
                                    >
                                        {status.charAt(0).toUpperCase() +
                                            status.slice(1)}
                                    </button>
                                )
                            )}
                        </div>

                        {/* Search */}
                        <div className='relative'>
                            <Search
                                className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400'
                                size={20}
                            />
                            <input
                                type='text'
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder='Search quizzes...'
                                className='pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:bg-gray-700 dark:text-white'
                            />
                        </div>
                    </div>
                </div>

                {/* Quiz List */}
                <div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden'>
                    {filteredQuizzes.length === 0 ? (
                        <div className='p-8 text-center'>
                            <p className='text-gray-500 dark:text-gray-400'>
                                No quizzes found for the selected filter.
                            </p>
                        </div>
                    ) : (
                        <div className='overflow-x-auto'>
                            <table className='w-full'>
                                <thead className='bg-gray-50 dark:bg-gray-700'>
                                    <tr>
                                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                                            Quiz Details
                                        </th>
                                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                                            Creator
                                        </th>
                                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                                            Stats
                                        </th>
                                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                                            Status
                                        </th>
                                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className='divide-y divide-gray-200 dark:divide-gray-700'>
                                    {filteredQuizzes.map((quiz) => (
                                        <tr
                                            key={quiz._id}
                                            className='hover:bg-gray-50 dark:hover:bg-gray-700'
                                        >
                                            <td className='px-6 py-4'>
                                                <div>
                                                    <h3 className='text-sm font-medium text-gray-900 dark:text-white'>
                                                        {quiz.title}
                                                    </h3>
                                                    <p className='text-sm text-gray-500 dark:text-gray-400 line-clamp-2'>
                                                        {quiz.description}
                                                    </p>
                                                    <div className='mt-2 flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400'>
                                                        <span className='px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full'>
                                                            {quiz.category}
                                                        </span>
                                                        <span
                                                            className={`px-2 py-1 rounded-full ${
                                                                quiz.difficulty ===
                                                                'beginner'
                                                                    ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                                                                    : quiz.difficulty ===
                                                                      'intermediate'
                                                                    ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
                                                                    : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                                                            }`}
                                                        >
                                                            {quiz.difficulty}
                                                        </span>
                                                        {quiz.isPaid && (
                                                            <span className='flex items-center text-green-600'>
                                                                <DollarSign
                                                                    size={12}
                                                                />
                                                                ₹{quiz.price}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className='px-6 py-4'>
                                                <div>
                                                    <p className='text-sm font-medium text-gray-900 dark:text-white'>
                                                        {quiz.creator?.name ||
                                                            'no name'}
                                                    </p>
                                                    <p className='text-sm text-gray-500 dark:text-gray-400'>
                                                        {quiz.creator?.email ||
                                                            'no email'}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className='px-6 py-4'>
                                                <div className='flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400'>
                                                    <div className='flex items-center'>
                                                        <Users
                                                            size={14}
                                                            className='mr-1'
                                                        />
                                                        {quiz.questions
                                                            ?.length || 0}{' '}
                                                        questions
                                                    </div>
                                                    <div className='flex items-center'>
                                                        <Clock
                                                            size={14}
                                                            className='mr-1'
                                                        />
                                                        {quiz.timeLimit}m
                                                    </div>
                                                    <div className='flex items-center'>
                                                        <Eye
                                                            size={14}
                                                            className='mr-1'
                                                        />
                                                        {quiz.attemptCount || 0}{' '}
                                                        attempts
                                                    </div>
                                                </div>
                                            </td>
                                            <td className='px-6 py-4'>
                                                <span
                                                    className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                                                        quiz.status
                                                    )}`}
                                                >
                                                    {quiz.status
                                                        .charAt(0)
                                                        .toUpperCase() +
                                                        quiz.status.slice(1)}
                                                </span>
                                                {quiz.status === 'pending' && (
                                                    <div className='mt-1 text-xs text-gray-500 dark:text-gray-400'>
                                                        Submitted{' '}
                                                        {AdminService.formatDate(
                                                            quiz.createdAt
                                                        )}
                                                    </div>
                                                )}
                                            </td>
                                            <td className='px-6 py-4'>
                                                <div className='flex space-x-2'>
                                                    <button
                                                        onClick={() =>
                                                            openQuizModal(quiz)
                                                        }
                                                        className='px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-md'
                                                    >
                                                        <Eye
                                                            size={12}
                                                            className='mr-1 inline'
                                                        />
                                                        Review
                                                    </button>

                                                    {quiz.status ===
                                                        'pending' && (
                                                        <>
                                                            <button
                                                                onClick={() =>
                                                                    handleApproveQuiz(
                                                                        quiz._id
                                                                    )
                                                                }
                                                                disabled={
                                                                    actionLoading
                                                                }
                                                                className='px-3 py-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white text-xs font-medium rounded-md'
                                                            >
                                                                <CheckCircle
                                                                    size={12}
                                                                    className='mr-1 inline'
                                                                />
                                                                Approve
                                                            </button>

                                                            <button
                                                                onClick={() =>
                                                                    openQuizModal(
                                                                        quiz
                                                                    )
                                                                }
                                                                className='px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs font-medium rounded-md'
                                                            >
                                                                <XCircle
                                                                    size={12}
                                                                    className='mr-1 inline'
                                                                />
                                                                Reject
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Quiz Details Modal */}
                {showQuizModal && selectedQuiz && (
                    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
                        <div className='bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto'>
                            <div className='p-6'>
                                <div className='flex justify-between items-start mb-6'>
                                    <div>
                                        <h2 className='text-2xl font-bold text-gray-900 dark:text-white'>
                                            {selectedQuiz.title}
                                        </h2>
                                        <p className='text-gray-600 dark:text-gray-400 mt-1'>
                                            by {selectedQuiz.creator.name}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setShowQuizModal(false)}
                                        className='text-gray-400 hover:text-gray-600'
                                    >
                                        <XCircle size={24} />
                                    </button>
                                </div>

                                {/* Quiz Information */}
                                <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
                                    <div>
                                        <h3 className='font-semibold text-gray-900 dark:text-white mb-2'>
                                            Quiz Details
                                        </h3>
                                        <div className='space-y-2 text-sm'>
                                            <p>
                                                <span className='font-medium'>
                                                    Category:
                                                </span>{' '}
                                                {selectedQuiz.category}
                                            </p>
                                            <p>
                                                <span className='font-medium'>
                                                    Difficulty:
                                                </span>{' '}
                                                {selectedQuiz.difficulty}
                                            </p>
                                            <p>
                                                <span className='font-medium'>
                                                    Time Limit:
                                                </span>{' '}
                                                {selectedQuiz.timeLimit} minutes
                                            </p>
                                            <p>
                                                <span className='font-medium'>
                                                    Questions:
                                                </span>{' '}
                                                {selectedQuiz.questions
                                                    ?.length || 0}
                                            </p>
                                            <p>
                                                <span className='font-medium'>
                                                    Price:
                                                </span>{' '}
                                                {selectedQuiz.isPaid
                                                    ? `₹${selectedQuiz.price}`
                                                    : 'Free'}
                                            </p>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className='font-semibold text-gray-900 dark:text-white mb-2'>
                                            Anti-cheat Settings
                                        </h3>
                                        <div className='space-y-2 text-sm'>
                                            <div className='flex items-center'>
                                                {selectedQuiz.settings
                                                    ?.antiCheat
                                                    ?.detectTabSwitch ? (
                                                    <CheckCircle
                                                        size={16}
                                                        className='text-green-500 mr-2'
                                                    />
                                                ) : (
                                                    <XCircle
                                                        size={16}
                                                        className='text-red-500 mr-2'
                                                    />
                                                )}
                                                Tab Switch Detection
                                            </div>
                                            <div className='flex items-center'>
                                                {selectedQuiz.settings
                                                    ?.antiCheat
                                                    ?.detectCopyPaste ? (
                                                    <CheckCircle
                                                        size={16}
                                                        className='text-green-500 mr-2'
                                                    />
                                                ) : (
                                                    <XCircle
                                                        size={16}
                                                        className='text-red-500 mr-2'
                                                    />
                                                )}
                                                Copy/Paste Detection
                                            </div>
                                            <div className='flex items-center'>
                                                {selectedQuiz.settings
                                                    ?.antiCheat
                                                    ?.forceFullscreen ? (
                                                    <CheckCircle
                                                        size={16}
                                                        className='text-green-500 mr-2'
                                                    />
                                                ) : (
                                                    <XCircle
                                                        size={16}
                                                        className='text-red-500 mr-2'
                                                    />
                                                )}
                                                Force Fullscreen
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Description */}
                                <div className='mb-6'>
                                    <h3 className='font-semibold text-gray-900 dark:text-white mb-2'>
                                        Description
                                    </h3>
                                    <p className='text-gray-600 dark:text-gray-400'>
                                        {selectedQuiz.description ||
                                            'No description provided'}
                                    </p>
                                </div>

                                {/* Questions Preview */}
                                <div className='mb-6'>
                                    <h3 className='font-semibold text-gray-900 dark:text-white mb-2'>
                                        Questions Preview
                                    </h3>
                                    <div className='space-y-4 max-h-64 overflow-y-auto'>
                                        {selectedQuiz.questions
                                            ?.slice(0, 3)
                                            .map((question, index) => (
                                                <div
                                                    key={index}
                                                    className='border border-gray-200 dark:border-gray-600 rounded-lg p-4'
                                                >
                                                    <p className='font-medium text-gray-900 dark:text-white mb-2'>
                                                        {index + 1}.{' '}
                                                        {question.text}
                                                    </p>
                                                    <div className='grid grid-cols-2 gap-2 text-sm'>
                                                        {question.options.map(
                                                            (
                                                                option,
                                                                optIndex
                                                            ) => (
                                                                <div
                                                                    key={
                                                                        optIndex
                                                                    }
                                                                    className={`p-2 rounded ${
                                                                        optIndex ===
                                                                        question.correctAnswer
                                                                            ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                                                                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                                                                    }`}
                                                                >
                                                                    {option}
                                                                </div>
                                                            )
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        {selectedQuiz.questions?.length > 3 && (
                                            <p className='text-sm text-gray-500 dark:text-gray-400 text-center'>
                                                ... and{' '}
                                                {selectedQuiz.questions.length -
                                                    3}{' '}
                                                more questions
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                {selectedQuiz.status === 'pending' && (
                                    <div className='flex space-x-4'>
                                        <button
                                            onClick={() =>
                                                handleApproveQuiz(
                                                    selectedQuiz._id
                                                )
                                            }
                                            disabled={actionLoading}
                                            className='flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg font-medium'
                                        >
                                            {actionLoading
                                                ? 'Processing...'
                                                : 'Approve Quiz'}
                                        </button>

                                        <button
                                            onClick={() => {
                                                setShowRejectModal(true);
                                            }}
                                            disabled={actionLoading}
                                            className='flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white rounded-lg font-medium'
                                        >
                                            Reject Quiz
                                        </button>
                                    </div>
                                )}

                                {selectedQuiz.status === 'rejected' &&
                                    selectedQuiz.rejectionReason && (
                                        <div className='p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg'>
                                            <div className='flex items-start'>
                                                <AlertTriangle
                                                    className='text-red-500 mr-2 mt-1'
                                                    size={16}
                                                />
                                                <div>
                                                    <p className='font-medium text-red-800 dark:text-red-200'>
                                                        Rejection Reason:
                                                    </p>
                                                    <p className='text-red-700 dark:text-red-300 mt-1'>
                                                        {
                                                            selectedQuiz.rejectionReason
                                                        }
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Rejection Modal */}
                {showRejectModal && selectedQuiz && (
                    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
                        <div className='bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6'>
                            <div className='flex items-center justify-between mb-4'>
                                <h3 className='text-xl font-bold text-gray-900 dark:text-white flex items-center'>
                                    <AlertTriangle
                                        className='text-red-500 mr-2'
                                        size={24}
                                    />
                                    Reject Quiz
                                </h3>
                                <button
                                    onClick={() => {
                                        setShowRejectModal(false);
                                        setRejectionReason('');
                                    }}
                                    className='text-gray-400 hover:text-gray-600'
                                >
                                    <XCircle size={20} />
                                </button>
                            </div>

                            <p className='text-gray-600 dark:text-gray-400 mb-4'>
                                Quiz: <strong>{selectedQuiz.title}</strong>
                            </p>

                            <div className='mb-4'>
                                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                                    Rejection Reason *
                                </label>
                                <textarea
                                    value={rejectionReason}
                                    onChange={(e) =>
                                        setRejectionReason(e.target.value)
                                    }
                                    rows={4}
                                    className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:text-white'
                                    placeholder='Explain why this quiz is being rejected (minimum 10 characters)'
                                />
                                <p className='text-xs text-gray-500 dark:text-gray-400 mt-1'>
                                    {rejectionReason.length}/500 characters
                                </p>
                            </div>

                            <div className='flex space-x-3'>
                                <button
                                    onClick={() => {
                                        setShowRejectModal(false);
                                        setRejectionReason('');
                                    }}
                                    className='flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                                    disabled={actionLoading}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => {
                                        if (
                                            rejectionReason.trim().length >= 10
                                        ) {
                                            handleRejectQuiz(
                                                selectedQuiz._id,
                                                rejectionReason
                                            );
                                            setShowRejectModal(false);
                                            setRejectionReason('');
                                        } else {
                                            toast.error(
                                                'Reason must be at least 10 characters'
                                            );
                                        }
                                    }}
                                    disabled={
                                        actionLoading ||
                                        rejectionReason.trim().length < 10
                                    }
                                    className='flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white rounded-lg font-medium'
                                >
                                    {actionLoading
                                        ? 'Rejecting...'
                                        : 'Confirm Rejection'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default QuizManagement;
