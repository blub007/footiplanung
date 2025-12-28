import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../config';

function MesoPlans() {
  const [mesoPlans, setMesoPlans] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    start_date: '',
    end_date: '',
    focus: '',
    description: ''
  });
  const [generateData, setGenerateData] = useState({
    start_date: '',
    weeks: 4,
    focus: 'Kondition',
    position: 'Alle',
    planType: 'general' // 'general' or 'position'
  });
  const [generating, setGenerating] = useState(false);

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

  const openGenerateModal = () => {
    // Set default start date to next Monday
    const today = new Date();
    const dayOfWeek = today.getDay();
    const daysUntilMonday = dayOfWeek === 0 ? 1 : (8 - dayOfWeek);
    const nextMonday = new Date(today);
    nextMonday.setDate(today.getDate() + daysUntilMonday);
    
    setGenerateData({
      start_date: nextMonday.toISOString().split('T')[0],
      weeks: 4,
      focus: 'Kondition',
      position: 'Alle',
      planType: 'general'
    });
    setShowGenerateModal(true);
  };

  const closeGenerateModal = () => {
    setShowGenerateModal(false);
    setGenerating(false);
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    setGenerating(true);
    try {
      const response = await axios.post(`${API_URL}/generate-plan`, generateData);
      alert(`✅ ${response.data.message}`);
      loadMesoPlans();
      closeGenerateModal();
    } catch (error) {
      console.error('Error generating plan:', error);
      alert('❌ Fehler beim Generieren des Trainingsplans');
      setGenerating(false);
    }
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
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn btn-success" onClick={openGenerateModal}>
            ✨ Trainingsplan automatisch generieren
          </button>
          <button className="btn btn-primary" onClick={() => openModal()}>
            + Neuer Mesoplan
          </button>
        </div>
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

      {showGenerateModal && (
        <div className="modal-overlay" onClick={closeGenerateModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>✨ Trainingsplan automatisch generieren</h3>
            <p style={{ color: '#666', marginBottom: '1.5rem' }}>
              Generieren Sie einen <strong>wissenschaftlich fundierten</strong> Trainingsplan 
              basierend auf <strong>Periodisierungsprinzipien</strong> (Progressive Overload, 
              Superkompensation). Wählen Sie zwischen allgemeinem oder <strong>positionsspezifischem</strong> Training.
            </p>
            <form onSubmit={handleGenerate}>
              <div className="form-group">
                <label>Planungsart *</label>
                <select
                  value={generateData.planType}
                  onChange={(e) => setGenerateData({ ...generateData, planType: e.target.value, position: 'Alle' })}
                  required
                  style={{ fontWeight: 'bold' }}
                >
                  <option value="general">🎯 Allgemeine Trainingsplanung (nach Schwerpunkt)</option>
                  <option value="position">⚽ Positionsspezifische Planung (Torwart, Abwehr, Mittelfeld, Sturm)</option>
                </select>
              </div>

              {generateData.planType === 'position' ? (
                <div className="form-group">
                  <label>Position *</label>
                  <select
                    value={generateData.position}
                    onChange={(e) => setGenerateData({ ...generateData, position: e.target.value })}
                    required
                  >
                    <option value="Alle">-- Position wählen --</option>
                    <option value="Torwart">🧤 Torwart - Reaktion, Stellungsspiel, Spielaufbau</option>
                    <option value="Abwehr">🛡️ Abwehr - Zweikampf, Stellungsspiel, Spielaufbau</option>
                    <option value="Mittelfeld">⚙️ Mittelfeld - Ballkontrolle, Taktik, Ausdauer</option>
                    <option value="Sturm">⚡ Sturm - Torschuss, Laufwege, Explosivkraft</option>
                  </select>
                  <small style={{ color: '#666', display: 'block', marginTop: '0.25rem' }}>
                    Jede Position erhält spezifische Technik-, Taktik- und Athletikeinheiten
                  </small>
                </div>
              ) : (
                <div className="form-group">
                  <label>Trainingsschwerpunkt *</label>
                  <select
                    value={generateData.focus}
                    onChange={(e) => setGenerateData({ ...generateData, focus: e.target.value })}
                    required
                  >
                    <option value="Kondition">Kondition - Ausdauer und Fitness</option>
                    <option value="Technik">Technik - Ballkontrolle und Fertigkeiten</option>
                    <option value="Taktik">Taktik - Spielaufbau und Positionsspiel</option>
                    <option value="Kraft">Kraft - Athletik und Stabilität</option>
                    <option value="Schnelligkeit">Schnelligkeit - Sprint und Agilität</option>
                    <option value="Wettkampfvorbereitung">Wettkampfvorbereitung - Spielformen</option>
                  </select>
                </div>
              )}

              <div className="form-group">
                <label>Startdatum *</label>
                <input
                  type="date"
                  value={generateData.start_date}
                  onChange={(e) => setGenerateData({ ...generateData, start_date: e.target.value })}
                  required
                />
                <small style={{ color: '#666', display: 'block', marginTop: '0.25rem' }}>
                  Standard: Nächster Montag
                </small>
              </div>
              
              <div className="form-group">
                <label>Dauer (Wochen) *</label>
                <select
                  value={generateData.weeks}
                  onChange={(e) => setGenerateData({ ...generateData, weeks: parseInt(e.target.value) })}
                  required
                >
                  <option value="2">2 Wochen</option>
                  <option value="3">3 Wochen</option>
                  <option value="4">4 Wochen (Standard)</option>
                  <option value="5">5 Wochen</option>
                  <option value="6">6 Wochen</option>
                  <option value="8">8 Wochen</option>
                  <option value="12">12 Wochen</option>
                </select>
                <small style={{ color: '#666', display: 'block', marginTop: '0.25rem' }}>
                  Es werden {generateData.weeks * 3} Trainingseinheiten generiert (3 pro Woche: Mo, Mi, Fr)
                </small>
              </div>

              <div style={{ 
                background: '#f0f8ff', 
                border: '1px solid #1e3c72', 
                borderRadius: '4px', 
                padding: '1rem', 
                marginBottom: '1rem' 
              }}>
                <strong>🔬 Wissenschaftliche Grundlagen</strong>
                <ul style={{ marginTop: '0.5rem', marginBottom: 0, paddingLeft: '1.5rem', fontSize: '0.9rem' }}>
                  <li><strong>Periodisierung:</strong> {generateData.weeks >= 4 ? 'Belastungs-/Regenerationswochen im 3:1 Verhältnis' : 'Strukturierte Belastungssteigerung'}</li>
                  <li><strong>Progressive Overload:</strong> Aufbau → Entwicklung → Intensivierung</li>
                  <li><strong>Superkompensation:</strong> Gezielte Regenerationsphasen für optimale Anpassung</li>
                  <li><strong>{generateData.weeks * 3} Trainingseinheiten</strong> (Mo/Mi/Fr) {generateData.planType === 'position' ? `für ${generateData.position}` : `fokussiert auf ${generateData.focus}`}</li>
                  <li><strong>Variabilität:</strong> Unterschiedliche Trainingsformen und Intensitäten</li>
                  {generateData.planType === 'position' && generateData.position !== 'Alle' && (
                    <li><strong>Positionsspezifisch:</strong> Technik, Taktik und Athletik für {generateData.position}</li>
                  )}
                </ul>
              </div>
              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={closeGenerateModal} disabled={generating}>
                  Abbrechen
                </button>
                <button type="submit" className="btn btn-success" disabled={generating}>
                  {generating ? '⏳ Generiere...' : '✨ Trainingsplan generieren'}
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
