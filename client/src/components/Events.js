import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

function Events() {
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    date: '',
    location: '',
    opponent: '',
    importance: '',
    notes: ''
  });

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const response = await axios.get(`${API_URL}/events`);
      setEvents(response.data);
    } catch (error) {
      console.error('Error loading events:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingEvent) {
        await axios.put(`${API_URL}/events/${editingEvent.id}`, formData);
      } else {
        await axios.post(`${API_URL}/events`, formData);
      }
      loadEvents();
      closeModal();
    } catch (error) {
      console.error('Error saving event:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Möchten Sie dieses Event wirklich löschen?')) {
      try {
        await axios.delete(`${API_URL}/events/${id}`);
        loadEvents();
      } catch (error) {
        console.error('Error deleting event:', error);
      }
    }
  };

  const openModal = (event = null) => {
    if (event) {
      setEditingEvent(event);
      setFormData({
        name: event.name,
        type: event.type,
        date: event.date,
        location: event.location || '',
        opponent: event.opponent || '',
        importance: event.importance || '',
        notes: event.notes || ''
      });
    } else {
      setEditingEvent(null);
      setFormData({
        name: '',
        type: '',
        date: '',
        location: '',
        opponent: '',
        importance: '',
        notes: ''
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingEvent(null);
  };

  const getImportanceBadge = (importance) => {
    const colorMap = {
      'Sehr Hoch': 'status-injured',
      'Hoch': 'status-injured',
      'Mittel': 'status-active',
      'Niedrig': 'status-inactive'
    };
    return <span className={`status-badge ${colorMap[importance] || 'status-inactive'}`}>{importance || '-'}</span>;
  };

  const groupEventsByMonth = () => {
    const grouped = {};
    events.forEach(event => {
      const date = new Date(event.date);
      const monthYear = date.toLocaleDateString('de-DE', { year: 'numeric', month: 'long' });
      if (!grouped[monthYear]) {
        grouped[monthYear] = [];
      }
      grouped[monthYear].push(event);
    });
    return grouped;
  };

  const groupedEvents = groupEventsByMonth();

  return (
    <div>
      <div className="section-header">
        <h2>Spiele & Turniere</h2>
        <button className="btn btn-primary" onClick={() => openModal()}>
          + Neues Event
        </button>
      </div>

      <p style={{ marginBottom: '1.5rem', color: '#666' }}>
        Verwalten Sie wichtige Termine wie Spiele, Turniere und andere Höhepunkte 
        der Saison. Diese Events helfen bei der Trainingsplanung.
      </p>

      {Object.keys(groupedEvents).length > 0 ? (
        Object.keys(groupedEvents).sort((a, b) => {
          const dateA = new Date(groupedEvents[a][0].date);
          const dateB = new Date(groupedEvents[b][0].date);
          return dateB - dateA;
        }).map(monthYear => (
          <div key={monthYear} style={{ marginBottom: '2rem' }}>
            <h3 style={{ color: '#1e3c72', marginBottom: '1rem' }}>{monthYear}</h3>
            <div className="card-grid">
              {groupedEvents[monthYear].sort((a, b) => new Date(b.date) - new Date(a.date)).map(event => (
                <div key={event.id} className="card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                    <h4 style={{ margin: 0, color: '#1e3c72' }}>{event.name}</h4>
                    {getImportanceBadge(event.importance)}
                  </div>
                  <p><strong>Typ:</strong> {event.type}</p>
                  <p><strong>Datum:</strong> {new Date(event.date).toLocaleDateString('de-DE', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</p>
                  {event.location && <p><strong>Ort:</strong> {event.location}</p>}
                  {event.opponent && <p><strong>Gegner:</strong> {event.opponent}</p>}
                  {event.notes && <p><strong>Notizen:</strong> {event.notes}</p>}
                  <div className="table-actions" style={{ marginTop: '1rem' }}>
                    <button className="btn btn-secondary" onClick={() => openModal(event)}>
                      Bearbeiten
                    </button>
                    <button className="btn btn-danger" onClick={() => handleDelete(event.id)}>
                      Löschen
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      ) : (
        <div className="card">
          <p>Keine Events vorhanden</p>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>{editingEvent ? 'Event bearbeiten' : 'Neues Event'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  placeholder="z.B. Heimspiel gegen FC Bayern"
                />
              </div>
              <div className="form-group">
                <label>Typ *</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  required
                >
                  <option value="">-- Typ wählen --</option>
                  <option value="Ligaspiel">Ligaspiel</option>
                  <option value="Pokalspiel">Pokalspiel</option>
                  <option value="Freundschaftsspiel">Freundschaftsspiel</option>
                  <option value="Turnier">Turnier</option>
                  <option value="Trainingslager">Trainingslager</option>
                  <option value="Sonstiges">Sonstiges</option>
                </select>
              </div>
              <div className="form-group">
                <label>Datum *</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Ort</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Spielort oder Veranstaltungsort"
                />
              </div>
              <div className="form-group">
                <label>Gegner</label>
                <input
                  type="text"
                  value={formData.opponent}
                  onChange={(e) => setFormData({ ...formData, opponent: e.target.value })}
                  placeholder="Nur bei Spielen relevant"
                />
              </div>
              <div className="form-group">
                <label>Wichtigkeit</label>
                <select
                  value={formData.importance}
                  onChange={(e) => setFormData({ ...formData, importance: e.target.value })}
                >
                  <option value="">-- Wichtigkeit wählen --</option>
                  <option value="Sehr Hoch">Sehr Hoch</option>
                  <option value="Hoch">Hoch</option>
                  <option value="Mittel">Mittel</option>
                  <option value="Niedrig">Niedrig</option>
                </select>
              </div>
              <div className="form-group">
                <label>Notizen</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Zusätzliche Informationen"
                />
              </div>
              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                  Abbrechen
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingEvent ? 'Aktualisieren' : 'Erstellen'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Events;
