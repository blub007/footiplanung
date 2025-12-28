import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

function Players() {
  const [players, setPlayers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    status: 'active',
    notes: ''
  });

  useEffect(() => {
    loadPlayers();
  }, []);

  const loadPlayers = async () => {
    try {
      const response = await axios.get(`${API_URL}/players`);
      setPlayers(response.data);
    } catch (error) {
      console.error('Error loading players:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingPlayer) {
        await axios.put(`${API_URL}/players/${editingPlayer.id}`, formData);
      } else {
        await axios.post(`${API_URL}/players`, formData);
      }
      loadPlayers();
      closeModal();
    } catch (error) {
      console.error('Error saving player:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Möchten Sie diesen Spieler wirklich löschen?')) {
      try {
        await axios.delete(`${API_URL}/players/${id}`);
        loadPlayers();
      } catch (error) {
        console.error('Error deleting player:', error);
      }
    }
  };

  const openModal = (player = null) => {
    if (player) {
      setEditingPlayer(player);
      setFormData({
        name: player.name,
        position: player.position || '',
        status: player.status,
        notes: player.notes || ''
      });
    } else {
      setEditingPlayer(null);
      setFormData({
        name: '',
        position: '',
        status: 'active',
        notes: ''
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingPlayer(null);
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      active: { class: 'status-active', text: 'Aktiv' },
      injured: { class: 'status-injured', text: 'Verletzt' },
      inactive: { class: 'status-inactive', text: 'Inaktiv' }
    };
    const statusInfo = statusMap[status] || statusMap.active;
    return <span className={`status-badge ${statusInfo.class}`}>{statusInfo.text}</span>;
  };

  return (
    <div>
      <div className="section-header">
        <h2>Spielerverwaltung</h2>
        <button className="btn btn-primary" onClick={() => openModal()}>
          + Neuer Spieler
        </button>
      </div>

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Position</th>
              <th>Status</th>
              <th>Notizen</th>
              <th>Aktionen</th>
            </tr>
          </thead>
          <tbody>
            {players.map(player => (
              <tr key={player.id}>
                <td><strong>{player.name}</strong></td>
                <td>{player.position || '-'}</td>
                <td>{getStatusBadge(player.status)}</td>
                <td>{player.notes || '-'}</td>
                <td className="table-actions">
                  <button className="btn btn-secondary" onClick={() => openModal(player)}>
                    Bearbeiten
                  </button>
                  <button className="btn btn-danger" onClick={() => handleDelete(player.id)}>
                    Löschen
                  </button>
                </td>
              </tr>
            ))}
            {players.length === 0 && (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center' }}>
                  Keine Spieler vorhanden
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>{editingPlayer ? 'Spieler bearbeiten' : 'Neuer Spieler'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Position</label>
                <select
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                >
                  <option value="">-- Position wählen --</option>
                  <option value="Torwart">Torwart</option>
                  <option value="Abwehr">Abwehr</option>
                  <option value="Mittelfeld">Mittelfeld</option>
                  <option value="Sturm">Sturm</option>
                </select>
              </div>
              <div className="form-group">
                <label>Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="active">Aktiv</option>
                  <option value="injured">Verletzt</option>
                  <option value="inactive">Inaktiv</option>
                </select>
              </div>
              <div className="form-group">
                <label>Notizen</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>
              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                  Abbrechen
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingPlayer ? 'Aktualisieren' : 'Erstellen'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Players;
