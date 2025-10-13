// Utility methods
export function formatAmount(amount) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
    }).format(amount);
}

//will be common later
export function getStatusColor(status) {
    const colors = {
        approved: 'green',
        pending: 'yellow',
        rejected: 'red',
        active: 'green',
        suspended: 'red',
        completed: 'green',
        failed: 'red',
    };
    return colors[status] || 'gray';
}

//will be common later
export function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}
