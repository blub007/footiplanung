import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../config';

function MesoPlans() {
  const [mesoPlans, setMesoPlans] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    start_date: '',
    end_date: '',
    focus: '',
    description: ''
  });

  useEffect(() => {
    loadMesoPlans();
  }, []);

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
        await axios.put(`${API_URL}/meso-plans/${editingPlan.id}`, formData);
      } else {
        await axios.post(`${API_URL}/meso-plans`, formData);
      }
      loadMesoPlans();
      closeModal();
    } catch (error) {
      console.error('Error saving meso plan:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Möchten Sie diesen Mesoplan wirklich löschen?')) {
      try {
        await axios.delete(`${API_URL}/meso-plans/${id}`);
        loadMesoPlans();
      } catch (error) {
        console.error('Error deleting meso plan:', error);
      }
    }
  };

  const openModal = (plan = null) => {
    if (plan) {
      setEditingPlan(plan);
      setFormData({
        name: plan.name,
        start_date: plan.start_date,
        end_date: plan.end_date,
        focus: plan.focus || '',
        description: plan.description || ''
      });
    } else {
      setEditingPlan(null);
      setFormData({
        name: '',
        start_date: '',
        end_date: '',
        focus: '',
        description: ''
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingPlan(null);
  };

  const getDurationWeeks = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.ceil(diffDays / 7);
  };

  return (
    <div>
      <div className="section-header">
        <h2>Mesoplanung (Mittelfristige Planung)</h2>
        <button className="btn btn-primary" onClick={() => openModal()}>
          + Neuer Mesoplan
        </button>
      </div>

      <p style={{ marginBottom: '1.5rem', color: '#666' }}>
        Mesopläne dienen der mittelfristigen Trainingsplanung (typischerweise 2-6 Wochen).
        Sie strukturieren die Trainingsphasen und legen übergeordnete Schwerpunkte fest.
      </p>

      <div className="card-grid">
        {mesoPlans.map(plan => (
          <div key={plan.id} className="card">
            <h3 style={{ marginTop: 0, color: '#1e3c72' }}>{plan.name}</h3>
            <p><strong>Zeitraum:</strong> {new Date(plan.start_date).toLocaleDateString('de-DE')} - {new Date(plan.end_date).toLocaleDateString('de-DE')}</p>
            <p><strong>Dauer:</strong> {getDurationWeeks(plan.start_date, plan.end_date)} Wochen</p>
            {plan.focus && <p><strong>Schwerpunkt:</strong> {plan.focus}</p>}
            {plan.description && <p><strong>Beschreibung:</strong> {plan.description}</p>}
            <div className="table-actions" style={{ marginTop: '1rem' }}>
              <button className="btn btn-secondary" onClick={() => openModal(plan)}>
                Bearbeiten
              </button>
              <button className="btn btn-danger" onClick={() => handleDelete(plan.id)}>
                Löschen
              </button>
            </div>
          </div>
        ))}
        {mesoPlans.length === 0 && (
          <div className="card">
            <p>Keine Mesopläne vorhanden</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>{editingPlan ? 'Mesoplan bearbeiten' : 'Neuer Mesoplan'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  placeholder="z.B. Vorbereitungsphase 1, Wettkampfphase 2"
                />
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
                <label>Enddatum *</label>
                <input
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Schwerpunkt</label>
                <select
                  value={formData.focus}
                  onChange={(e) => setFormData({ ...formData, focus: e.target.value })}
                >
                  <option value="">-- Schwerpunkt wählen --</option>
                  <option value="Kondition">Kondition</option>
                  <option value="Technik">Technik</option>
                  <option value="Taktik">Taktik</option>
                  <option value="Kraft">Kraft</option>
                  <option value="Schnelligkeit">Schnelligkeit</option>
                  <option value="Wettkampfvorbereitung">Wettkampfvorbereitung</option>
                </select>
              </div>
              <div className="form-group">
                <label>Beschreibung</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Ziele und Details der Trainingsphase"
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

export default MesoPlans;
