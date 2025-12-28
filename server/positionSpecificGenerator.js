// Position-specific training plan generator for football
// Different positions require specialized training emphasis

function generatePositionSpecificPlan(mesoPlanId, startDate, weeks, position, db) {
  return new Promise((resolve, reject) => {
    const microPlans = [];
    
    // Phase intensity calculation
    const getPhaseIntensity = (weekNum, totalWeeks) => {
      const progress = weekNum / totalWeeks;
      if (progress < 0.33) return { phase: 'Aufbauphase', baseIntensity: 0.65 };
      if (progress < 0.66) return { phase: 'Entwicklungsphase', baseIntensity: 0.75 };
      return { phase: 'Intensivierungsphase', baseIntensity: 0.85 };
    };

    // Position-specific training sessions
    const getSessionsForPosition = (pos, phaseInfo) => {
      const sessions = {
        'Torwart': [
          {
            type: 'Torwartspezifisches Training',
            focus: 'Reaktion, Stellungsspiel, Fangen und Abwehr',
            duration: 75,
            intensity: 'Hoch',
            description: 'Torwart-Grundtechniken: Ballfangen, Hechten, Fußarbeit, Stellungsspiel bei Flanken und 1-gegen-1'
          },
          {
            type: 'Torwart-Spielaufbau',
            focus: 'Abstoß, Abwurf, Spieleröffnung mit dem Fuß',
            duration: 60,
            intensity: 'Mittel',
            description: 'Fußballtechnik für Torhüter: Präzise Abspiele, lange Abstöße, Spielaufbau unter Druck'
          },
          {
            type: 'Torwart-Athletik',
            focus: 'Explosivkraft, Schnelligkeit, Koordination',
            duration: 60,
            intensity: Math.round(phaseInfo.baseIntensity * 80) + '% HFmax',
            description: 'Athletiktraining für Torhüter: Plyometrics, Sprints, Beweglichkeit, Core-Stabilität'
          }
        ],
        'Abwehr': [
          {
            type: 'Defensivtaktik',
            focus: 'Zweikampfführung, Stellungsspiel, Absicherung',
            duration: 75,
            intensity: 'Mittel-Hoch',
            description: 'Verteidigungsgrundlagen: 1v1 Verteidigung, Verschieben in der Kette, Kopfballspiel, taktisches Foulspiel'
          },
          {
            type: 'Spielaufbau aus der Abwehr',
            focus: 'Passspiel unter Druck, Raumöffnung',
            duration: 75,
            intensity: 'Mittel',
            description: 'Ballsicherer Spielaufbau: Erste Anspielstation, diagonale Pässe, Druckausweichen'
          },
          {
            type: 'Abwehr-Athletik',
            focus: 'Kraft, Antrittsschnelligkeit, Ausdauer',
            duration: 70,
            intensity: Math.round(phaseInfo.baseIntensity * 75) + '% HFmax',
            description: 'Physische Vorbereitung: Schnellkraft, Richtungswechsel, aerobe Ausdauer für Verteidiger'
          }
        ],
        'Mittelfeld': [
          {
            type: 'Mittelfeld-Technik',
            focus: 'Ballkontrolle, Passspiel, Dribbling',
            duration: 85,
            intensity: 'Mittel-Hoch',
            description: 'Technische Vielseitigkeit: Ballkontrolle unter Druck, kurze/lange Pässe, Finten'
          },
          {
            type: 'Mittelfeld-Taktik',
            focus: 'Positionsspiel, Raumöffnung, Umschaltspiel',
            duration: 90,
            intensity: 'Hoch',
            description: 'Zentrale Spielgestaltung: Verbindungsspiel, defensive/offensive Transitions, Pressing-Resistenz'
          },
          {
            type: 'Mittelfeld-Kondition',
            focus: 'Intervalltraining, Spielausdauer',
            duration: 75,
            intensity: Math.round(phaseInfo.baseIntensity * 85) + '% HFmax',
            description: 'Hohe Laufleistung: Intensive Intervalle, repeated sprints, aerobe/anaerobe Kapazität'
          }
        ],
        'Sturm': [
          {
            type: 'Torschusstraining',
            focus: 'Abschluss aus verschiedenen Positionen, Kopfball',
            duration: 75,
            intensity: 'Hoch',
            description: 'Torgefahr erhöhen: Abschlüsse aus dem Lauf, Vollspann, Innenrist, Flachschüsse, Kopfballtraining'
          },
          {
            type: 'Sturm-Taktik',
            focus: 'Laufwege, Freilaufverhalten, 1v1 offensiv',
            duration: 75,
            intensity: 'Mittel-Hoch',
            description: 'Offensivaktionen: Tiefenlauf, Wandspiel, Ablöseverhalten, Positionswechsel im Sturm'
          },
          {
            type: 'Sturm-Athletik',
            focus: 'Explosivkraft, Schnelligkeit, Sprints',
            duration: 60,
            intensity: Math.round(phaseInfo.baseIntensity * 90) + '% HFmax',
            description: 'Angriffsdynamik: Explosive Antritte, Sprintkraft, Richtungswechsel, Zweikampfstärke'
          }
        ]
      };
      
      return sessions[pos] || sessions['Mittelfeld']; // Default to Mittelfeld if position not found
    };

    // Generate training week structure with position-specific focus
    for (let week = 0; week < weeks; week++) {
      const phaseInfo = getPhaseIntensity(week, weeks);
      const sessions = getSessionsForPosition(position, phaseInfo);
      
      // Recovery week logic
      const isRecoveryWeek = (weeks >= 4 && (week + 1) % 4 === 0) || 
                             (weeks === 3 && week === 2) ||
                             (week === weeks - 1 && weeks >= 6);
      
      // Monday: Position-specific technical/tactical session
      const monday = new Date(startDate);
      monday.setDate(monday.getDate() + (week * 7));
      
      let mondaySession = { ...sessions[0] };
      if (isRecoveryWeek) {
        mondaySession.duration = Math.round(mondaySession.duration * 0.65);
        mondaySession.intensity = 'Niedrig-Mittel';
        mondaySession.description = `🔄 REGENERATIONSWOCHE: ${mondaySession.description}`;
      }
      
      microPlans.push({
        date: monday.toISOString().split('T')[0],
        ...mondaySession,
        weekPhase: phaseInfo.phase,
        isRecovery: isRecoveryWeek,
        position: position
      });

      // Wednesday: Secondary focus (tactical/technical variation)
      const wednesday = new Date(monday);
      wednesday.setDate(wednesday.getDate() + 2);
      
      let wednesdaySession = { ...sessions[1] };
      if (isRecoveryWeek) {
        wednesdaySession.duration = Math.round(wednesdaySession.duration * 0.65);
        wednesdaySession.intensity = 'Niedrig-Mittel';
        wednesdaySession.description = `🔄 REGENERATIONSWOCHE: ${wednesdaySession.description}`;
      }
      
      microPlans.push({
        date: wednesday.toISOString().split('T')[0],
        ...wednesdaySession,
        weekPhase: phaseInfo.phase,
        isRecovery: isRecoveryWeek,
        position: position
      });

      // Friday: Athletic/conditioning session or recovery
      const friday = new Date(monday);
      friday.setDate(friday.getDate() + 4);
      
      let fridaySession;
      if (isRecoveryWeek) {
        fridaySession = {
          type: 'Positionsspezifische Regeneration',
          focus: `Lockeres ${position}-Training, Koordination, Spielformen`,
          duration: 60,
          intensity: 'Niedrig',
          description: `🔄 Aktive Erholung für ${position}: Technische Übungen niedriger Intensität, Koordination`
        };
      } else {
        fridaySession = { ...sessions[2] };
      }
      
      microPlans.push({
        date: friday.toISOString().split('T')[0],
        ...fridaySession,
        weekPhase: phaseInfo.phase,
        isRecovery: isRecoveryWeek,
        position: position
      });
    }

    // Insert all micro plans into database
    const insertPromises = microPlans.map(plan => {
      return new Promise((resolveInsert, rejectInsert) => {
        const description = `[${plan.position}] ${plan.description} | Phase: ${plan.weekPhase} | ${plan.isRecovery ? '🔄 Regenerationswoche' : '💪 Belastungswoche'}`;
        
        db.run(
          'INSERT INTO micro_plans (meso_plan_id, date, session_type, focus, duration, intensity, description) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [mesoPlanId, plan.date, plan.type, plan.focus, plan.duration, plan.intensity, description],
          function(err) {
            if (err) rejectInsert(err);
            else resolveInsert(this.lastID);
          }
        );
      });
    });

    Promise.all(insertPromises)
      .then(ids => {
        const recoveryWeeks = microPlans.filter(p => p.isRecovery).length / 3;
        resolve({
          micro_plan_ids: ids,
          total_sessions: microPlans.length,
          recovery_weeks: recoveryWeeks,
          load_weeks: weeks - recoveryWeeks,
          position: position,
          message: `Positionsspezifischer Trainingsplan für ${position} erstellt: ${microPlans.length} Einheiten über ${weeks} Wochen`
        });
      })
      .catch(err => reject(err));
  });
}

module.exports = { generatePositionSpecificPlan };
