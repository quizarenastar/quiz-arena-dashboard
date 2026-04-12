import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    CheckCircle,
    XCircle,
    Clock,
    Users,
    DollarSign,
    AlertTriangle,
    Trophy,
    Eye,
    Trash2,
    Ban,
    ChevronDown,
    ChevronUp,
    Shield,
    BarChart3,
} from 'lucide-react';
import toast from 'react-hot-toast';
import QuizService from '../service/QuizService';
import { formatDate, formatAmount } from '../utils/format';

const QuizDetail = () => {
    const { quizId } = useParams();
    const navigate = useNavigate();

    const [quiz, setQuiz] = useState(null);
    const [attempts, setAttempts] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');
    const [expandedQuestion, setExpandedQuestion] = useState(null);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');
    const [cancelReason, setCancelReason] = useState('');
    const [revokeTarget, setRevokeTarget] = useState(null);
    const [revokeReason, setRevokeReason] = useState('');

    useEffect(() => {
        fetchQuizDetail();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [quizId]);

    const fetchQuizDetail = async () => {
        try {
            setLoading(true);
            const response = await QuizService.getQuizFullDetail(quizId);
            setQuiz(response.data.quiz);
            setAttempts(response.data.attempts || []);
            setTransactions(response.data.transactions || []);
        } catch (error) {
            toast.error(error.message || 'Failed to fetch quiz details');
            navigate('/quiz-management');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async () => {
        setActionLoading(true);
        try {
            await QuizService.approveQuiz(quizId);
            toast.success('Quiz approved!');
            fetchQuizDetail();
        } catch (error) {
            toast.error(error.message || 'Failed to approve quiz');
        } finally {
            setActionLoading(false);
        }
    };

    const handleReject = async () => {
        if (rejectionReason.trim().length < 10) {
            toast.error('Reason must be at least 10 characters');
            return;
        }
        setActionLoading(true);
        try {
            await QuizService.rejectQuiz(quizId, rejectionReason);
            toast.success('Quiz rejected!');
            setShowRejectModal(false);
            setRejectionReason('');
            fetchQuizDetail();
        } catch (error) {
            toast.error(error.message || 'Failed to reject quiz');
        } finally {
            setActionLoading(false);
        }
    };

    const handleCancel = async () => {
        if (cancelReason.trim().length < 10) {
            toast.error('Reason must be at least 10 characters');
            return;
        }
        setActionLoading(true);
        try {
            await QuizService.cancelQuiz(quizId, cancelReason);
            toast.success('Quiz cancelled & refunds processed!');
            setShowCancelModal(false);
            setCancelReason('');
            fetchQuizDetail();
        } catch (error) {
            toast.error(error.message || 'Failed to cancel quiz');
        } finally {
            setActionLoading(false);
        }
    };

    const handleDelete = async () => {
        setActionLoading(true);
        try {
            await QuizService.deleteQuiz(quizId);
            toast.success('Quiz deleted!');
            navigate('/quiz-management');
        } catch (error) {
            toast.error(error.message || 'Failed to delete quiz');
        } finally {
            setActionLoading(false);
            setShowDeleteConfirm(false);
        }
    };

    const handleRevokeReward = async () => {
        if (!revokeTarget) return;
        if (revokeReason.trim().length < 10) {
            toast.error('Reason must be at least 10 characters');
            return;
        }
        setActionLoading(true);
        try {
            await QuizService.revokeReward(
                quizId,
                revokeTarget.userId?._id || revokeTarget.userId,
                revokeReason,
            );
            toast.success('Reward revoked successfully!');
            setRevokeTarget(null);
            setRevokeReason('');
            fetchQuizDetail();
        } catch (error) {
            toast.error(error.message || 'Failed to revoke reward');
        } finally {
            setActionLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        const styles = {
            draft: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
            pending:
                'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
            approved:
                'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
            rejected:
                'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
            cancelled:
                'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
        };
        return (
            <span
                className={`px-3 py-1 text-sm font-medium rounded-full ${styles[status] || styles.draft}`}
            >
                {status?.charAt(0).toUpperCase() + status?.slice(1)}
            </span>
        );
    };

    const getDifficultyBadge = (diff) => {
        const styles = {
            easy: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
            medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
            hard: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
        };
        return (
            <span
                className={`px-2 py-1 text-xs font-medium rounded-full ${styles[diff] || ''}`}
            >
                {diff}
            </span>
        );
    };

    const formatDuration = (seconds) => {
        if (!seconds) return '—';
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return m > 0 ? `${m}m ${s}s` : `${s}s`;
    };

    const isEnded = quiz && new Date(quiz.endTime) < new Date();
    const isUpcoming = quiz && new Date(quiz.startTime) > new Date();
    const isLive =
        quiz && !isEnded && !isUpcoming && quiz.status === 'approved';

    const registeredUsers =
        quiz?.participantManagement?.registeredUsers?.filter(
            (r) => r.status !== 'refunded',
        ) || [];
    const winners = quiz?.prizePool?.winners || [];
    const completedAttempts = attempts.filter((a) =>
        ['completed', 'auto-submitted'].includes(a.status),
    );
    const flaggedAttempts = attempts.filter((a) => a.status === 'flagged');

    if (loading) {
        return (
            <div className='min-h-screen flex items-center justify-center'>
                <div className='text-center'>
                    <div className='animate-spin rounded-full h-16 w-16 border-b-2 border-yellow-500 mx-auto'></div>
                    <p className='mt-4 text-gray-600 dark:text-gray-400'>
                        Loading quiz details...
                    </p>
                </div>
            </div>
        );
    }

    if (!quiz) return null;

    return (
        <div className='min-h-screen p-4 md:p-6'>
            <div className='max-w-7xl mx-auto'>
                {/* Back button + Header */}
                <div className='mb-6'>
                    <button
                        onClick={() => navigate('/quiz-management')}
                        className='flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4 transition-colors'
                    >
                        <ArrowLeft size={20} className='mr-2' /> Back to Quiz
                        Management
                    </button>

                    <div className='flex flex-col md:flex-row md:items-start md:justify-between gap-4'>
                        <div>
                            <div className='flex items-center gap-3 flex-wrap'>
                                <h1 className='text-2xl md:text-3xl font-bold text-gray-900 dark:text-white'>
                                    {quiz.title}
                                </h1>
                                {getStatusBadge(quiz.status)}
                                {isLive && (
                                    <span className='px-2 py-1 text-xs font-medium rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200 animate-pulse'>
                                        LIVE
                                    </span>
                                )}
                            </div>
                            <p className='text-gray-600 dark:text-gray-400 mt-1'>
                                by {quiz.creator?.name} ({quiz.creator?.email})
                            </p>
                        </div>

                        {/* Action buttons */}
                        <div className='flex flex-wrap gap-2'>
                            {quiz.status === 'pending' && (
                                <>
                                    <button
                                        onClick={handleApprove}
                                        disabled={actionLoading}
                                        className='px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg font-medium flex items-center gap-2'
                                    >
                                        <CheckCircle size={16} /> Approve
                                    </button>
                                    <button
                                        onClick={() => setShowRejectModal(true)}
                                        disabled={actionLoading}
                                        className='px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white rounded-lg font-medium flex items-center gap-2'
                                    >
                                        <XCircle size={16} /> Reject
                                    </button>
                                </>
                            )}
                            {quiz.status === 'approved' &&
                                !quiz.cancelledAt && (
                                    <button
                                        onClick={() => setShowCancelModal(true)}
                                        disabled={actionLoading}
                                        className='px-4 py-2 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white rounded-lg font-medium flex items-center gap-2'
                                    >
                                        <Ban size={16} /> Cancel Quiz
                                    </button>
                                )}
                            <button
                                onClick={() => setShowDeleteConfirm(true)}
                                disabled={actionLoading}
                                className='px-4 py-2 bg-gray-700 hover:bg-gray-800 disabled:bg-gray-400 text-white rounded-lg font-medium flex items-center gap-2'
                            >
                                <Trash2 size={16} /> Delete
                            </button>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6'>
                    <StatCard
                        icon={<Users size={18} />}
                        label='Registered'
                        value={registeredUsers.length}
                    />
                    <StatCard
                        icon={<Eye size={18} />}
                        label='Attempts'
                        value={attempts.length}
                    />
                    <StatCard
                        icon={<CheckCircle size={18} />}
                        label='Completed'
                        value={completedAttempts.length}
                    />
                    <StatCard
                        icon={<BarChart3 size={18} />}
                        label='Avg Score'
                        value={
                            quiz.analytics?.averageScore
                                ? `${Math.round(quiz.analytics.averageScore)}%`
                                : '—'
                        }
                    />
                    <StatCard
                        icon={<DollarSign size={18} />}
                        label='Prize Pool'
                        value={
                            quiz.isPaid
                                ? formatAmount(quiz.prizePool?.totalAmount || 0)
                                : 'Free'
                        }
                    />
                    <StatCard
                        icon={<Shield size={18} />}
                        label='Flagged'
                        value={flaggedAttempts.length}
                        className={
                            flaggedAttempts.length > 0
                                ? 'border-red-300 dark:border-red-700'
                                : ''
                        }
                    />
                </div>

                {/* Tabs */}
                <div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm mb-6'>
                    <div className='border-b border-gray-200 dark:border-gray-700 overflow-x-auto'>
                        <nav className='flex -mb-px'>
                            {[
                                { key: 'overview', label: 'Overview' },
                                {
                                    key: 'questions',
                                    label: `Questions (${quiz.questions?.length || 0})`,
                                },
                                {
                                    key: 'attempts',
                                    label: `Attempts (${attempts.length})`,
                                },
                                {
                                    key: 'registrations',
                                    label: `Registrations (${registeredUsers.length})`,
                                },
                                ...(quiz.isPaid
                                    ? [
                                          {
                                              key: 'winners',
                                              label: `Winners (${winners.length})`,
                                          },
                                      ]
                                    : []),
                                ...(transactions.length > 0
                                    ? [
                                          {
                                              key: 'transactions',
                                              label: `Transactions (${transactions.length})`,
                                          },
                                      ]
                                    : []),
                            ].map((tab) => (
                                <button
                                    key={tab.key}
                                    onClick={() => setActiveTab(tab.key)}
                                    className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                                        activeTab === tab.key
                                            ? 'border-yellow-500 text-yellow-600 dark:text-yellow-400'
                                            : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </nav>
                    </div>

                    <div className='p-4 md:p-6'>
                        {activeTab === 'overview' && (
                            <OverviewTab
                                quiz={quiz}
                                isEnded={isEnded}
                                isUpcoming={isUpcoming}
                                isLive={isLive}
                                getDifficultyBadge={getDifficultyBadge}
                                formatDuration={formatDuration}
                            />
                        )}
                        {activeTab === 'questions' && (
                            <QuestionsTab
                                questions={quiz.questions}
                                expandedQuestion={expandedQuestion}
                                setExpandedQuestion={setExpandedQuestion}
                            />
                        )}
                        {activeTab === 'attempts' && (
                            <AttemptsTab
                                attempts={attempts}
                                formatDuration={formatDuration}
                            />
                        )}
                        {activeTab === 'registrations' && (
                            <RegistrationsTab
                                registeredUsers={registeredUsers}
                            />
                        )}
                        {activeTab === 'winners' && (
                            <WinnersTab
                                winners={winners}
                                prizePool={quiz.prizePool}
                                onRevoke={(winner) => setRevokeTarget(winner)}
                            />
                        )}
                        {activeTab === 'transactions' && (
                            <TransactionsTab transactions={transactions} />
                        )}
                    </div>
                </div>

                {/* Rejection reason display */}
                {quiz.status === 'rejected' && quiz.rejectionReason && (
                    <div className='p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg mb-6'>
                        <div className='flex items-start'>
                            <AlertTriangle
                                className='text-red-500 mr-2 mt-0.5 flex-shrink-0'
                                size={16}
                            />
                            <div>
                                <p className='font-medium text-red-800 dark:text-red-200'>
                                    Rejection Reason
                                </p>
                                <p className='text-red-700 dark:text-red-300 mt-1'>
                                    {quiz.rejectionReason}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
                {quiz.cancellationReason && (
                    <div className='p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg mb-6'>
                        <div className='flex items-start'>
                            <Ban
                                className='text-orange-500 mr-2 mt-0.5 flex-shrink-0'
                                size={16}
                            />
                            <div>
                                <p className='font-medium text-orange-800 dark:text-orange-200'>
                                    Cancellation Reason
                                </p>
                                <p className='text-orange-700 dark:text-orange-300 mt-1'>
                                    {quiz.cancellationReason}
                                </p>
                                {quiz.cancelledAt && (
                                    <p className='text-orange-500 text-xs mt-1'>
                                        Cancelled on{' '}
                                        {formatDate(quiz.cancelledAt)}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Reject Modal */}
            {showRejectModal && (
                <Modal
                    onClose={() => {
                        setShowRejectModal(false);
                        setRejectionReason('');
                    }}
                >
                    <h3 className='text-xl font-bold text-gray-900 dark:text-white flex items-center mb-4'>
                        <AlertTriangle
                            className='text-red-500 mr-2'
                            size={24}
                        />{' '}
                        Reject Quiz
                    </h3>
                    <p className='text-gray-600 dark:text-gray-400 mb-4'>
                        Quiz: <strong>{quiz.title}</strong>
                    </p>
                    <textarea
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        rows={4}
                        className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:text-white mb-4'
                        placeholder='Explain why this quiz is being rejected (min 10 characters)'
                    />
                    <div className='flex gap-3'>
                        <button
                            onClick={() => {
                                setShowRejectModal(false);
                                setRejectionReason('');
                            }}
                            disabled={actionLoading}
                            className='flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleReject}
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
                </Modal>
            )}

            {/* Cancel Modal */}
            {showCancelModal && (
                <Modal
                    onClose={() => {
                        setShowCancelModal(false);
                        setCancelReason('');
                    }}
                >
                    <h3 className='text-xl font-bold text-gray-900 dark:text-white flex items-center mb-4'>
                        <Ban className='text-orange-500 mr-2' size={24} />{' '}
                        Cancel Quiz
                    </h3>
                    <p className='text-gray-600 dark:text-gray-400 mb-2'>
                        Quiz: <strong>{quiz.title}</strong>
                    </p>
                    {quiz.isPaid && (
                        <p className='text-sm text-orange-600 dark:text-orange-400 mb-4'>
                            This is a paid quiz. All {registeredUsers.length}{' '}
                            registered users will be refunded.
                        </p>
                    )}
                    <textarea
                        value={cancelReason}
                        onChange={(e) => setCancelReason(e.target.value)}
                        rows={4}
                        className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white mb-4'
                        placeholder='Explain why this quiz is being cancelled (min 10 characters)'
                    />
                    <div className='flex gap-3'>
                        <button
                            onClick={() => {
                                setShowCancelModal(false);
                                setCancelReason('');
                            }}
                            disabled={actionLoading}
                            className='flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleCancel}
                            disabled={
                                actionLoading || cancelReason.trim().length < 10
                            }
                            className='flex-1 px-4 py-2 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white rounded-lg font-medium'
                        >
                            {actionLoading
                                ? 'Cancelling...'
                                : 'Confirm Cancellation'}
                        </button>
                    </div>
                </Modal>
            )}

            {/* Delete Confirm Modal */}
            {showDeleteConfirm && (
                <Modal onClose={() => setShowDeleteConfirm(false)}>
                    <div className='flex items-center gap-3 mb-4'>
                        <div className='p-2 bg-red-100 dark:bg-red-900/30 rounded-full'>
                            <Trash2
                                size={20}
                                className='text-red-600 dark:text-red-400'
                            />
                        </div>
                        <h3 className='text-lg font-bold text-gray-900 dark:text-white'>
                            Delete Quiz
                        </h3>
                    </div>
                    <p className='text-gray-600 dark:text-gray-400 mb-1'>
                        Are you sure you want to permanently delete:
                    </p>
                    <p className='font-semibold text-gray-900 dark:text-white mb-4'>
                        "{quiz.title}"
                    </p>
                    <p className='text-xs text-red-500 mb-5'>
                        This action cannot be undone. All questions and attempts
                        will be removed.
                    </p>
                    <div className='flex gap-3'>
                        <button
                            onClick={() => setShowDeleteConfirm(false)}
                            disabled={actionLoading}
                            className='flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium'
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleDelete}
                            disabled={actionLoading}
                            className='flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white rounded-lg font-medium flex items-center justify-center gap-2'
                        >
                            <Trash2 size={14} />{' '}
                            {actionLoading ? 'Deleting...' : 'Yes, Delete'}
                        </button>
                    </div>
                </Modal>
            )}

            {/* Revoke Reward Modal */}
            {revokeTarget && (
                <Modal>
                    <div className='flex items-center gap-3 mb-4'>
                        <div className='p-2 bg-red-100 dark:bg-red-900/30 rounded-full'>
                            <Ban
                                size={20}
                                className='text-red-600 dark:text-red-400'
                            />
                        </div>
                        <h3 className='text-lg font-bold text-gray-900 dark:text-white'>
                            Revoke Reward
                        </h3>
                    </div>
                    <p className='text-gray-600 dark:text-gray-400 mb-1'>
                        Revoke prize from{' '}
                        <strong>
                            {revokeTarget.userId?.username || 'Unknown'}
                        </strong>{' '}
                        (Rank #{revokeTarget.rank})
                    </p>
                    <p className='text-sm font-semibold text-red-600 mb-4'>
                        Amount: {formatAmount(revokeTarget.prize || 0)} will be
                        deducted from their wallet.
                    </p>
                    <textarea
                        value={revokeReason}
                        onChange={(e) => setRevokeReason(e.target.value)}
                        rows={3}
                        className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:text-white mb-4'
                        placeholder='Reason for revoking reward (min 10 characters)'
                    />
                    <div className='flex gap-3'>
                        <button
                            onClick={() => {
                                setRevokeTarget(null);
                                setRevokeReason('');
                            }}
                            disabled={actionLoading}
                            className='flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium'
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleRevokeReward}
                            disabled={
                                actionLoading || revokeReason.trim().length < 10
                            }
                            className='flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white rounded-lg font-medium'
                        >
                            {actionLoading ? 'Revoking...' : 'Confirm Revoke'}
                        </button>
                    </div>
                </Modal>
            )}
        </div>
    );
};

/* ─── Sub Components ─── */

const StatCard = ({ icon, label, value, className = '' }) => (
    <div
        className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 ${className}`}
    >
        <div className='flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-1'>
            {icon}
            <span className='text-xs font-medium'>{label}</span>
        </div>
        <p className='text-lg font-bold text-gray-900 dark:text-white'>
            {value}
        </p>
    </div>
);

const Modal = ({ children }) => (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
        <div className='bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6 shadow-xl'>
            {children}
        </div>
    </div>
);

/* ─── Overview Tab ─── */
const OverviewTab = ({
    quiz,
    isEnded,
    isUpcoming,
    isLive,
    getDifficultyBadge,
    formatDuration,
}) => (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <div>
            <h3 className='font-semibold text-gray-900 dark:text-white mb-3'>
                Quiz Info
            </h3>
            <div className='space-y-3 text-sm'>
                <InfoRow
                    label='Category'
                    value={
                        <span className='px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs'>
                            {quiz.category}
                        </span>
                    }
                />
                <InfoRow
                    label='Difficulty'
                    value={getDifficultyBadge(quiz.difficulty)}
                />
                <InfoRow label='Topic' value={quiz.topic} />
                <InfoRow label='Visibility' value={quiz.visibility} />
                <InfoRow
                    label='Questions'
                    value={quiz.questions?.length || 0}
                />
                <InfoRow
                    label='Duration'
                    value={formatDuration(quiz.duration)}
                />
                <InfoRow
                    label='Price'
                    value={quiz.isPaid ? formatAmount(quiz.price) : 'Free'}
                />
                {quiz.isAIGenerated && (
                    <InfoRow
                        label='AI Generated'
                        value={
                            <CheckCircle size={16} className='text-green-500' />
                        }
                    />
                )}
                {quiz.tags?.length > 0 && (
                    <InfoRow
                        label='Tags'
                        value={
                            <div className='flex flex-wrap gap-1'>
                                {quiz.tags.map((tag, i) => (
                                    <span
                                        key={i}
                                        className='px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs'
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        }
                    />
                )}
            </div>
        </div>
        <div>
            <h3 className='font-semibold text-gray-900 dark:text-white mb-3'>
                Timing & Status
            </h3>
            <div className='space-y-3 text-sm'>
                <InfoRow
                    label='Start Time'
                    value={formatDate(quiz.startTime)}
                />
                <InfoRow label='End Time' value={formatDate(quiz.endTime)} />
                <InfoRow
                    label='Status'
                    value={
                        isLive ? (
                            <span className='text-emerald-600 font-medium'>
                                Live Now
                            </span>
                        ) : isUpcoming ? (
                            <span className='text-blue-600 font-medium'>
                                Upcoming
                            </span>
                        ) : isEnded ? (
                            <span className='text-gray-500 font-medium'>
                                Ended
                            </span>
                        ) : (
                            <span className='text-gray-500'>—</span>
                        )
                    }
                />
                {quiz.publishedAt && (
                    <InfoRow
                        label='Published'
                        value={formatDate(quiz.publishedAt)}
                    />
                )}
                <InfoRow label='Created' value={formatDate(quiz.createdAt)} />
            </div>

            {quiz.isPaid && (
                <>
                    <h3 className='font-semibold text-gray-900 dark:text-white mb-3 mt-6'>
                        Prize Pool
                    </h3>
                    <div className='space-y-3 text-sm'>
                        <InfoRow
                            label='Total Pool'
                            value={formatAmount(
                                quiz.prizePool?.totalAmount || 0,
                            )}
                        />
                        <InfoRow
                            label='Prize Money'
                            value={formatAmount(
                                quiz.prizePool?.prizeMoney || 0,
                            )}
                        />
                        <InfoRow
                            label='Platform Fee'
                            value={formatAmount(
                                quiz.prizePool?.platformFee || 0,
                            )}
                        />
                        <InfoRow
                            label='Creator Fee'
                            value={formatAmount(
                                quiz.prizePool?.creatorFee || 0,
                            )}
                        />
                        <InfoRow
                            label='Distributed'
                            value={
                                quiz.prizePool?.distributed ? (
                                    <CheckCircle
                                        size={16}
                                        className='text-green-500'
                                    />
                                ) : (
                                    <XCircle
                                        size={16}
                                        className='text-gray-400'
                                    />
                                )
                            }
                        />
                    </div>
                </>
            )}

            {quiz.aiReview?.score != null && (
                <>
                    <h3 className='font-semibold text-gray-900 dark:text-white mb-3 mt-6'>
                        AI Review
                    </h3>
                    <div className='space-y-3 text-sm'>
                        <InfoRow
                            label='Score'
                            value={`${quiz.aiReview.score}/100`}
                        />
                        {quiz.aiReview.reason && (
                            <InfoRow
                                label='Reason'
                                value={quiz.aiReview.reason}
                            />
                        )}
                    </div>
                </>
            )}
        </div>

        {quiz.description && (
            <div className='md:col-span-2'>
                <h3 className='font-semibold text-gray-900 dark:text-white mb-2'>
                    Description
                </h3>
                <p className='text-gray-600 dark:text-gray-400 text-sm whitespace-pre-wrap'>
                    {quiz.description}
                </p>
            </div>
        )}

        {/* Analytics */}
        <div className='md:col-span-2'>
            <h3 className='font-semibold text-gray-900 dark:text-white mb-3'>
                Analytics
            </h3>
            <div className='grid grid-cols-2 md:grid-cols-5 gap-4'>
                <MiniStat
                    label='Total Attempts'
                    value={quiz.analytics?.totalAttempts || 0}
                />
                <MiniStat
                    label='Avg Score'
                    value={
                        quiz.analytics?.averageScore
                            ? `${Math.round(quiz.analytics.averageScore)}%`
                            : '—'
                    }
                />
                <MiniStat
                    label='Completion Rate'
                    value={
                        quiz.analytics?.completionRate
                            ? `${Math.round(quiz.analytics.completionRate)}%`
                            : '—'
                    }
                />
                <MiniStat
                    label='Avg Time'
                    value={
                        quiz.analytics?.avgTimeSpent
                            ? formatDuration(
                                  Math.round(quiz.analytics.avgTimeSpent),
                              )
                            : '—'
                    }
                />
                <MiniStat
                    label='Revenue'
                    value={formatAmount(quiz.analytics?.revenue || 0)}
                />
            </div>
        </div>
    </div>
);

const InfoRow = ({ label, value }) => (
    <div className='flex items-start justify-between'>
        <span className='text-gray-500 dark:text-gray-400 font-medium'>
            {label}
        </span>
        <span className='text-gray-900 dark:text-white text-right ml-4'>
            {value}
        </span>
    </div>
);

const MiniStat = ({ label, value }) => (
    <div className='bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 text-center'>
        <p className='text-xs text-gray-500 dark:text-gray-400'>{label}</p>
        <p className='text-lg font-bold text-gray-900 dark:text-white'>
            {value}
        </p>
    </div>
);

/* ─── Questions Tab ─── */
const QuestionsTab = ({
    questions = [],
    expandedQuestion,
    setExpandedQuestion,
}) => (
    <div className='space-y-3'>
        {questions.length === 0 ? (
            <p className='text-gray-500 dark:text-gray-400 text-center py-8'>
                No questions found.
            </p>
        ) : (
            questions.map((q, index) => (
                <div
                    key={q._id || index}
                    className='border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden'
                >
                    <button
                        onClick={() =>
                            setExpandedQuestion(
                                expandedQuestion === index ? null : index,
                            )
                        }
                        className='w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors'
                    >
                        <div className='flex items-center gap-3'>
                            <span className='inline-flex items-center justify-center w-7 h-7 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 text-sm font-bold flex-shrink-0'>
                                {index + 1}
                            </span>
                            <span className='text-sm font-medium text-gray-900 dark:text-white line-clamp-1'>
                                {q.question || q.text}
                            </span>
                        </div>
                        <div className='flex items-center gap-3 flex-shrink-0'>
                            <span className='text-xs text-gray-500 dark:text-gray-400'>
                                {q.points || 1} pts
                            </span>
                            {expandedQuestion === index ? (
                                <ChevronUp size={16} />
                            ) : (
                                <ChevronDown size={16} />
                            )}
                        </div>
                    </button>
                    {expandedQuestion === index && (
                        <div className='px-4 pb-4 border-t border-gray-200 dark:border-gray-600 pt-3'>
                            <div className='grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm'>
                                {q.options?.map((option, optIndex) => (
                                    <div
                                        key={optIndex}
                                        className={`p-2 rounded flex items-start gap-1.5 ${
                                            optIndex === q.correctAnswer
                                                ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 font-medium'
                                                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                                        }`}
                                    >
                                        <span className='font-bold flex-shrink-0'>
                                            {String.fromCharCode(65 + optIndex)}
                                            .
                                        </span>
                                        {option}
                                        {optIndex === q.correctAnswer && (
                                            <CheckCircle
                                                size={12}
                                                className='ml-auto flex-shrink-0 mt-0.5'
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>
                            {q.explanation && (
                                <p className='mt-2 text-xs text-gray-500 dark:text-gray-400 italic border-l-2 border-indigo-300 pl-2'>
                                    {q.explanation}
                                </p>
                            )}
                            <div className='mt-2 flex gap-4 text-xs text-gray-500 dark:text-gray-400'>
                                {q.difficulty && (
                                    <span>Difficulty: {q.difficulty}</span>
                                )}
                                {q.timeLimit && (
                                    <span>Time: {q.timeLimit}s</span>
                                )}
                                {q.analytics?.totalAttempts > 0 && (
                                    <span>
                                        Accuracy:{' '}
                                        {Math.round(
                                            (q.analytics.correctAttempts /
                                                q.analytics.totalAttempts) *
                                                100,
                                        )}
                                        %
                                    </span>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            ))
        )}
    </div>
);

/* ─── Attempts Tab ─── */
const AttemptsTab = ({ attempts, formatDuration }) => (
    <div>
        {attempts.length === 0 ? (
            <p className='text-gray-500 dark:text-gray-400 text-center py-8'>
                No attempts yet.
            </p>
        ) : (
            <div className='overflow-x-auto'>
                <table className='w-full text-sm'>
                    <thead className='bg-gray-50 dark:bg-gray-700'>
                        <tr>
                            <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase'>
                                Rank
                            </th>
                            <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase'>
                                User
                            </th>
                            <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase'>
                                Score
                            </th>
                            <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase'>
                                Correct
                            </th>
                            <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase'>
                                Percentage
                            </th>
                            <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase'>
                                Time
                            </th>
                            <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase'>
                                Status
                            </th>
                            <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase'>
                                Violations
                            </th>
                            <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase'>
                                Date
                            </th>
                        </tr>
                    </thead>
                    <tbody className='divide-y divide-gray-200 dark:divide-gray-700'>
                        {attempts.map((attempt, index) => (
                            <tr
                                key={attempt._id}
                                className='hover:bg-gray-50 dark:hover:bg-gray-700/50'
                            >
                                <td className='px-4 py-3'>
                                    <span
                                        className={`font-bold ${index < 3 ? 'text-yellow-600' : 'text-gray-500'}`}
                                    >
                                        #{index + 1}
                                    </span>
                                </td>
                                <td className='px-4 py-3'>
                                    <div>
                                        <p className='font-medium text-gray-900 dark:text-white'>
                                            {attempt.userId?.username ||
                                                'Unknown'}
                                        </p>
                                        <p className='text-xs text-gray-500 dark:text-gray-400'>
                                            {attempt.userId?.email}
                                        </p>
                                    </div>
                                </td>
                                <td className='px-4 py-3 font-semibold text-gray-900 dark:text-white'>
                                    {attempt.score}
                                </td>
                                <td className='px-4 py-3 text-gray-700 dark:text-gray-300'>
                                    {attempt.correctAnswers}/
                                    {attempt.totalQuestions}
                                </td>
                                <td className='px-4 py-3'>
                                    <span
                                        className={`font-medium ${attempt.percentage >= 70 ? 'text-green-600' : attempt.percentage >= 40 ? 'text-yellow-600' : 'text-red-600'}`}
                                    >
                                        {Math.round(attempt.percentage || 0)}%
                                    </span>
                                </td>
                                <td className='px-4 py-3 text-gray-700 dark:text-gray-300'>
                                    {formatDuration(attempt.duration)}
                                </td>
                                <td className='px-4 py-3'>
                                    <AttemptStatusBadge
                                        status={attempt.status}
                                    />
                                </td>
                                <td className='px-4 py-3'>
                                    {attempt.antiCheatViolations?.length > 0 ? (
                                        <span className='px-2 py-1 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 text-xs rounded-full font-medium'>
                                            {attempt.antiCheatViolations.length}{' '}
                                            violations
                                        </span>
                                    ) : (
                                        <span className='text-gray-400 text-xs'>
                                            None
                                        </span>
                                    )}
                                </td>
                                <td className='px-4 py-3 text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap'>
                                    {formatDate(attempt.createdAt)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )}
    </div>
);

const AttemptStatusBadge = ({ status }) => {
    const styles = {
        completed:
            'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
        'auto-submitted':
            'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
        'in-progress':
            'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
        abandoned:
            'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
        flagged: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    };
    return (
        <span
            className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status] || styles.abandoned}`}
        >
            {status}
        </span>
    );
};

/* ─── Registrations Tab ─── */
const RegistrationsTab = ({ registeredUsers }) => (
    <div>
        {registeredUsers.length === 0 ? (
            <p className='text-gray-500 dark:text-gray-400 text-center py-8'>
                No registrations.
            </p>
        ) : (
            <div className='overflow-x-auto'>
                <table className='w-full text-sm'>
                    <thead className='bg-gray-50 dark:bg-gray-700'>
                        <tr>
                            <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase'>
                                #
                            </th>
                            <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase'>
                                User
                            </th>
                            <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase'>
                                Status
                            </th>
                            <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase'>
                                Registered At
                            </th>
                        </tr>
                    </thead>
                    <tbody className='divide-y divide-gray-200 dark:divide-gray-700'>
                        {registeredUsers.map((reg, index) => (
                            <tr
                                key={reg.userId?._id || index}
                                className='hover:bg-gray-50 dark:hover:bg-gray-700/50'
                            >
                                <td className='px-4 py-3 text-gray-500'>
                                    {index + 1}
                                </td>
                                <td className='px-4 py-3'>
                                    <div>
                                        <p className='font-medium text-gray-900 dark:text-white'>
                                            {reg.userId?.username || 'Unknown'}
                                        </p>
                                        <p className='text-xs text-gray-500 dark:text-gray-400'>
                                            {reg.userId?.email}
                                        </p>
                                    </div>
                                </td>
                                <td className='px-4 py-3'>
                                    <span
                                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                                            reg.status === 'paid'
                                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                                : reg.status === 'refunded'
                                                  ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
                                                  : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                                        }`}
                                    >
                                        {reg.status}
                                    </span>
                                </td>
                                <td className='px-4 py-3 text-xs text-gray-500 dark:text-gray-400'>
                                    {formatDate(reg.registeredAt)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )}
    </div>
);

/* ─── Winners Tab ─── */
const WinnersTab = ({ winners = [], prizePool, onRevoke }) => (
    <div>
        {!prizePool?.distributed && (
            <div className='mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg text-sm text-yellow-700 dark:text-yellow-300'>
                Prizes have not been distributed yet.
            </div>
        )}
        {winners.length === 0 ? (
            <p className='text-gray-500 dark:text-gray-400 text-center py-8'>
                No winners declared yet.
            </p>
        ) : (
            <div className='overflow-x-auto'>
                <table className='w-full text-sm'>
                    <thead className='bg-gray-50 dark:bg-gray-700'>
                        <tr>
                            <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase'>
                                Rank
                            </th>
                            <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase'>
                                User
                            </th>
                            <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase'>
                                Prize
                            </th>
                            <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase'>
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody className='divide-y divide-gray-200 dark:divide-gray-700'>
                        {winners.map((w, index) => (
                            <tr
                                key={w.userId?._id || index}
                                className='hover:bg-gray-50 dark:hover:bg-gray-700/50'
                            >
                                <td className='px-4 py-3'>
                                    <div className='flex items-center gap-2'>
                                        {w.rank <= 3 ? (
                                            <Trophy
                                                size={16}
                                                className={
                                                    w.rank === 1
                                                        ? 'text-yellow-500'
                                                        : w.rank === 2
                                                          ? 'text-gray-400'
                                                          : 'text-amber-600'
                                                }
                                            />
                                        ) : null}
                                        <span className='font-bold text-gray-900 dark:text-white'>
                                            #{w.rank}
                                        </span>
                                    </div>
                                </td>
                                <td className='px-4 py-3'>
                                    <p className='font-medium text-gray-900 dark:text-white'>
                                        {w.userId?.username || 'Unknown'}
                                    </p>
                                    <p className='text-xs text-gray-500 dark:text-gray-400'>
                                        {w.userId?.email}
                                    </p>
                                </td>
                                <td className='px-4 py-3 font-semibold text-green-600'>
                                    {formatAmount(w.prize || 0)}
                                </td>
                                <td className='px-4 py-3'>
                                    <button
                                        onClick={() => onRevoke(w)}
                                        className='px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs font-medium rounded-md inline-flex items-center gap-1'
                                    >
                                        <Ban size={12} />
                                        Revoke
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )}
    </div>
);

/* ─── Transactions Tab ─── */
const TransactionsTab = ({ transactions }) => (
    <div>
        {transactions.length === 0 ? (
            <p className='text-gray-500 dark:text-gray-400 text-center py-8'>
                No transactions.
            </p>
        ) : (
            <div className='overflow-x-auto'>
                <table className='w-full text-sm'>
                    <thead className='bg-gray-50 dark:bg-gray-700'>
                        <tr>
                            <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase'>
                                User
                            </th>
                            <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase'>
                                Type
                            </th>
                            <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase'>
                                Amount
                            </th>
                            <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase'>
                                Status
                            </th>
                            <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase'>
                                Description
                            </th>
                            <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase'>
                                Date
                            </th>
                        </tr>
                    </thead>
                    <tbody className='divide-y divide-gray-200 dark:divide-gray-700'>
                        {transactions.map((tx) => (
                            <tr
                                key={tx._id}
                                className='hover:bg-gray-50 dark:hover:bg-gray-700/50'
                            >
                                <td className='px-4 py-3'>
                                    <p className='font-medium text-gray-900 dark:text-white'>
                                        {tx.userId?.username || 'Unknown'}
                                    </p>
                                </td>
                                <td className='px-4 py-3'>
                                    <span
                                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                                            tx.type === 'payment'
                                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                                                : tx.type === 'earning'
                                                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                                  : tx.type === 'refund'
                                                    ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
                                                    : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                                        }`}
                                    >
                                        {tx.type}
                                    </span>
                                </td>
                                <td className='px-4 py-3 font-semibold text-gray-900 dark:text-white'>
                                    {formatAmount(tx.amount)}
                                </td>
                                <td className='px-4 py-3'>
                                    <span
                                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                                            tx.status === 'completed'
                                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                                : tx.status === 'pending'
                                                  ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                                  : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                        }`}
                                    >
                                        {tx.status}
                                    </span>
                                </td>
                                <td className='px-4 py-3 text-gray-600 dark:text-gray-400 text-xs max-w-xs truncate'>
                                    {tx.description}
                                </td>
                                <td className='px-4 py-3 text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap'>
                                    {formatDate(tx.createdAt)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )}
    </div>
);

export default QuizDetail;
