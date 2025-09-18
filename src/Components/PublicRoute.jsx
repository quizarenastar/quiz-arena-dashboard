import { Navigate } from 'react-router-dom';
import { hasAuthToken } from '../utils/authToken';

const PublicRoute = ({ children }) => {
    if (hasAuthToken()) {
        return <Navigate to="/" replace />;
    }
    return children;
};

export default PublicRoute;


