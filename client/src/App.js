import React, { useState } from 'react';
import './App.css';
import Dashboard from './components/Dashboard';
import Players from './components/Players';
import MesoPlans from './components/MesoPlans';
import MicroPlans from './components/MicroPlans';
import Individualizations from './components/Individualizations';
import Events from './components/Events';
import Calendar from './components/Calendar';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch(activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'players':
        return <Players />;
      case 'meso':
        return <MesoPlans />;
      case 'micro':
        return <MicroPlans />;
      case 'individualizations':
        return <Individualizations />;
      case 'events':
        return <Events />;
      case 'calendar':
        return <Calendar />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>⚽ Fußball Trainingsplanung</h1>
        <nav className="navigation">
          <button 
            className={activeTab === 'dashboard' ? 'active' : ''} 
            onClick={() => setActiveTab('dashboard')}
          >
            Dashboard
          </button>
          <button 
            className={activeTab === 'players' ? 'active' : ''} 
            onClick={() => setActiveTab('players')}
          >
            Spieler
          </button>
          <button 
            className={activeTab === 'meso' ? 'active' : ''} 
            onClick={() => setActiveTab('meso')}
          >
            Mesoplanung
          </button>
          <button 
            className={activeTab === 'micro' ? 'active' : ''} 
            onClick={() => setActiveTab('micro')}
          >
            Mikroplanung
          </button>
          <button 
            className={activeTab === 'calendar' ? 'active' : ''} 
            onClick={() => setActiveTab('calendar')}
          >
            📅 Kalender
          </button>
          <button 
            className={activeTab === 'individualizations' ? 'active' : ''} 
            onClick={() => setActiveTab('individualizations')}
          >
            Individualisierung
          </button>
          <button 
            className={activeTab === 'events' ? 'active' : ''} 
            onClick={() => setActiveTab('events')}
          >
            Spiele & Turniere
          </button>
        </nav>
      </header>
      <main className="main-content">
        {renderContent()}
      </main>
    </div>
  );
}

export default App;
