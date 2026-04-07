import { useState, useEffect } from 'react';
import {
    Swords,
    Users,
    Gamepad2,
    MessageSquare,
    TrendingUp,
    Trash2,
    Eye,
    Search,
    ChevronLeft,
    ChevronRight,
    Loader,
    X,
    Trophy,
    Clock,
    Globe,
    Lock,
    Activity,
} from 'lucide-react';
import WarRoomService from '../service/WarRoomService';
import toast from 'react-hot-toast';

const STATUS_COLORS = {
    waiting: { bg: 'bg-green-500/10', text: 'text-green-400', label: 'Waiting' },
    countdown: { bg: 'bg-yellow-500/10', text: 'text-yellow-400', label: 'Countdown' },
    'in-progress': { bg: 'bg-orange-500/10', text: 'text-orange-400', label: 'In Progress' },
    finished: { bg: 'bg-blue-500/10', text: 'text-blue-400', label: 'Finished' },
    closed: { bg: 'bg-gray-500/10', text: 'text-gray-400', label: 'Closed' },
};

export default function WarRoomManagement() {
    const [stats, setStats] = useState(null);
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [roomsLoading, setRoomsLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({});
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [detailsLoading, setDetailsLoading] = useState(false);
    const [deleting, setDeleting] = useState(null);

    useEffect(() => {
        loadStats();
        loadRooms();
    }, []);

    useEffect(() => {
        loadRooms();
    }, [page, statusFilter]);

    const loadStats = async () => {
        try {
            const res = await WarRoomService.getStats();
            setStats(res.data);
        } catch (err) {
            toast.error('Failed to load war room stats');
        }
    };

    const loadRooms = async () => {
        setRoomsLoading(true);
        try {
            const params = { page, limit: 15 };
            if (statusFilter) params.status = statusFilter;
            if (search) params.search = search;
            const res = await WarRoomService.getAllRooms(params);
            setRooms(res.data || []);
            setPagination(res.pagination || {});
        } catch (err) {
            toast.error('Failed to load rooms');
        } finally {
            setRoomsLoading(false);
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setPage(1);
        loadRooms();
    };

    const handleViewDetails = async (roomId) => {
        setDetailsLoading(true);
        try {
            const res = await WarRoomService.getRoomDetails(roomId);
            setSelectedRoom(res.data);
        } catch (err) {
            toast.error('Failed to load room details');
        } finally {
            setDetailsLoading(false);
        }
    };

    const handleDelete = async (roomId) => {
        if (!confirm('Are you sure you want to delete this war room? This action cannot be undone.')) return;
        setDeleting(roomId);
        try {
            await WarRoomService.deleteRoom(roomId);
            toast.success('Room deleted');
            loadRooms();
            loadStats();
            if (selectedRoom?.room?._id === roomId) setSelectedRoom(null);
        } catch (err) {
            toast.error('Failed to delete room');
        } finally {
            setDeleting(null);
        }
    };

    if (loading) {
        return (
            <div className='flex items-center justify-center min-h-[400px]'>
                <Loader className='animate-spin text-purple-500' size={32} />
            </div>
        );
    }

    const counts = stats?.counts || {};

    return (
        <div className='space-y-6'>
            {/* Page Header */}
            <div className='flex items-center justify-between'>
                <div className='flex items-center gap-3'>
                    <div className='p-2.5 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-700 shadow-lg shadow-purple-500/25'>
                        <Swords size={24} className='text-white' />
                    </div>
                    <div>
                        <h1 className='text-2xl font-bold text-gray-900 dark:text-white'>
                            War Room Management
                        </h1>
                        <p className='text-sm text-gray-500 dark:text-gray-400'>
                            Monitor and manage multiplayer quiz rooms
                        </p>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4'>
                {[
                    { label: 'Total Rooms', value: counts.totalRooms || 0, icon: <Swords size={20} />, color: 'from-purple-500 to-indigo-600' },
                    { label: 'Active Now', value: counts.activeRooms || 0, icon: <Activity size={20} />, color: 'from-green-500 to-emerald-600' },
                    { label: 'Quizzes Played', value: counts.totalQuizzes || 0, icon: <Gamepad2 size={20} />, color: 'from-blue-500 to-cyan-600' },
                    { label: 'Unique Players', value: counts.uniqueParticipants || 0, icon: <Users size={20} />, color: 'from-orange-500 to-amber-600' },
                    { label: 'Avg Players/Room', value: counts.avgPlayersPerRoom || 0, icon: <TrendingUp size={20} />, color: 'from-pink-500 to-rose-600' },
                ].map((stat) => (
                    <div
                        key={stat.label}
                        className='bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700/50'
                    >
                        <div className='flex items-center justify-between mb-3'>
                            <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.color} text-white`}>
                                {stat.icon}
                            </div>
                        </div>
                        <p className='text-2xl font-bold text-gray-900 dark:text-white'>
                            {stat.value.toLocaleString()}
                        </p>
                        <p className='text-xs text-gray-500 dark:text-gray-400 mt-1'>
                            {stat.label}
                        </p>
                    </div>
                ))}
            </div>

            {/* Analytics Grid */}
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                {/* Top Hosts */}
                <div className='bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700/50'>
                    <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2'>
                        <Trophy size={18} className='text-amber-500' />
                        Top War Room Hosts
                    </h3>
                    {stats?.topHosts?.length > 0 ? (
                        <div className='space-y-3'>
                            {stats.topHosts.map((host, idx) => (
                                <div key={host._id} className='flex items-center gap-3'>
                                    <span className='w-6 text-center text-sm font-bold text-gray-400'>
                                        #{idx + 1}
                                    </span>
                                    <div className='w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold'>
                                        {host.profilePicture ? (
                                            <img src={host.profilePicture} alt='' className='w-full h-full rounded-full object-cover' />
                                        ) : (
                                            host.username?.charAt(0)?.toUpperCase()
                                        )}
                                    </div>
                                    <span className='flex-1 text-sm text-gray-700 dark:text-gray-300'>
                                        {host.username}
                                    </span>
                                    <span className='text-sm font-semibold text-purple-500'>
                                        {host.roomCount} rooms
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className='text-sm text-gray-400 text-center py-4'>No data yet</p>
                    )}
                </div>

                {/* Popular Topics */}
                <div className='bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700/50'>
                    <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2'>
                        <Gamepad2 size={18} className='text-blue-500' />
                        Popular Quiz Topics
                    </h3>
                    {stats?.topicDistribution?.length > 0 ? (
                        <div className='space-y-3'>
                            {stats.topicDistribution.map((topic) => {
                                const maxCount = stats.topicDistribution[0]?.count || 1;
                                const percentage = (topic.count / maxCount) * 100;
                                return (
                                    <div key={topic._id}>
                                        <div className='flex items-center justify-between mb-1'>
                                            <span className='text-sm text-gray-700 dark:text-gray-300 truncate'>
                                                {topic._id}
                                            </span>
                                            <span className='text-xs text-gray-500 ml-2'>
                                                {topic.count} quizzes
                                            </span>
                                        </div>
                                        <div className='w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2'>
                                            <div
                                                className='bg-gradient-to-r from-purple-500 to-indigo-500 h-2 rounded-full transition-all duration-500'
                                                style={{ width: `${percentage}%` }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <p className='text-sm text-gray-400 text-center py-4'>No data yet</p>
                    )}
                </div>
            </div>

            {/* Recent Rooms / Room List */}
            <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/50'>
                {/* Toolbar */}
                <div className='p-5 border-b border-gray-100 dark:border-gray-700/50'>
                    <div className='flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between'>
                        <h3 className='text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2'>
                            <Swords size={18} className='text-purple-500' />
                            All War Rooms
                        </h3>
                        <div className='flex gap-3 w-full sm:w-auto'>
                            <form onSubmit={handleSearch} className='flex gap-2 flex-1 sm:flex-initial'>
                                <div className='relative'>
                                    <Search size={14} className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400' />
                                    <input
                                        type='text'
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        placeholder='Search rooms...'
                                        className='pl-9 pr-3 py-2 rounded-lg text-sm bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 outline-none focus:border-purple-500 w-44'
                                    />
                                </div>
                            </form>
                            <select
                                value={statusFilter}
                                onChange={(e) => {
                                    setStatusFilter(e.target.value);
                                    setPage(1);
                                }}
                                className='px-3 py-2 rounded-lg text-sm bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 outline-none cursor-pointer'
                            >
                                <option value=''>All Status</option>
                                <option value='waiting'>Waiting</option>
                                <option value='in-progress'>In Progress</option>
                                <option value='finished'>Finished</option>
                                <option value='closed'>Closed</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className='overflow-x-auto'>
                    {roomsLoading ? (
                        <div className='flex items-center justify-center py-12'>
                            <Loader className='animate-spin text-purple-500' size={24} />
                        </div>
                    ) : rooms.length === 0 ? (
                        <div className='text-center py-12'>
                            <Swords size={40} className='text-gray-300 dark:text-gray-600 mx-auto mb-3' />
                            <p className='text-gray-500 dark:text-gray-400'>No war rooms found</p>
                        </div>
                    ) : (
                        <table className='w-full'>
                            <thead>
                                <tr className='text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                                    <th className='px-5 py-3'>Room</th>
                                    <th className='px-5 py-3'>Code</th>
                                    <th className='px-5 py-3'>Host</th>
                                    <th className='px-5 py-3'>Players</th>
                                    <th className='px-5 py-3'>Status</th>
                                    <th className='px-5 py-3'>Rounds</th>
                                    <th className='px-5 py-3'>Created</th>
                                    <th className='px-5 py-3'>Actions</th>
                                </tr>
                            </thead>
                            <tbody className='divide-y divide-gray-100 dark:divide-gray-700/50'>
                                {rooms.map((room) => {
                                    const status = STATUS_COLORS[room.status] || STATUS_COLORS.closed;
                                    return (
                                        <tr key={room._id} className='hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors'>
                                            <td className='px-5 py-4'>
                                                <div className='flex items-center gap-2'>
                                                    {room.visibility === 'private' ? (
                                                        <Lock size={12} className='text-gray-400' />
                                                    ) : (
                                                        <Globe size={12} className='text-gray-400' />
                                                    )}
                                                    <span className='text-sm font-medium text-gray-900 dark:text-white truncate max-w-[150px]'>
                                                        {room.name}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className='px-5 py-4'>
                                                <span className='font-mono text-xs px-2 py-1 rounded bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400'>
                                                    {room.roomCode}
                                                </span>
                                            </td>
                                            <td className='px-5 py-4 text-sm text-gray-600 dark:text-gray-400'>
                                                {room.hostId?.username || 'Unknown'}
                                            </td>
                                            <td className='px-5 py-4 text-sm text-gray-600 dark:text-gray-400'>
                                                {room.members?.length || 0}/{room.maxPlayers}
                                            </td>
                                            <td className='px-5 py-4'>
                                                <span className={`text-xs px-2.5 py-1 rounded-full ${status.bg} ${status.text}`}>
                                                    {status.label}
                                                </span>
                                            </td>
                                            <td className='px-5 py-4 text-sm text-gray-600 dark:text-gray-400'>
                                                {room.roundNumber || 0}
                                            </td>
                                            <td className='px-5 py-4 text-xs text-gray-500 dark:text-gray-400'>
                                                {new Date(room.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className='px-5 py-4'>
                                                <div className='flex items-center gap-2'>
                                                    <button
                                                        onClick={() => handleViewDetails(room._id)}
                                                        className='p-1.5 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 text-gray-400 hover:text-purple-500 transition-colors cursor-pointer'
                                                        title='View Details'
                                                    >
                                                        <Eye size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(room._id)}
                                                        disabled={deleting === room._id}
                                                        className='p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 transition-colors cursor-pointer disabled:opacity-50'
                                                        title='Delete Room'
                                                    >
                                                        {deleting === room._id ? (
                                                            <Loader size={16} className='animate-spin' />
                                                        ) : (
                                                            <Trash2 size={16} />
                                                        )}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Pagination */}
                {pagination.pages > 1 && (
                    <div className='px-5 py-4 border-t border-gray-100 dark:border-gray-700/50 flex items-center justify-between'>
                        <span className='text-sm text-gray-500 dark:text-gray-400'>
                            Page {pagination.page} of {pagination.pages} ({pagination.total} total)
                        </span>
                        <div className='flex gap-2'>
                            <button
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className='p-2 rounded-lg bg-gray-100 dark:bg-gray-700 disabled:opacity-40 cursor-pointer'
                            >
                                <ChevronLeft size={16} className='text-gray-600 dark:text-gray-400' />
                            </button>
                            <button
                                onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
                                disabled={page === pagination.pages}
                                className='p-2 rounded-lg bg-gray-100 dark:bg-gray-700 disabled:opacity-40 cursor-pointer'
                            >
                                <ChevronRight size={16} className='text-gray-600 dark:text-gray-400' />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Room Details Modal */}
            {selectedRoom && (
                <div
                    className='fixed inset-0 z-50 flex items-center justify-center'
                    style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
                    onClick={() => setSelectedRoom(null)}
                >
                    <div
                        className='bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[80vh] overflow-y-auto'
                        onClick={(e) => e.stopPropagation()}
                    >
                        {detailsLoading ? (
                            <div className='flex items-center justify-center py-20'>
                                <Loader className='animate-spin text-purple-500' size={32} />
                            </div>
                        ) : (
                            <>
                                {/* Header */}
                                <div className='flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700/50'>
                                    <div>
                                        <h3 className='text-lg font-bold text-gray-900 dark:text-white'>
                                            {selectedRoom.room?.name}
                                        </h3>
                                        <div className='flex items-center gap-3 mt-1'>
                                            <span className='font-mono text-xs px-2 py-1 rounded bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400'>
                                                {selectedRoom.room?.roomCode}
                                            </span>
                                            <span className='text-xs text-gray-500'>
                                                Created {new Date(selectedRoom.room?.createdAt).toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setSelectedRoom(null)}
                                        className='p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer'
                                    >
                                        <X size={20} className='text-gray-400' />
                                    </button>
                                </div>

                                {/* Info Grid */}
                                <div className='p-6 space-y-4'>
                                    <div className='grid grid-cols-3 gap-4'>
                                        <div className='bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 text-center'>
                                            <Users size={20} className='text-purple-500 mx-auto mb-2' />
                                            <p className='text-lg font-bold text-gray-900 dark:text-white'>
                                                {selectedRoom.room?.members?.length || 0}
                                            </p>
                                            <p className='text-xs text-gray-500'>Members</p>
                                        </div>
                                        <div className='bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 text-center'>
                                            <Gamepad2 size={20} className='text-blue-500 mx-auto mb-2' />
                                            <p className='text-lg font-bold text-gray-900 dark:text-white'>
                                                {selectedRoom.quizzes?.length || 0}
                                            </p>
                                            <p className='text-xs text-gray-500'>Rounds Played</p>
                                        </div>
                                        <div className='bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 text-center'>
                                            <MessageSquare size={20} className='text-green-500 mx-auto mb-2' />
                                            <p className='text-lg font-bold text-gray-900 dark:text-white'>
                                                {selectedRoom.messageCount || 0}
                                            </p>
                                            <p className='text-xs text-gray-500'>Messages</p>
                                        </div>
                                    </div>

                                    {/* Members List */}
                                    <div>
                                        <h4 className='text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2'>Members</h4>
                                        <div className='space-y-2'>
                                            {selectedRoom.room?.members?.map((member) => (
                                                <div key={member.userId} className='flex items-center gap-3 px-3 py-2 bg-gray-50 dark:bg-gray-700/30 rounded-lg'>
                                                    <div className='w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold'>
                                                        {member.username?.charAt(0)?.toUpperCase()}
                                                    </div>
                                                    <span className='flex-1 text-sm text-gray-700 dark:text-gray-300'>
                                                        {member.username}
                                                    </span>
                                                    <span className={`text-xs ${member.role === 'host' ? 'text-amber-500' : 'text-gray-400'}`}>
                                                        {member.role}
                                                    </span>
                                                    <span className={`w-2 h-2 rounded-full ${member.isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Quiz History */}
                                    {selectedRoom.quizzes?.length > 0 && (
                                        <div>
                                            <h4 className='text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2'>Quiz History</h4>
                                            <div className='space-y-2'>
                                                {selectedRoom.quizzes.map((quiz) => (
                                                    <div key={quiz._id} className='flex items-center gap-3 px-3 py-2 bg-gray-50 dark:bg-gray-700/30 rounded-lg'>
                                                        <span className='text-xs font-mono text-purple-500'>
                                                            R{quiz.roundNumber}
                                                        </span>
                                                        <span className='flex-1 text-sm text-gray-700 dark:text-gray-300 truncate'>
                                                            {quiz.topic}
                                                        </span>
                                                        <span className='text-xs text-gray-500'>
                                                            {quiz.totalQuestions}Q • {quiz.difficulty}
                                                        </span>
                                                        {quiz.results?.[0] && (
                                                            <span className='text-xs text-amber-500 flex items-center gap-1'>
                                                                <Trophy size={12} />
                                                                {quiz.results[0].username}
                                                            </span>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
