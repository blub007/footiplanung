import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

function Dashboard() {
  const [stats, setStats] = useState({
    players: 0,
    mesoPlans: 0,
    microPlans: 0,
    upcomingEvents: 0,
    activeIndividualizations: 0
  });
  const [upcomingEvents, setUpcomingEvents] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [playersRes, mesoRes, microRes, eventsRes, individualizationsRes] = await Promise.all([
        axios.get(`${API_URL}/players`),
        axios.get(`${API_URL}/meso-plans`),
        axios.get(`${API_URL}/micro-plans`),
        axios.get(`${API_URL}/events`),
        axios.get(`${API_URL}/individualizations?active=1`)
      ]);

      // Get upcoming events (next 30 days)
      const today = new Date();
      const upcoming = eventsRes.data.filter(event => {
        const eventDate = new Date(event.date);
        const diffDays = Math.ceil((eventDate - today) / (1000 * 60 * 60 * 24));
        return diffDays >= 0 && diffDays <= 30;
      }).sort((a, b) => new Date(a.date) - new Date(b.date));

      setStats({
        players: playersRes.data.length,
        mesoPlans: mesoRes.data.length,
        microPlans: microRes.data.length,
        upcomingEvents: upcoming.length,
        activeIndividualizations: individualizationsRes.data.length
      });

      setUpcomingEvents(upcoming.slice(0, 5));
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  return (
    <div>
      <div className="section-header">
        <h2>Dashboard</h2>
      </div>

      <div className="dashboard-grid">
        <div className="stat-card" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
          <h3>Spieler</h3>
          <p className="stat-value">{stats.players}</p>
        </div>
        <div className="stat-card" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
          <h3>Mesopläne</h3>
          <p className="stat-value">{stats.mesoPlans}</p>
        </div>
        <div className="stat-card" style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
          <h3>Mikropläne</h3>
          <p className="stat-value">{stats.microPlans}</p>
        </div>
        <div className="stat-card" style={{ background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' }}>
          <h3>Kommende Events</h3>
          <p className="stat-value">{stats.upcomingEvents}</p>
        </div>
        <div className="stat-card" style={{ background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' }}>
          <h3>Aktive Individualisierungen</h3>
          <p className="stat-value">{stats.activeIndividualizations}</p>
        </div>
      </div>

      <div style={{ marginTop: '2rem' }}>
        <h3>Kommende Spiele & Turniere</h3>
        {upcomingEvents.length > 0 ? (
          <div className="card">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Typ</th>
                  <th>Datum</th>
                  <th>Gegner</th>
                  <th>Wichtigkeit</th>
                </tr>
              </thead>
              <tbody>
                {upcomingEvents.map(event => (
                  <tr key={event.id}>
                    <td>{event.name}</td>
                    <td>{event.type}</td>
                    <td>{new Date(event.date).toLocaleDateString('de-DE')}</td>
                    <td>{event.opponent || '-'}</td>
                    <td>{event.importance || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="card">
            <p>Keine kommenden Events in den nächsten 30 Tagen</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
