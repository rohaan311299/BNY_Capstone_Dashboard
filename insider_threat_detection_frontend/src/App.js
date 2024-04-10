import './App.css';
import StatCard from './Components/StatCard';
import TopThreatTypes from './Components/TopThreatTypes';
import Threats from './Components/Threats';
import Header from './Components/Header';

function App() {
  return (
    <div className="App">
      <div className='header'>
        <Header />
      </div>
      <div className='statcard-topthreats'>
          <StatCard />
          <TopThreatTypes />
      </div>
      <div>
        <Threats />
      </div>
    </div>
  );
}

export default App;
