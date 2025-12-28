import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

function Individualizations() {
  const [individualizations, setIndividualizations] = useState([]);
  const [players, setPlayers] = useState([]);
  const [microPlans, setMicroPlans] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingIndiv, setEditingIndiv] = useState(null);
  const [filterActive, setFilterActive] = useState('1');
  const [formData, setFormData] = useState({
    player_id: '',
    micro_plan_id: '',
    reason: '',
    modification: '',
    start_date: '',
    end_date: '',
    active: 1
  });

  useEffect(() => {
    loadPlayers();
    loadMicroPlans();
  }, []);

  useEffect(() => {
    loadIndividualizations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterActive]);

  const loadIndividualizations = async () => {
    try {
      const url = filterActive !== '' 
        ? `${API_URL}/individualizations?active=${filterActive}`
        : `${API_URL}/individualizations`;
      const response = await axios.get(url);
      setIndividualizations(response.data);
    } catch (error) {
      console.error('Error loading individualizations:', error);
    }
  };

  const loadPlayers = async () => {
    try {
      const response = await axios.get(`${API_URL}/players`);
      setPlayers(response.data);
    } catch (error) {
      console.error('Error loading players:', error);
    }
  };

  const loadMicroPlans = async () => {
    try {
      const response = await axios.get(`${API_URL}/micro-plans`);
      setMicroPlans(response.data);
    } catch (error) {
      console.error('Error loading micro plans:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingIndiv) {
        await axios.put(`${API_URL}/individualizations/${editingIndiv.id}`, formData);
      } else {
        await axios.post(`${API_URL}/individualizations`, formData);
      }
      loadIndividualizations();
      closeModal();
    } catch (error) {
      console.error('Error saving individualization:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Möchten Sie diese Individualisierung wirklich löschen?')) {
      try {
        await axios.delete(`${API_URL}/individualizations/${id}`);
        loadIndividualizations();
      } catch (error) {
        console.error('Error deleting individualization:', error);
      }
    }
  };

  const openModal = (indiv = null) => {
    if (indiv) {
      setEditingIndiv(indiv);
      setFormData({
        player_id: indiv.player_id,
        micro_plan_id: indiv.micro_plan_id || '',
        reason: indiv.reason || '',
        modification: indiv.modification || '',
        start_date: indiv.start_date,
        end_date: indiv.end_date || '',
        active: indiv.active
      });
    } else {
      setEditingIndiv(null);
      setFormData({
        player_id: '',
        micro_plan_id: '',
        reason: '',
        modification: '',
        start_date: '',
        end_date: '',
        active: 1
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingIndiv(null);
  };

  const getPlayerName = (playerId) => {
    const player = players.find(p => p.id === playerId);
    return player ? player.name : 'Unbekannt';
  };

  const getMicroPlanInfo = (microPlanId) => {
    const plan = microPlans.find(p => p.id === microPlanId);
    return plan ? `${new Date(plan.date).toLocaleDateString('de-DE')} - ${plan.session_type || 'Training'}` : '-';
  };

  return (
    <div>
      <div className="section-header">
        <h2>Spieler-Individualisierungen</h2>
        <button className="btn btn-primary" onClick={() => openModal()}>
          + Neue Individualisierung
        </button>
      </div>

      <p style={{ marginBottom: '1rem', color: '#666' }}>
        Hier können Sie individuelle Anpassungen für einzelne Spieler verwalten 
        (z.B. bei Verletzungen, Krankheit oder besonderen Trainingsanforderungen).
      </p>

      <div className="form-group" style={{ maxWidth: '300px', marginBottom: '1.5rem' }}>
        <label>Status filtern:</label>
        <select
          value={filterActive}
          onChange={(e) => setFilterActive(e.target.value)}
        >
          <option value="">Alle anzeigen</option>
          <option value="1">Nur aktive</option>
          <option value="0">Nur inaktive</option>
        </select>
      </div>

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Spieler</th>
              <th>Grund</th>
              <th>Anpassung</th>
              <th>Von</th>
              <th>Bis</th>
              <th>Mikroplan</th>
              <th>Status</th>
              <th>Aktionen</th>
            </tr>
          </thead>
          <tbody>
            {individualizations.map(indiv => (
              <tr key={indiv.id}>
                <td><strong>{indiv.player_name || getPlayerName(indiv.player_id)}</strong></td>
                <td>{indiv.reason || '-'}</td>
                <td>{indiv.modification || '-'}</td>
                <td>{new Date(indiv.start_date).toLocaleDateString('de-DE')}</td>
                <td>{indiv.end_date ? new Date(indiv.end_date).toLocaleDateString('de-DE') : 'Offen'}</td>
                <td>{getMicroPlanInfo(indiv.micro_plan_id)}</td>
                <td>
                  <span className={`status-badge ${indiv.active ? 'status-active' : 'status-inactive'}`}>
                    {indiv.active ? 'Aktiv' : 'Inaktiv'}
                  </span>
                </td>
                <td className="table-actions">
                  <button className="btn btn-secondary" onClick={() => openModal(indiv)}>
                    Bearbeiten
                  </button>
                  <button className="btn btn-danger" onClick={() => handleDelete(indiv.id)}>
                    Löschen
                  </button>
                </td>
              </tr>
            ))}
            {individualizations.length === 0 && (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center' }}>
                  Keine Individualisierungen vorhanden
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>{editingIndiv ? 'Individualisierung bearbeiten' : 'Neue Individualisierung'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Spieler *</label>
                <select
                  value={formData.player_id}
                  onChange={(e) => setFormData({ ...formData, player_id: e.target.value })}
                  required
                >
                  <option value="">-- Spieler wählen --</option>
                  {players.map(player => (
                    <option key={player.id} value={player.id}>{player.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Grund</label>
                <select
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                >
                  <option value="">-- Grund wählen --</option>
                  <option value="Verletzung">Verletzung</option>
                  <option value="Krankheit">Krankheit</option>
                  <option value="Aufbautraining">Aufbautraining</option>
                  <option value="Belastungssteuerung">Belastungssteuerung</option>
                  <option value="Sonderprogramm">Sonderprogramm</option>
                  <option value="Sonstiges">Sonstiges</option>
                </select>
              </div>
              <div className="form-group">
                <label>Anpassung *</label>
                <textarea
                  value={formData.modification}
                  onChange={(e) => setFormData({ ...formData, modification: e.target.value })}
                  required
                  placeholder="Beschreiben Sie die notwendigen Anpassungen..."
                />
              </div>
              <div className="form-group">
                <label>Zugehöriger Mikroplan (optional)</label>
                <select
                  value={formData.micro_plan_id}
                  onChange={(e) => setFormData({ ...formData, micro_plan_id: e.target.value })}
                >
                  <option value="">-- Mikroplan wählen --</option>
                  {microPlans.map(plan => (
                    <option key={plan.id} value={plan.id}>
                      {new Date(plan.date).toLocaleDateString('de-DE')} - {plan.session_type || 'Training'}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Startdatum *</label>
                <input
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Enddatum (optional)</label>
                <input
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Status</label>
                <select
                  value={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: parseInt(e.target.value) })}
                >
                  <option value="1">Aktiv</option>
                  <option value="0">Inaktiv</option>
                </select>
              </div>
              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                  Abbrechen
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingIndiv ? 'Aktualisieren' : 'Erstellen'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Individualizations;
