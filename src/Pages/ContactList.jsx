import React, { useState, useEffect } from 'react';
import ContactService from '../service/ContactService';
import toast from 'react-hot-toast';
import {
    MessageSquare,
    Loader,
    CheckCircle,
    XCircle,
    Clock,
} from 'lucide-react';

const ContactList = () => {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchContacts();
    }, []);

    const fetchContacts = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await ContactService.getContactList();
            if (response.success) {
                setContacts(response.data);
                toast.success('Contact requests loaded successfully');
            } else {
                setError(response.message);
                toast.error(
                    response.message || 'Failed to load contact requests'
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
                newStatus
            );
            if (response.success) {
                setContacts(
                    contacts.map((contact) =>
                        contact._id === contactId
                            ? { ...contact, status: newStatus }
                            : contact
                    )
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
                return 'bg-yellow-100 text-yellow-800';
            case 'in-progress':
                return 'bg-blue-100 text-blue-800';
            case 'resolved':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
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

    const filteredContacts = contacts.filter(
        (contact) =>
            contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            contact.subject.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div className='container mx-auto px-4 py-8'>
            <div className='mb-6'>
                <div className='flex items-center justify-between mb-4'>
                    <h1 className='text-2xl font-bold dark:text-white flex items-center gap-2'>
                        <MessageSquare className='w-6 h-6' />
                        Contact Requests
                    </h1>
                </div>
                <div className='relative'>
                    <input
                        type='text'
                        placeholder='Search by name, email, or subject...'
                        className='w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white'
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {loading ? (
                <div className='flex justify-center items-center h-64'>
                    <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500'></div>
                </div>
            ) : error ? (
                <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative'>
                    {error}
                </div>
            ) : (
                <div className='bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden'>
                    <div className='overflow-x-auto'>
                        <table className='min-w-full divide-y divide-gray-200 dark:divide-gray-700'>
                            <thead className='bg-gray-50 dark:bg-gray-700'>
                                <tr>
                                    <th
                                        scope='col'
                                        className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'
                                    >
                                        Contact Info
                                    </th>
                                    <th
                                        scope='col'
                                        className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'
                                    >
                                        Subject
                                    </th>
                                    <th
                                        scope='col'
                                        className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'
                                    >
                                        Message
                                    </th>
                                    <th
                                        scope='col'
                                        className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'
                                    >
                                        Date
                                    </th>
                                    <th
                                        scope='col'
                                        className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'
                                    >
                                        Status
                                    </th>
                                    <th
                                        scope='col'
                                        className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'
                                    >
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className='bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700'>
                                {filteredContacts.map((contact) => (
                                    <tr
                                        key={contact._id}
                                        className='hover:bg-gray-50 dark:hover:bg-gray-700'
                                    >
                                        <td className='px-6 py-4 whitespace-nowrap'>
                                            <div className='flex items-center'>
                                                <div className='flex-shrink-0 h-10 w-10 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center'>
                                                    <span className='text-lg font-medium text-gray-600 dark:text-gray-300'>
                                                        {contact.name
                                                            .charAt(0)
                                                            .toUpperCase()}
                                                    </span>
                                                </div>
                                                <div className='ml-4'>
                                                    <div className='text-sm font-medium text-gray-900 dark:text-white'>
                                                        {contact.name}
                                                    </div>
                                                    <div className='text-sm text-gray-500 dark:text-gray-400'>
                                                        {contact.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className='px-6 py-4'>
                                            <div className='text-sm text-gray-900 dark:text-white'>
                                                {contact.subject}
                                            </div>
                                        </td>
                                        <td className='px-6 py-4'>
                                            <div className='text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate'>
                                                {contact.message}
                                            </div>
                                        </td>
                                        <td className='px-6 py-4 whitespace-nowrap'>
                                            <div className='text-sm text-gray-500 dark:text-gray-400'>
                                                {formatDate(contact.createdAt)}
                                            </div>
                                        </td>
                                        <td className='px-6 py-4 whitespace-nowrap'>
                                            <span
                                                className={`px-2 inline-flex items-center gap-1 text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(
                                                    contact.status
                                                )}`}
                                            >
                                                {getStatusIcon(contact.status)}
                                                {contact.status
                                                    .charAt(0)
                                                    .toUpperCase() +
                                                    contact.status.slice(1)}
                                            </span>
                                        </td>
                                        <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                                            <select
                                                className='rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-sm focus:ring-blue-500 focus:border-blue-500'
                                                value={contact.status}
                                                onChange={(e) =>
                                                    handleStatusUpdate(
                                                        contact._id,
                                                        e.target.value
                                                    )
                                                }
                                            >
                                                <option value='pending'>
                                                    Pending
                                                </option>
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
            )}
        </div>
    );
};

export default ContactList;
