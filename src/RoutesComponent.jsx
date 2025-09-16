import { Routes, Route } from 'react-router-dom';
import Home from './Pages/Home';
import Login from './Pages/Login';
import SignUp from './Pages/SignUp';
import UserList from './Pages/UserList';
import DashboardUserList from './Pages/dashboardUserList';


const RoutesComponent = () => {
    return (
        <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/login' element={<Login />} />
            <Route path='/signup' element={<SignUp />} />
            <Route path='/userlist' element={<UserList />} />
            <Route path='/dashboarduserlist' element={<DashboardUserList />} />
        </Routes>
    );
};

export default RoutesComponent;
