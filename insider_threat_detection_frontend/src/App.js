import './App.css';
import StatCard from './Components/StatCard';
import TopThreatTypes from './Components/TopThreatTypes';
import Threats from './Components/Threats';
import Threat from './Components/Threat';
import Header from './Components/Header';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


function App() {
  return (
    <div className="App">
      <Router>
        <div className='header'>
          <Header />
        </div>
        <div className='statcard-topthreats'>
            <StatCard />
            <TopThreatTypes />
        </div>
        <div>
          <Routes>
          <Route path="" element={<Threats />} />
            <Route path="/threat/:id" element={<Threat />} />
          </Routes>
          {/* <Threats /> */}
        </div>
      </Router>
    </div>
  );
}

export default App;
