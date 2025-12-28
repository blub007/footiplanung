// Football-specific training generator based on Raymond Verheijen's methodology
// Focus: Football-specific game forms instead of isolated drills
// Reference: Verheijen's "Football Periodisation" and Dutch training philosophy

function generateVerheijenPlan(mesoPlanId, startDate, weeks, position, db) {
  return new Promise((resolve, reject) => {
    const microPlans = [];
    
    // Verheijen phases: Skill acquisition → Team tactics → Match preparation
    const getVerheijenPhase = (weekNum, totalWeeks) => {
      const progress = weekNum / totalWeeks;
      if (progress < 0.4) return { phase: 'Skill Acquisition', complexity: 'low' };
      if (progress < 0.75) return { phase: 'Team Tactics', complexity: 'medium' };
      return { phase: 'Match Preparation', complexity: 'high' };
    };

    // Football-specific training with variations (Verheijen approach)
    const getVerheijenSessions = (pos, phaseInfo) => {
      // Core principle: All training in football context (no isolated fitness)
      const sessions = {
        'Torwart': [
          {
            type: 'TW-Spielformen',
            focus: 'Spielaufbau unter Druck, Absicherung',
            duration: 75,
            intensity: 'Hoch',
            description: 'Spielform 7v7+TW: Torwart als zusätzlicher Spieler im Aufbau, Gegenpressing-Situationen',
            variations: [
              '🎯 Variante 1: 7v7+TW mit Zoneneinteilung - TW muss Ball in bestimmte Zone spielen für Bonuspunkt',
              '🎯 Variante 2: 7v7+TW mit zeitlichem Druck - Nach TW-Ballbesitz 10 Sek. für Angriff',
              '🎯 Variante 3: 7v7+TW mit Überzahl-Aufbau - TW + 8v6 im Aufbau, dann 7v7 im Angriff',
              '🎯 Variante 4: 7v7+TW mit hohem Pressing - Gegner presst sofort nach TW-Ballkontakt'
            ]
          },
          {
            type: 'TW-Positionsspiel',
            focus: 'Stellungsspiel, Eins-gegen-Eins, Flankenabwehr',
            duration: 70,
            intensity: 'Mittel-Hoch',
            description: 'Spielform 5v5+TW auf halbes Feld mit Flankenspiel und Abschluss',
            variations: [
              '🎯 Variante 1: 5v5+TW mit Außenbahn-Fokus - Tore nur nach Flanke',
              '🎯 Variante 2: 5v5+TW mit Rückpass-Regel - TW muss 3x angespielt werden',
              '🎯 Variante 3: 5v5+TW mit schnellen Kontern - Nach Ballgewinn 8 Sek. für Torabschluss',
              '🎯 Variante 4: 5v5+TW mit Doppel-Torabschluss - Zwei schnelle Schüsse nacheinander'
            ]
          },
          {
            type: 'TW-Übergangssituationen',
            focus: 'Umschalten, schnelles Herauslaufen, Kommunikation',
            duration: 65,
            intensity: 'Hoch',
            description: 'Spielform 6v6+TW mit sofortigem Umschalten bei Ballgewinn/-verlust',
            variations: [
              '🎯 Variante 1: 6v6+TW Umschaltspiel mit Joker - Neutraler Spieler immer beim ballbesitzenden Team',
              '🎯 Variante 2: 6v6+TW mit Raum-Wechsel - Nach Ballverlust verteidigen auf anderem Feld',
              '🎯 Variante 3: 6v6+TW mit Überzahl-Konter - Verteidigende Team bekommt +2 Spieler bei Ballgewinn',
              '🎯 Variante 4: 6v6+TW mit Tiefenlauf-Bonus - Tor zählt doppelt nach Pass hinter die Kette'
            ]
          }
        ],
        'Abwehr': [
          {
            type: 'Defensiv-Spielformen',
            focus: 'Kompaktheit, Verschieben, Pressing',
            duration: 80,
            intensity: 'Hoch',
            description: 'Spielform 8v8 mit Fokus auf defensive Organisation und Balleroberung',
            variations: [
              '🎯 Variante 1: 8v8 mit Pressingzonen - Balleroberung in Zone A = 2 Punkte, Zone B = 1 Punkt',
              '🎯 Variante 2: 8v8 mit Unterzahl-Verteidigung - 7v8 für 3 Min., dann Wechsel',
              '🎯 Variante 3: 8v8 mit Gegenpressing - Nach Ballverlust 5 Sek. Zeit für Rückeroberung (Bonus)',
              '🎯 Variante 4: 8v8 mit tiefer Block - Verteidigung muss in eigener Hälfte bleiben'
            ]
          },
          {
            type: 'Aufbau-Spielformen',
            focus: 'Spielaufbau unter Druck, Raumöffnung',
            duration: 75,
            intensity: 'Mittel-Hoch',
            description: 'Spielform 9v7 mit Überzahl im Aufbau, dann 9v9 nach Mittellinie',
            variations: [
              '🎯 Variante 1: 9v7→9v9 mit Mindestpasszahl - 6 Pässe vor Mittellinie für Tor-Freigabe',
              '🎯 Variante 2: 9v7→9v9 mit Breitspiel-Bonus - Pass über Außen zählt als 2 Pässe',
              '🎯 Variante 3: 9v7→9v9 mit Zeitdruck - Max. 20 Sek. für Aufbau und Torabschluss',
              '🎯 Variante 4: 9v7→9v9 mit Positionswechsel - IV muss ins Mittelfeld vorrücken'
            ]
          },
          {
            type: 'Zweikampf-Spielformen',
            focus: '1v1, Kopfball, Stellungsspiel',
            duration: 70,
            intensity: 'Hoch',
            description: 'Spielform 6v6 auf engem Raum mit vielen Zweikämpfen und hohen Bällen',
            variations: [
              '🎯 Variante 1: 6v6 Kleinfeld mit Kopfball-Bonus - Kopfballtor = 3 Punkte',
              '🎯 Variante 2: 6v6 mit 1v1-Zonen - In markierten Zonen nur 1v1 erlaubt',
              '🎯 Variante 3: 6v6 mit Flankenspiel - Ball muss über Außen kommen',
              '🎯 Variante 4: 6v6 mit Pressing-Zweikampf - Zweikampf in gegnerischer Hälfte = Bonuspunkt'
            ]
          }
        ],
        'Mittelfeld': [
          {
            type: 'Positionsspiel-Formen',
            focus: 'Raumbesetzung, Anspielstation, Umschaltspiel',
            duration: 85,
            intensity: 'Hoch',
            description: 'Spielform 8v8+2 Joker mit Schwerpunkt auf Ballzirkulation und Positionswechsel',
            variations: [
              '🎯 Variante 1: 8v8+2 Rondo im Quadrat - Joker an den Seiten, Passanzahl zählt',
              '🎯 Variante 2: 8v8+2 mit Zonenwechsel - Nach 5 Pässen Zonenwechsel Pflicht',
              '🎯 Variante 3: 8v8+2 mit Tiefenspiel - Vertikaler Pass = 2 Zählpässe',
              '🎯 Variante 4: 8v8+2 mit Gegenpressing - Nach Ballverlust 5 Sek. Rückeroberungsversuch'
            ]
          },
          {
            type: 'Übergangs-Spielformen',
            focus: 'Offensive/Defensive Transition, Schnelligkeit',
            duration: 80,
            intensity: 'Sehr Hoch',
            description: 'Spielform 7v7 mit 4 Toren, Fokus auf schnelles Umschalten und Konter',
            variations: [
              '🎯 Variante 1: 7v7 mit 4 Toren und Zeitlimit - Nach Ballgewinn 10 Sek. für Tor',
              '🎯 Variante 2: 7v7 mit Konter-Bonus - Tor nach Ballgewinn in 8 Sek. = 2 Punkte',
              '🎯 Variante 3: 7v7 mit Pressing-Auslöser - Ballgewinn in gegnerischer Hälfte startet Angriff',
              '🎯 Variante 4: 7v7 mit Überzahl-Konter - Bei Ballgewinn kommt ein Joker dazu (8v7)'
            ]
          },
          {
            type: 'Kreativ-Spielformen',
            focus: 'Dribbeln, Kombinationen, Durchbrüche',
            duration: 75,
            intensity: 'Mittel-Hoch',
            description: 'Spielform 6v6 mit Dribbel-Toren und Kombinationszonen',
            variations: [
              '🎯 Variante 1: 6v6 mit Dribbel-Linien - Durchdribbeln einer Linie = 1 Tor',
              '🎯 Variante 2: 6v6 mit Kombinationsbonus - Nach Doppelpass direkter Abschluss erlaubt',
              '🎯 Variante 3: 6v6 mit 1v1-Pflicht - Jeder Spieler muss 1x dribbeln vor Torabschluss',
              '🎯 Variante 4: 6v6 mit Wandspiel - Nur nach Wandspiel (1-2) darf abgeschlossen werden'
            ]
          }
        ],
        'Sturm': [
          {
            type: 'Torschuss-Spielformen',
            focus: 'Abschluss in Spielsituationen, Timing',
            duration: 75,
            intensity: 'Hoch',
            description: 'Spielform 7v7 mit mehreren Abschluss-Situationen und Positionswechseln',
            variations: [
              '🎯 Variante 1: 7v7 mit Abschluss-Pflicht - Nach 5 Pässen muss abgeschlossen werden',
              '🎯 Variante 2: 7v7 mit Konter-Tor - Tor nach Ballgewinn in 10 Sek. = 2 Punkte',
              '🎯 Variante 3: 7v7 mit Flanken-Abschluss - Flanke + Abschluss aus Luft = 3 Punkte',
              '🎯 Variante 4: 7v7 mit Nachschuss-Bonus - Zweiter Abschluss nach Abpraller = Bonuspunkt'
            ]
          },
          {
            type: 'Angriffs-Spielformen',
            focus: 'Laufwege, Freilaufen, Tiefenlauf',
            duration: 80,
            intensity: 'Sehr Hoch',
            description: 'Spielform 8v8 mit Fokus auf Angriffsbewegungen und Raumgewinn',
            variations: [
              '🎯 Variante 1: 8v8 mit Tiefenlauf-Zonen - Lauf hinter Abwehr in Zone = Freistoß',
              '🎯 Variante 2: 8v8 mit Positionswechsel-Pflicht - Stürmer müssen Position tauschen',
              '🎯 Variante 3: 8v8 mit Hinterlaufen - Tor nach Hinterlaufen = 2 Punkte',
              '🎯 Variante 4: 8v8 mit Ablöse-Spiel - Stürmer muss ins Mittelfeld, MF wird Stürmer'
            ]
          },
          {
            type: 'Pressing-Spielformen',
            focus: 'Anlaufen, Balleroberung im Angriffsdrittel',
            duration: 70,
            intensity: 'Sehr Hoch',
            description: 'Spielform 9v9 mit hohem Pressing und sofortigem Angriff nach Ballgewinn',
            variations: [
              '🎯 Variante 1: 9v9 mit Pressing-Trigger - Bei Pass nach hinten sofort pressen',
              '🎯 Variante 2: 9v9 mit 5-Sek-Regel - Nach Ballgewinn vorne 5 Sek. für Tor',
              '🎯 Variante 3: 9v9 mit Balleroberungs-Bonus - Ballgewinn im Angriffsdrittel = 1 Punkt',
              '🎯 Variante 4: 9v9 mit Stürmer-Pressing - Nur Stürmer dürfen im ersten Drittel verteidigen'
            ]
          }
        ]
      };
      
      return sessions[pos] || sessions['Mittelfeld'];
    };

    // Generate training weeks with Verheijen philosophy
    for (let week = 0; week < weeks; week++) {
      const phaseInfo = getVerheijenPhase(week, weeks);
      const sessions = getVerheijenSessions(position, phaseInfo);
      
      // Recovery week logic (less frequency, lower intensity game forms)
      const isRecoveryWeek = (weeks >= 4 && (week + 1) % 4 === 0) || 
                             (weeks === 3 && week === 2) ||
                             (week === weeks - 1 && weeks >= 6);
      
      // Monday: Primary game form
      const monday = new Date(startDate);
      monday.setDate(monday.getDate() + (week * 7));
      
      let mondaySession = { ...sessions[0] };
      if (isRecoveryWeek) {
        mondaySession.duration = Math.round(mondaySession.duration * 0.7);
        mondaySession.intensity = 'Niedrig-Mittel';
        mondaySession.description = `🔄 REGENERATION: ${mondaySession.description} (reduzierte Intensität)`;
      }
      
      // Select random variation
      const mondayVariation = mondaySession.variations[week % mondaySession.variations.length];
      
      microPlans.push({
        date: monday.toISOString().split('T')[0],
        type: mondaySession.type,
        focus: mondaySession.focus,
        duration: mondaySession.duration,
        intensity: mondaySession.intensity,
        description: mondaySession.description,
        variation: mondayVariation,
        phase: phaseInfo.phase,
        isRecovery: isRecoveryWeek,
        position: position
      });

      // Wednesday: Secondary game form
      const wednesday = new Date(monday);
      wednesday.setDate(wednesday.getDate() + 2);
      
      let wednesdaySession = { ...sessions[1] };
      if (isRecoveryWeek) {
        wednesdaySession.duration = Math.round(wednesdaySession.duration * 0.7);
        wednesdaySession.intensity = 'Niedrig-Mittel';
        wednesdaySession.description = `🔄 REGENERATION: ${wednesdaySession.description} (reduzierte Intensität)`;
      }
      
      const wednesdayVariation = wednesdaySession.variations[(week + 1) % wednesdaySession.variations.length];
      
      microPlans.push({
        date: wednesday.toISOString().split('T')[0],
        type: wednesdaySession.type,
        focus: wednesdaySession.focus,
        duration: wednesdaySession.duration,
        intensity: wednesdaySession.intensity,
        description: wednesdaySession.description,
        variation: wednesdayVariation,
        phase: phaseInfo.phase,
        isRecovery: isRecoveryWeek,
        position: position
      });

      // Friday: Tertiary game form or match preparation
      const friday = new Date(monday);
      friday.setDate(friday.getDate() + 4);
      
      let fridaySession;
      if (isRecoveryWeek) {
        fridaySession = {
          type: 'Regenerative Spielformen',
          focus: `Lockere ${position}-Spielformen, technische Elemente`,
          duration: 60,
          intensity: 'Niedrig',
          description: `🔄 Regeneration: Kleine Spielformen (4v4, 5v5) ohne Zeitdruck, Fokus auf Ballkontrolle`,
          variation: '🎯 Freies Spiel mit Technik-Schwerpunkt - Entspanntes Tempo',
          phase: phaseInfo.phase,
          isRecovery: true,
          position: position
        };
      } else {
        fridaySession = { ...sessions[2] };
        const fridayVariation = fridaySession.variations[(week + 2) % fridaySession.variations.length];
        fridaySession.variation = fridayVariation;
        fridaySession.phase = phaseInfo.phase;
        fridaySession.isRecovery = false;
        fridaySession.position = position;
      }
      
      microPlans.push({
        date: friday.toISOString().split('T')[0],
        ...fridaySession
      });
    }

    // Insert all micro plans into database
    const insertPromises = microPlans.map(plan => {
      return new Promise((resolveInsert, rejectInsert) => {
        const fullDescription = `[${plan.position}] [Verheijen-Methode] ${plan.description} | ${plan.variation} | Phase: ${plan.phase} | ${plan.isRecovery ? '🔄 Regenerationswoche' : '⚽ Spielform-Woche'}`;
        
        db.run(
          'INSERT INTO micro_plans (meso_plan_id, date, session_type, focus, duration, intensity, description) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [mesoPlanId, plan.date, plan.type, plan.focus, plan.duration, plan.intensity, fullDescription],
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
          methodology: 'Verheijen (Niederländisch)',
          message: `Fußballspezifischer Trainingsplan nach Verheijen für ${position} erstellt: ${microPlans.length} Spielformen über ${weeks} Wochen`
        });
      })
      .catch(err => reject(err));
  });
}

module.exports = { generateVerheijenPlan };
