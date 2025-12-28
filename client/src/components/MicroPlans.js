import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../config';

function MicroPlans() {
  const [microPlans, setMicroPlans] = useState([]);
  const [mesoPlans, setMesoPlans] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [selectedMesoPlan, setSelectedMesoPlan] = useState('');
  const [formData, setFormData] = useState({
    meso_plan_id: '',
    date: '',
    session_type: '',
    focus: '',
    duration: '',
    intensity: '',
    description: ''
  });

  useEffect(() => {
    loadMicroPlans();
    loadMesoPlans();
  }, []);

  useEffect(() => {
    if (selectedMesoPlan) {
      loadMicroPlans(selectedMesoPlan);
    } else {
      loadMicroPlans();
    }
  }, [selectedMesoPlan]);

  const loadMicroPlans = async (mesoPlanId = null) => {
    try {
      const url = mesoPlanId 
        ? `${API_URL}/micro-plans?meso_plan_id=${mesoPlanId}`
        : `${API_URL}/micro-plans`;
      const response = await axios.get(url);
      setMicroPlans(response.data);
    } catch (error) {
      console.error('Error loading micro plans:', error);
    }
  };

  const loadMesoPlans = async () => {
    try {
      const response = await axios.get(`${API_URL}/meso-plans`);
      setMesoPlans(response.data);
    } catch (error) {
      console.error('Error loading meso plans:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingPlan) {
        await axios.put(`${API_URL}/micro-plans/${editingPlan.id}`, formData);
      } else {
        await axios.post(`${API_URL}/micro-plans`, formData);
      }
      loadMicroPlans(selectedMesoPlan);
      closeModal();
    } catch (error) {
      console.error('Error saving micro plan:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Möchten Sie diesen Mikroplan wirklich löschen?')) {
      try {
        await axios.delete(`${API_URL}/micro-plans/${id}`);
        loadMicroPlans(selectedMesoPlan);
      } catch (error) {
        console.error('Error deleting micro plan:', error);
      }
    }
  };

  const openModal = (plan = null) => {
    if (plan) {
      setEditingPlan(plan);
      setFormData({
        meso_plan_id: plan.meso_plan_id || '',
        date: plan.date,
        session_type: plan.session_type || '',
        focus: plan.focus || '',
        duration: plan.duration || '',
        intensity: plan.intensity || '',
        description: plan.description || ''
      });
    } else {
      setEditingPlan(null);
      setFormData({
        meso_plan_id: selectedMesoPlan || '',
        date: '',
        session_type: '',
        focus: '',
        duration: '',
        intensity: '',
        description: ''
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingPlan(null);
  };

  const getMesoPlanName = (mesoPlanId) => {
    const plan = mesoPlans.find(p => p.id === mesoPlanId);
    return plan ? plan.name : '-';
  };

  return (
    <div>
      <div className="section-header">
        <h2>Mikroplanung (Kurzfristige Planung)</h2>
        <button className="btn btn-primary" onClick={() => openModal()}>
          + Neuer Mikroplan
        </button>
      </div>

      <p style={{ marginBottom: '1rem', color: '#666' }}>
        Mikropläne sind detaillierte Trainingssessions (typischerweise einzelne Trainingstage).
        Sie konkretisieren die Mesopläne auf Tagesebene.
      </p>

      <div className="form-group" style={{ maxWidth: '400px', marginBottom: '1.5rem' }}>
        <label>Nach Mesoplan filtern:</label>
        <select
          value={selectedMesoPlan}
          onChange={(e) => setSelectedMesoPlan(e.target.value)}
        >
          <option value="">Alle Mikropläne anzeigen</option>
          {mesoPlans.map(plan => (
            <option key={plan.id} value={plan.id}>{plan.name}</option>
          ))}
        </select>
      </div>

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Datum</th>
              <th>Mesoplan</th>
              <th>Trainingstyp</th>
              <th>Schwerpunkt</th>
              <th>Dauer (Min)</th>
              <th>Intensität</th>
              <th>Aktionen</th>
            </tr>
          </thead>
          <tbody>
            {microPlans.map(plan => (
              <tr key={plan.id}>
                <td><strong>{new Date(plan.date).toLocaleDateString('de-DE')}</strong></td>
                <td>{getMesoPlanName(plan.meso_plan_id)}</td>
                <td>{plan.session_type || '-'}</td>
                <td>{plan.focus || '-'}</td>
                <td>{plan.duration || '-'}</td>
                <td>{plan.intensity || '-'}</td>
                <td className="table-actions">
                  <button className="btn btn-secondary" onClick={() => openModal(plan)}>
                    Bearbeiten
                  </button>
                  <button className="btn btn-danger" onClick={() => handleDelete(plan.id)}>
                    Löschen
                  </button>
                </td>
              </tr>
            ))}
            {microPlans.length === 0 && (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center' }}>
                  Keine Mikropläne vorhanden
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>{editingPlan ? 'Mikroplan bearbeiten' : 'Neuer Mikroplan'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Zugehöriger Mesoplan</label>
                <select
                  value={formData.meso_plan_id}
                  onChange={(e) => setFormData({ ...formData, meso_plan_id: e.target.value })}
                >
                  <option value="">-- Mesoplan wählen (optional) --</option>
                  {mesoPlans.map(plan => (
                    <option key={plan.id} value={plan.id}>{plan.name}</option>
                  ))}
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
                <label>Trainingstyp</label>
                <select
                  value={formData.session_type}
                  onChange={(e) => setFormData({ ...formData, session_type: e.target.value })}
                >
                  <option value="">-- Typ wählen --</option>
                  <option value="Techniktraining">Techniktraining</option>
                  <option value="Taktiktraining">Taktiktraining</option>
                  <option value="Konditionstraining">Konditionstraining</option>
                  <option value="Spieltraining">Spieltraining</option>
                  <option value="Regeneration">Regeneration</option>
                </select>
              </div>
              <div className="form-group">
                <label>Schwerpunkt</label>
                <input
                  type="text"
                  value={formData.focus}
                  onChange={(e) => setFormData({ ...formData, focus: e.target.value })}
                  placeholder="z.B. Passen, Torschuss, Ausdauer"
                />
              </div>
              <div className="form-group">
                <label>Dauer (Minuten)</label>
                <input
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  placeholder="90"
                />
              </div>
              <div className="form-group">
                <label>Intensität</label>
                <select
                  value={formData.intensity}
                  onChange={(e) => setFormData({ ...formData, intensity: e.target.value })}
                >
                  <option value="">-- Intensität wählen --</option>
                  <option value="Niedrig">Niedrig</option>
                  <option value="Mittel">Mittel</option>
                  <option value="Hoch">Hoch</option>
                  <option value="Sehr Hoch">Sehr Hoch</option>
                </select>
              </div>
              <div className="form-group">
                <label>Beschreibung</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detaillierte Trainingsinhalte"
                />
              </div>
              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                  Abbrechen
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingPlan ? 'Aktualisieren' : 'Erstellen'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default MicroPlans;
