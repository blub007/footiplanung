import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../config';

function Calendar() {
  const [microPlans, setMicroPlans] = useState([]);
  const [events, setEvents] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedDayData, setSelectedDayData] = useState(null);

  useEffect(() => {
    loadData();
  }, [currentMonth]);

  const loadData = async () => {
    try {
      const [microResponse, eventsResponse] = await Promise.all([
        axios.get(`${API_URL}/micro-plans`),
        axios.get(`${API_URL}/events`)
      ]);
      setMicroPlans(microResponse.data);
      setEvents(eventsResponse.data);
    } catch (error) {
      console.error('Error loading calendar data:', error);
    }
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the 1st
    for (let i = 0; i < (startingDayOfWeek === 0 ? 6 : startingDayOfWeek - 1); i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  const getDataForDate = (date) => {
    if (!date) return { trainings: [], events: [] };
    
    const dateStr = date.toISOString().split('T')[0];
    const trainings = microPlans.filter(mp => mp.date === dateStr);
    const dayEvents = events.filter(e => e.date === dateStr);
    
    return { trainings, events: dayEvents };
  };

  const handleDateClick = (date) => {
    if (!date) return;
    setSelectedDate(date);
    setSelectedDayData(getDataForDate(date));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const todayMonth = () => {
    setCurrentMonth(new Date());
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const days = getDaysInMonth(currentMonth);
  const monthName = currentMonth.toLocaleDateString('de-DE', { month: 'long', year: 'numeric' });

  return (
    <div>
      <h2>📅 Trainingskalender</h2>
      <p>Visualisierung aller Trainingseinheiten und Events im Kalender</p>

      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'center' }}>
        <button onClick={prevMonth} className="btn">◀ Vorheriger Monat</button>
        <button onClick={todayMonth} className="btn">Heute</button>
        <button onClick={nextMonth} className="btn">Nächster Monat ▶</button>
        <h3 style={{ margin: 0, marginLeft: '20px' }}>{monthName}</h3>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        gap: '5px',
        marginBottom: '20px'
      }}>
        {['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'].map(day => (
          <div key={day} style={{
            padding: '10px',
            textAlign: 'center',
            fontWeight: 'bold',
            background: '#3b5998',
            color: 'white',
            borderRadius: '4px'
          }}>
            {day}
          </div>
        ))}
        
        {days.map((date, index) => {
          if (!date) {
            return <div key={`empty-${index}`} style={{ padding: '10px' }}></div>;
          }
          
          const { trainings, events } = getDataForDate(date);
          const isToday = date.toDateString() === new Date().toDateString();
          const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
          
          return (
            <div
              key={index}
              onClick={() => handleDateClick(date)}
              style={{
                padding: '10px',
                minHeight: '80px',
                border: isSelected ? '3px solid #3b5998' : (isToday ? '2px solid #42b983' : '1px solid #ddd'),
                borderRadius: '8px',
                cursor: 'pointer',
                background: isToday ? '#e8f5e9' : 'white',
                transition: 'all 0.2s'
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#f5f5f5'}
              onMouseLeave={e => e.currentTarget.style.background = isToday ? '#e8f5e9' : 'white'}
            >
              <div style={{ fontWeight: isToday ? 'bold' : 'normal', marginBottom: '5px' }}>
                {date.getDate()}
              </div>
              {trainings.length > 0 && (
                <div style={{
                  fontSize: '11px',
                  background: '#4CAF50',
                  color: 'white',
                  padding: '2px 4px',
                  borderRadius: '3px',
                  marginBottom: '2px'
                }}>
                  ⚽ {trainings.length} Training{trainings.length > 1 ? 's' : ''}
                </div>
              )}
              {events.length > 0 && (
                <div style={{
                  fontSize: '11px',
                  background: '#FF5722',
                  color: 'white',
                  padding: '2px 4px',
                  borderRadius: '3px'
                }}>
                  🏆 {events.length} Event{events.length > 1 ? 's' : ''}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {selectedDate && selectedDayData && (
        <div style={{
          background: 'white',
          padding: '20px',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h3>📅 {formatDate(selectedDate)}</h3>
          
          {selectedDayData.trainings.length === 0 && selectedDayData.events.length === 0 && (
            <p>Keine Einträge für diesen Tag.</p>
          )}
          
          {selectedDayData.trainings.length > 0 && (
            <div style={{ marginBottom: '20px' }}>
              <h4>⚽ Trainingseinheiten</h4>
              {selectedDayData.trainings.map(training => (
                <div key={training.id} style={{
                  background: '#f0f8ff',
                  padding: '15px',
                  borderRadius: '8px',
                  marginBottom: '10px',
                  borderLeft: '4px solid #4CAF50'
                }}>
                  <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>{training.session_type}</div>
                  {training.focus && <div style={{ fontSize: '14px', color: '#666', marginBottom: '5px' }}>Schwerpunkt: {training.focus}</div>}
                  {training.intensity && <div style={{ fontSize: '14px', color: '#666', marginBottom: '5px' }}>Intensität: {training.intensity}</div>}
                  {training.duration && <div style={{ fontSize: '14px', color: '#666', marginBottom: '5px' }}>Dauer: {training.duration} Min</div>}
                  {training.description && (
                    <div style={{
                      fontSize: '13px',
                      marginTop: '10px',
                      whiteSpace: 'pre-wrap',
                      maxHeight: '150px',
                      overflow: 'auto'
                    }}>
                      {training.description}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          
          {selectedDayData.events.length > 0 && (
            <div>
              <h4>🏆 Events</h4>
              {selectedDayData.events.map(event => (
                <div key={event.id} style={{
                  background: '#fff3e0',
                  padding: '15px',
                  borderRadius: '8px',
                  marginBottom: '10px',
                  borderLeft: '4px solid #FF5722'
                }}>
                  <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>{event.name}</div>
                  <div style={{ fontSize: '14px', color: '#666', marginBottom: '5px' }}>Typ: {event.type}</div>
                  {event.location && <div style={{ fontSize: '14px', color: '#666', marginBottom: '5px' }}>Ort: {event.location}</div>}
                  {event.opponent && <div style={{ fontSize: '14px', color: '#666', marginBottom: '5px' }}>Gegner: {event.opponent}</div>}
                  {event.importance && <div style={{ fontSize: '14px', color: '#666', marginBottom: '5px' }}>Wichtigkeit: {event.importance}</div>}
                  {event.notes && <div style={{ fontSize: '13px', marginTop: '10px' }}>{event.notes}</div>}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        .btn {
          padding: 8px 16px;
          background: #3b5998;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
        }
        .btn:hover {
          background: #2d4373;
        }
      `}</style>
    </div>
  );
}

export default Calendar;
