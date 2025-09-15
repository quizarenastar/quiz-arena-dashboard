import { BrowserRouter as Router } from 'react-router-dom';
import RoutesComponent from './RoutesComponent';
import Header from './Components/Header';
import Footer from './Components/Footer';

const App = () => {
    return (
        <Router basename='/'>
            <Header />
            <RoutesComponent />
            <Footer />
        </Router>
    );
};

export default App;
