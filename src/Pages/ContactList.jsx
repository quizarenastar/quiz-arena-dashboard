import React, { useState, useEffect } from 'react';
import ContactService from '../service/ContactService';
import toast from 'react-hot-toast';
import {
    MessageSquare,
    Loader,
    CheckCircle,
    XCircle,
    Clock,
    Grid as GridIcon,
    List as ListIcon,
    Bug,
    Lightbulb,
    MessageCircle,
    HelpCircle,
    ExternalLink,
    Phone,
} from 'lucide-react';

const ContactList = () => {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState('table');

    const toggleViewMode = () => {
        setViewMode(viewMode === 'table' ? 'grid' : 'table');
    };

    useEffect(() => {
        fetchContacts();
    }, []);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(min-width: 768px)');
        const handleResize = (e) => {
            setViewMode(e.matches ? 'table' : 'grid');
        };

        // Set initial view mode
        handleResize(mediaQuery);

        // Add listener for window resize
        mediaQuery.addEventListener('change', handleResize);

        // Cleanup
        return () => mediaQuery.removeEventListener('change', handleResize);
    }, []);

    const fetchContacts = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await ContactService.getContactList();
            if (response.success) {
                setContacts(response.data);
            } else {
                setError(response.message);
                toast.error(
                    response.message || 'Failed to load contact requests',
                );
            }
        } catch (err) {
            console.error(err);
            toast.error('Failed to fetch contact requests');
            setError('Failed to fetch contact requests');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (contactId, newStatus) => {
        try {
            const response = await ContactService.updateContactStatus(
                contactId,
                newStatus,
            );
            if (response.success) {
                setContacts(
                    contacts.map((contact) =>
                        contact._id === contactId
                            ? { ...contact, status: newStatus }
                            : contact,
                    ),
                );
                toast.success('Status updated successfully');
            } else {
                toast.error(response.message || 'Failed to update status');
            }
        } catch (err) {
            console.error(err);
            toast.error('Failed to update status');
        }
    };

    const getStatusBadgeColor = (status) => {
        switch (status) {
            case 'pending':
                return 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white';
            case 'in-progress':
                return 'bg-gradient-to-r from-blue-400 to-cyan-500 text-white';
            case 'resolved':
                return 'bg-gradient-to-r from-green-400 to-emerald-500 text-white';
            default:
                return 'bg-gradient-to-r from-gray-400 to-gray-500 text-white';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending':
                return <Clock className='w-4 h-4' />;
            case 'in-progress':
                return <Loader className='w-4 h-4 animate-spin' />;
            case 'resolved':
                return <CheckCircle className='w-4 h-4' />;
            default:
                return <XCircle className='w-4 h-4' />;
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getCategoryConfig = (category) => {
        switch (category) {
            case 'bug':
                return {
                    label: 'Bug',
                    icon: Bug,
                    color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
                };
            case 'feature':
                return {
                    label: 'Feature',
                    icon: Lightbulb,
                    color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
                };
            case 'feedback':
                return {
                    label: 'Feedback',
                    icon: MessageCircle,
                    color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
                };
            default:
                return {
                    label: 'Other',
                    icon: HelpCircle,
                    color: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
                };
        }
    };

    const filteredContacts = contacts.filter(
        (contact) =>
            contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            contact.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (contact.category || '')
                .toLowerCase()
                .includes(searchTerm.toLowerCase()),
    );

    const renderGrid = (contacts) => (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
            {contacts.map((contact, index) => (
                <div
                    key={contact._id}
                    className='bg-white/80 backdrop-blur-sm dark:bg-gray-800/80 rounded-xl border border-gray-200/50 dark:border-gray-700/50 shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden'
                >
                    <div className='p-6'>
                        <div className='flex items-center space-x-4 mb-4'>
                            <div
                                className={`h-16 w-16 rounded-xl shadow-sm flex items-center justify-center text-white font-semibold text-2xl bg-gradient-to-br ${
                                    index % 4 === 0
                                        ? 'from-blue-500 to-cyan-500'
                                        : index % 4 === 1
                                          ? 'from-purple-500 to-pink-500'
                                          : index % 4 === 2
                                            ? 'from-green-500 to-emerald-500'
                                            : 'from-orange-500 to-red-500'
                                }`}
                            >
                                {contact.name.charAt(0).toUpperCase()}
                            </div>
                            <div className='flex-1 min-w-0'>
                                <h3 className='text-lg font-semibold text-gray-900 dark:text-white truncate'>
                                    {contact.name}
                                </h3>
                                <p className='text-sm text-gray-500 dark:text-gray-400 truncate'>
                                    {contact.email}
                                </p>
                            </div>
                        </div>

                        <div className='space-y-3 mb-4'>
                            <div>
                                <div className='text-sm font-medium text-gray-900 dark:text-white'>
                                    Subject: {contact.subject}
                                </div>
                            </div>
                            <div>
                                <div className='text-sm text-gray-500 dark:text-gray-400 line-clamp-2'>
                                    {contact.message}
                                </div>
                            </div>
                            {contact.category &&
                                (() => {
                                    const catCfg = getCategoryConfig(
                                        contact.category,
                                    );
                                    const CatIcon = catCfg.icon;
                                    return (
                                        <span
                                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${catCfg.color}`}
                                        >
                                            <CatIcon className='w-3 h-3' />
                                            {catCfg.label}
                                        </span>
                                    );
                                })()}
                            {contact.pageUrl && (
                                <a
                                    href={contact.pageUrl}
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    className='inline-flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:underline'
                                >
                                    <ExternalLink className='w-3 h-3' />
                                    Page URL
                                </a>
                            )}
                            {contact.contactNumber && (
                                <div className='inline-flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 ml-2'>
                                    <Phone className='w-3 h-3' />
                                    {contact.contactNumber}
                                </div>
                            )}
                        </div>

                        <div className='mt-4 pt-4 border-t border-gray-200 dark:border-gray-700'>
                            <div className='grid grid-cols-2 gap-4 text-sm'>
                                <div>
                                    <p className='text-gray-500 dark:text-gray-400'>
                                        Created
                                    </p>
                                    <p className='text-gray-900 dark:text-white'>
                                        {formatDate(contact.createdAt)}
                                    </p>
                                </div>
                                <div>
                                    <p className='text-gray-500 dark:text-gray-400'>
                                        Updated
                                    </p>
                                    <p className='text-gray-900 dark:text-white'>
                                        {formatDate(contact.updatedAt)}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className='mt-4 flex items-center justify-between'>
                            <span
                                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium shadow-sm ${getStatusBadgeColor(
                                    contact.status,
                                )}`}
                            >
                                <span className='w-2 h-2 mr-1 rounded-full bg-white/80'></span>
                                {getStatusIcon(contact.status)}
                                {contact.status.charAt(0).toUpperCase() +
                                    contact.status.slice(1)}
                            </span>
                            <select
                                className='rounded-xl border-0 bg-white/80 dark:bg-gray-700/80 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500/50 shadow-lg backdrop-blur-sm px-3 py-1.5 transition-all duration-200'
                                value={contact.status}
                                onChange={(e) =>
                                    handleStatusUpdate(
                                        contact._id,
                                        e.target.value,
                                    )
                                }
                            >
                                <option value='pending'>Pending</option>
                                <option value='in-progress'>In Progress</option>
                                <option value='resolved'>Resolved</option>
                            </select>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );

    const renderTable = (contacts) => (
        <div className='bg-white/80 backdrop-blur-sm dark:bg-gray-800/80 shadow-2xl rounded-3xl border border-white/20 dark:border-gray-700/50 overflow-hidden'>
            <div className='bg-gradient-to-r from-indigo-500/5 to-purple-500/5 px-6 py-4 border-b border-gray-200/50 dark:border-gray-700/50'>
                <h2 className='text-lg font-semibold text-gray-800 dark:text-white'>
                    Contact Requests Overview
                </h2>
            </div>
            <div className='overflow-x-auto'>
                <table className='min-w-full divide-y divide-gray-200/50 dark:divide-gray-700/50'>
                    <thead className='bg-gradient-to-r from-gray-50/50 to-indigo-50/50 dark:from-gray-700/50 dark:to-gray-600/50'>
                        <tr>
                            <th className='px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider'>
                                Contact Info
                            </th>
                            <th className='px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider'>
                                Category
                            </th>
                            <th className='px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider'>
                                Subject
                            </th>
                            <th className='px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider'>
                                Message
                            </th>
                            <th className='px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider'>
                                Created / Updated
                            </th>
                            <th className='px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider'>
                                Status
                            </th>
                            <th className='px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider'>
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className='bg-white/50 dark:bg-gray-800/50 divide-y divide-gray-200/30 dark:divide-gray-700/30'>
                        {contacts.map((contact, index) => (
                            <tr
                                key={contact._id}
                                className='hover:bg-gradient-to-r hover:from-indigo-50/50 hover:to-purple-50/50 dark:hover:from-gray-700/50 dark:hover:to-gray-600/50 transition-all duration-200 group'
                            >
                                <td className='px-6 py-6 whitespace-nowrap'>
                                    <div className='flex items-center'>
                                        <div
                                            className={`h-12 w-12 rounded-xl shadow-lg flex items-center justify-center text-white font-semibold text-lg bg-gradient-to-br ${
                                                index % 4 === 0
                                                    ? 'from-blue-500 to-cyan-500'
                                                    : index % 4 === 1
                                                      ? 'from-purple-500 to-pink-500'
                                                      : index % 4 === 2
                                                        ? 'from-green-500 to-emerald-500'
                                                        : 'from-orange-500 to-red-500'
                                            } group-hover:scale-110 transition-transform duration-200`}
                                        >
                                            {contact.name
                                                .charAt(0)
                                                .toUpperCase()}
                                        </div>
                                        <div className='ml-4'>
                                            <div className='text-sm font-semibold text-gray-900 dark:text-white'>
                                                {contact.name}
                                            </div>
                                            <div className='text-sm text-gray-600 dark:text-gray-400'>
                                                {contact.email}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className='px-6 py-6 whitespace-nowrap'>
                                    {(() => {
                                        const catCfg = getCategoryConfig(
                                            contact.category,
                                        );
                                        const CatIcon = catCfg.icon;
                                        return (
                                            <span
                                                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${catCfg.color}`}
                                            >
                                                <CatIcon className='w-3.5 h-3.5' />
                                                {catCfg.label}
                                            </span>
                                        );
                                    })()}
                                </td>
                                <td className='px-6 py-6'>
                                    <div className='text-sm text-gray-900 dark:text-white'>
                                        {contact.subject}
                                    </div>
                                </td>
                                <td className='px-6 py-6'>
                                    <div className='text-sm text-gray-500 dark:text-gray-400 max-w-xs'>
                                        {contact.message}
                                    </div>
                                    {(contact.pageUrl ||
                                        contact.contactNumber) && (
                                        <div className='flex items-center gap-3 mt-1.5'>
                                            {contact.pageUrl && (
                                                <a
                                                    href={contact.pageUrl}
                                                    target='_blank'
                                                    rel='noopener noreferrer'
                                                    className='inline-flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:underline'
                                                >
                                                    <ExternalLink className='w-3 h-3' />
                                                    Page
                                                </a>
                                            )}
                                            {contact.contactNumber && (
                                                <span className='inline-flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400'>
                                                    <Phone className='w-3 h-3' />
                                                    {contact.contactNumber}
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </td>
                                <td className='px-6 py-6 whitespace-nowrap'>
                                    <div className='text-xs text-gray-500 dark:text-gray-400'>
                                        {formatDate(contact.createdAt)}
                                    </div>
                                    <div className='text-xs text-gray-500 dark:text-gray-400'>
                                        {formatDate(contact.updatedAt)}
                                    </div>
                                </td>
                                <td className='px-6 py-6 whitespace-nowrap'>
                                    <span
                                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium shadow-sm ${getStatusBadgeColor(
                                            contact.status,
                                        )} group-hover:scale-105 transition-transform duration-200`}
                                    >
                                        <span className='w-2 h-2 mr-1 rounded-full bg-white/80'></span>
                                        {getStatusIcon(contact.status)}
                                        {contact.status
                                            .charAt(0)
                                            .toUpperCase() +
                                            contact.status.slice(1)}
                                    </span>
                                </td>
                                <td className='px-6 py-6 whitespace-nowrap text-sm font-medium'>
                                    <select
                                        className='rounded-xl border-0 bg-white/80 dark:bg-gray-700/80 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500/50 shadow-lg backdrop-blur-sm px-3 py-2 transition-all duration-200 hover:shadow-xl'
                                        value={contact.status}
                                        onChange={(e) =>
                                            handleStatusUpdate(
                                                contact._id,
                                                e.target.value,
                                            )
                                        }
                                    >
                                        <option value='pending'>Pending</option>
                                        <option value='in-progress'>
                                            In Progress
                                        </option>
                                        <option value='resolved'>
                                            Resolved
                                        </option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    return (
        <div className='min-h-screen'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
                {/* Header */}
                <div className='mb-6'>
                    <h1 className='text-3xl font-bold text-gray-900 dark:text-white mb-2'>
                        Contacts Management
                    </h1>
                    <p className='text-gray-600 dark:text-gray-400'>
                        Manage user inquiries and support requests
                    </p>
                </div>

                {/* Search and View Toggle */}
                <div className='mb-8 flex justify-between items-center gap-4'>
                    <div className='flex-1'>
                        <div className='relative max-w-md w-full bg-blue-100 border-gray-200 dark:bg-gray-900 dark:border-gray-700 rounded-2xl shadow-lg'>
                            <div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none'>
                                <svg
                                    className='h-5 w-5'
                                    fill='none'
                                    viewBox='0 0 24 24'
                                    stroke='currentColor'
                                >
                                    <path
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                        strokeWidth={2}
                                        d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
                                    />
                                </svg>
                            </div>
                            <input
                                type='text'
                                placeholder='Search by name, email, or subject...'
                                className='block w-full pl-12 pr-4 py-4 border shadow-md transition-colors duration-200 rounded-2xl'
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                    <button
                        onClick={toggleViewMode}
                        className='flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-gray-800/80 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 text-gray-700 dark:text-gray-200'
                    >
                        {viewMode === 'table' ? (
                            <>
                                <GridIcon className='w-5 h-5' />
                                <span>Grid View</span>
                            </>
                        ) : (
                            <>
                                <ListIcon className='w-5 h-5' />
                                <span>Table View</span>
                            </>
                        )}
                    </button>
                </div>

                {loading ? (
                    <div className='flex justify-center items-center h-64'>
                        <div className='animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-indigo-500'></div>
                    </div>
                ) : error ? (
                    <div className='bg-red-50/80 backdrop-blur-sm border border-red-200/50 text-red-700 px-6 py-4 rounded-2xl dark:bg-red-900/20 dark:border-red-800/50 dark:text-red-400 shadow-lg'>
                        {error}
                    </div>
                ) : (
                    <>
                        {viewMode === 'grid'
                            ? renderGrid(filteredContacts)
                            : renderTable(filteredContacts)}

                        {filteredContacts.length === 0 && (
                            <div className='text-center py-16'>
                                <div className='inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-full mb-6'>
                                    <MessageSquare className='w-10 h-10 text-gray-400 dark:text-gray-500' />
                                </div>
                                <h3 className='text-xl font-semibold text-gray-900 dark:text-white mb-2'>
                                    No contact requests found
                                </h3>
                                <p className='text-gray-600 dark:text-gray-400 max-w-md mx-auto'>
                                    We couldn't find any contact requests
                                    matching your search criteria. Try adjusting
                                    your search terms.
                                </p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default ContactList;
