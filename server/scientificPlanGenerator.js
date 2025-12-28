// Scientific training plan generator based on periodization principles
// References: 
// - Bompa & Haff (2009): Periodization: Theory and Methodology of Training
// - Bangsbo (2014): Fitness Training in Football
// - Issurin (2010): New Horizons for the Methodology and Physiology of Training Periodization

function generateScientificTrainingPlan(mesoPlanId, startDate, weeks, focusAreas, db) {
  return new Promise((resolve, reject) => {
    const microPlans = [];
    
    // Scientific periodization - divide meso into micro cycles
    // Progressive overload with recovery weeks (3:1 or 2:1 load:recovery ratio)
    const getPhaseIntensity = (weekNum, totalWeeks) => {
      const progress = weekNum / totalWeeks;
      // Early phase: Foundation building (60-70% intensity)
      if (progress < 0.33) return { phase: 'Aufbauphase', baseIntensity: 0.65 };
      // Mid phase: Development (70-85% intensity)
      if (progress < 0.66) return { phase: 'Entwicklungsphase', baseIntensity: 0.75 };
      // Late phase: Peak/Taper (85-95% then taper)
      return { phase: 'Intensivierungsphase', baseIntensity: 0.85 };
    };

    // Define scientifically structured session types per focus
    const getSessionsForFocus = (focusArea, phaseInfo) => {
      const sessions = {
        'Kondition': [
          { 
            type: 'Aerobe Grundlagenausdauer', 
            focus: 'Extensive Dauerläufe und Spielformen',
            duration: 75,
            intensity: Math.round(phaseInfo.baseIntensity * 70) + '% HFmax',
            description: 'Entwicklung der aeroben Kapazität durch extensive Belastungen im Bereich der aeroben Schwelle'
          },
          { 
            type: 'Schwellentraining',
            focus: 'Intensive Intervalle und Tempowechsel',
            duration: 60,
            intensity: Math.round(phaseInfo.baseIntensity * 85) + '% HFmax',
            description: 'Verbesserung der anaeroben Schwelle und Laktattoleranz durch hochintensive Intervalle'
          },
          { 
            type: 'Spielnahe Kondition',
            focus: 'Small-Sided Games mit hoher Intensität',
            duration: 75,
            intensity: 'Hoch',
            description: 'Fußballspezifische Ausdauerentwicklung durch reduzierte Spielformen (4v4, 5v5)'
          }
        ],
        'Technik': [
          { 
            type: 'Technische Grundlagen',
            focus: 'Ballkontrolle, Passen, Ballannahme unter variablen Bedingungen',
            duration: 90,
            intensity: 'Mittel',
            description: 'Automatisierung grundlegender Techniken nach Prinzip der variablen Übung'
          },
          { 
            type: 'Komplexe Technik',
            focus: 'Dribbeln, Finten, Torschuss unter Zeitdruck',
            duration: 90,
            intensity: 'Mittel-Hoch',
            description: 'Entwicklung komplexer technischer Fertigkeiten unter steigendem Zeitdruck'
          },
          { 
            type: 'Technik unter Gegnerdruck',
            focus: 'Technikanwendung in 1v1 und 2v2 Situationen',
            duration: 85,
            intensity: 'Hoch',
            description: 'Transfer technischer Fähigkeiten in wettkampfnahe Drucksituationen'
          }
        ],
        'Taktik': [
          { 
            type: 'Gruppentaktik',
            focus: 'Spielaufbau, Raumaufteilung, Doppelpass, Absicherung',
            duration: 90,
            intensity: 'Mittel',
            description: 'Taktisches Verständnis in Kleingruppen (3-5 Spieler) entwickeln'
          },
          { 
            type: 'Mannschaftstaktik',
            focus: 'Positionsspiel, Pressing, Umschaltspiel offensiv/defensiv',
            duration: 100,
            intensity: 'Mittel-Hoch',
            description: 'Komplexe mannschaftstaktische Abläufe in Überzahl-/Unterzahlsituationen'
          },
          { 
            type: 'Wettkampftaktik',
            focus: 'Gegnerspezifische Spielformen 11v11',
            duration: 90,
            intensity: 'Hoch',
            description: 'Anwendung taktischer Konzepte unter realen Wettkampfbedingungen'
          }
        ],
        'Kraft': [
          { 
            type: 'Maximalkraft',
            focus: 'Mehrgelenkübungen 85-95% 1RM, 3-5 Wdh.',
            duration: 60,
            intensity: 'Sehr Hoch',
            description: 'Entwicklung intramuskulärer Koordination und Maximalkraft (Kniebeugen, Kreuzheben)'
          },
          { 
            type: 'Schnellkraft',
            focus: 'Explosive Übungen, Sprünge, Würfe',
            duration: 60,
            intensity: 'Hoch',
            description: 'Verbesserung der Kraftentwicklungsrate (RFD) durch plyometrisches Training'
          },
          { 
            type: 'Kraftausdauer',
            focus: 'Funktionelles Krafttraining 30-60% 1RM',
            duration: 75,
            intensity: 'Mittel-Hoch',
            description: 'Fußballspezifische Kraftausdauer und Core-Stabilität'
          }
        ],
        'Schnelligkeit': [
          { 
            type: 'Reaktionsschnelligkeit',
            focus: 'Kognitive Reaktionsübungen mit Ball',
            duration: 60,
            intensity: 'Hoch',
            description: 'Verbesserung der Handlungsschnelligkeit und Antizipationsfähigkeit'
          },
          { 
            type: 'Azyklische Schnelligkeit',
            focus: 'Maximale Sprints 5-30m mit voller Pause',
            duration: 60,
            intensity: 'Sehr Hoch',
            description: 'Entwicklung der Beschleunigung und Maximalgeschwindigkeit (Pause/Belastung ≥ 1:6)'
          },
          { 
            type: 'Spielschnelligkeit',
            focus: 'Tempowechsel, Richtungswechsel mit Ball',
            duration: 75,
            intensity: 'Hoch',
            description: 'Fußballspezifische Schnelligkeit mit integrierten Richtungswechseln'
          }
        ],
        'Wettkampfvorbereitung': [
          { 
            type: 'Testspiel/Simulation',
            focus: 'Wettkampfnahe Spielformen 11v11',
            duration: 90,
            intensity: 'Hoch',
            description: 'Wettkampfsimulation unter realistischen Bedingungen mit Schiedsrichter'
          },
          { 
            type: 'Standardsituationen',
            focus: 'Ecken, Freistöße, Einwürfe offensiv/defensiv',
            duration: 75,
            intensity: 'Mittel',
            description: 'Systematisches Training aller Standardsituationen mit festen Abläufen'
          },
          { 
            type: 'Taktische Feinabstimmung',
            focus: 'Gegnerspezifische Taktik und Spielsystemwechsel',
            duration: 85,
            intensity: 'Mittel-Hoch',
            description: 'Vorbereitung auf spezifische Gegner und flexible Systemanpassungen'
          }
        ]
      };
      return sessions[focusArea] || sessions['Kondition'];
    };

    // Generate training week structure following periodization principles
    for (let week = 0; week < weeks; week++) {
      const phaseInfo = getPhaseIntensity(week, weeks);
      const sessions = getSessionsForFocus(focusAreas, phaseInfo);
      
      // Determine if this is a recovery week (every 3rd or 4th week)
      // Science: Supercompensation requires recovery for adaptation
      const isRecoveryWeek = (weeks >= 4 && (week + 1) % 4 === 0) || 
                             (weeks === 3 && week === 2) ||
                             (week === weeks - 1 && weeks >= 6); // Taper before important phase
      
      // Monday: Main training focus (highest quality)
      const monday = new Date(startDate);
      monday.setDate(monday.getDate() + (week * 7));
      
      let mondaySession = { ...sessions[0] };
      if (isRecoveryWeek) {
        mondaySession.duration = Math.round(mondaySession.duration * 0.65); // 65% volume reduction
        mondaySession.intensity = 'Niedrig-Mittel';
        mondaySession.description = `🔄 REGENERATIONSWOCHE: ${mondaySession.description}`;
      }
      
      microPlans.push({
        date: monday.toISOString().split('T')[0],
        ...mondaySession,
        weekPhase: phaseInfo.phase,
        isRecovery: isRecoveryWeek
      });

      // Wednesday: Secondary focus or complementary training
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
        isRecovery: isRecoveryWeek
      });

      // Friday: Integration/Application or active recovery
      const friday = new Date(monday);
      friday.setDate(friday.getDate() + 4);
      
      let fridaySession;
      if (isRecoveryWeek) {
        // Active recovery session (40-50% intensity)
        fridaySession = {
          type: 'Aktive Regeneration',
          focus: 'Lockeres Techniktraining, Koordination, Spiele',
          duration: 60,
          intensity: 'Niedrig',
          description: '🔄 Aktive Erholung zur Förderung der Superkompensation und Adaptation'
        };
      } else {
        fridaySession = { ...sessions[2] };
      }
      
      microPlans.push({
        date: friday.toISOString().split('T')[0],
        ...fridaySession,
        weekPhase: phaseInfo.phase,
        isRecovery: isRecoveryWeek
      });
    }

    // Insert all micro plans into database
    const insertPromises = microPlans.map(plan => {
      return new Promise((resolveInsert, rejectInsert) => {
        const description = `${plan.description} | Trainingsphase: ${plan.weekPhase} | ${plan.isRecovery ? '🔄 Regenerationswoche (Superkompensation)' : '💪 Belastungswoche (Progressive Overload)'}`;
        
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
          message: `Wissenschaftlich fundierter Trainingsplan erstellt: ${microPlans.length} Einheiten über ${weeks} Wochen nach Periodisierungsprinzipien`
        });
      })
      .catch(err => reject(err));
  });
}

module.exports = { generateScientificTrainingPlan };
