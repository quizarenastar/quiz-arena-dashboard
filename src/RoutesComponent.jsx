import { Routes, Route } from 'react-router-dom';
import Home from './Pages/Home';
import Login from './Pages/Login';
import SignUp from './Pages/SignUp';
import UserList from './Pages/UserList';
import DashboardUserList from './Pages/DashboardUserList';
import Profile from './Pages/Profile';
import ContactList from './Pages/ContactList';
import NotFound from './Pages/NotFound';
import ProtectedRoute from './Components/ProtectedRoute';
import PublicRoute from './Components/PublicRoute';

const RoutesComponent = () => {
    return (
        <Routes>
            {/* Public routes */}
            <Route
                path='/login'
                element={
                    <PublicRoute>
                        <Login />
                    </PublicRoute>
                }
            />
            <Route
                path='/signup'
                element={
                    <PublicRoute>
                        <SignUp />
                    </PublicRoute>
                }
            />

            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
                <Route path='/' element={<Home />} />
                <Route path='/userlist' element={<UserList />} />
                <Route
                    path='/dashboarduserlist'
                    element={<DashboardUserList />}
                />
                <Route path='/profile' element={<Profile />} />
                <Route path='/contacts' element={<ContactList />} />
            </Route>
            <Route path='*' element={<NotFound />} />
        </Routes>
    );
};

export default RoutesComponent;
