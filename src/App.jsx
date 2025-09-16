import { BrowserRouter as Router } from 'react-router-dom';
import RoutesComponent from './RoutesComponent';
import Header from './Components/Header';
import Footer from './Components/Footer';
import { Toaster } from 'react-hot-toast';

const App = () => {
    return (
        <Router basename='/'>
            <Header />
            <RoutesComponent />
            <Footer />
            <Toaster position="top-right" />
        </Router>
    );
};

export default App;
