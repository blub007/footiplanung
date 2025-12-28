/**
 * Van Gaal Training Plan Generator
 * Based on Louis van Gaal's game phases and principles (Spielphasen nach Van Gaal)
 * 
 * Van Gaal's 4 Game Phases:
 * 1. Ballbesitz (Ball Possession / Offensive Organization)
 * 2. Umschaltmoment Ballbesitz → Ballverlust (Transition: Possession → Loss)
 * 3. Ballverlust (Ball Loss / Defensive Organization)
 * 4. Umschaltmoment Ballverlust → Ballbesitz (Transition: Loss → Possession)
 */

const dayTemplates = {
  'Dienstag': 'repetition', // Repetition of all game phases
  'Donnerstag': 'defensive',  // Focus on defensive phases
  'Freitag': 'offensive'      // Focus on offensive phases
};

const gamePhases = {
  ballbesitz: {
    name: 'Ballbesitz (Offensive Organization)',
    principles: [
      'Raumaufteilung und Breite schaffen',
      'Tiefe durch Läufe in die Schnittstellen',
      'Ballzirkulation und Geduld',
      'Spieler zwischen den Linien',
      'Überzahlsituationen kreieren'
    ]
  },
  umschaltung_offensiv: {
    name: 'Umschaltmoment: Ballbesitz → Ballverlust',
    principles: [
      'Sofortiges Gegenpressing (5-Sekunden-Regel)',
      'Ballnahe Verschiebung',
      'Passwege zustellen',
      'Kompaktheit wiederherstellen',
      'Schnelles Anlaufen des Ballführenden'
    ]
  },
  ballverlust: {
    name: 'Ballverlust (Defensive Organization)',
    principles: [
      'Kompakte Defensivformation',
      'Raumverteidigung vor Mannverteidigung',
      'Pressing-Trigger erkennen',
      'Absicherung und Staffelung',
      'Gegner zu schwachen Räumen zwingen'
    ]
  },
  umschaltung_defensiv: {
    name: 'Umschaltmoment: Ballverlust → Ballbesitz',
    principles: [
      'Schnelles Umschalten nach vorne',
      'Tiefe Läufe in den Raum',
      'Vertikales Passing bevorzugen',
      'Überzahlsituationen nutzen',
      'Tempo im Angriff'
    ]
  }
};

function generateVanGaalSession(phase, day, weekInCycle, trainingDays) {
  const sessions = {
    repetition: {
      ballbesitz: {
        title: 'Van Gaal: Ballbesitz-Training (Wiederholung)',
        description: `🎯 Spielphase: ${gamePhases.ballbesitz.name}

📚 Trainingsprinzipien:
${gamePhases.ballbesitz.principles.map(p => `  • ${p}`).join('\n')}

⚽ Spielform 1: 8v8+2 Positionsspiel (20 Min)
- Joker spielen immer mit der ballbesitzenden Mannschaft
- Ziel: 10 Pässe = 1 Punkt
- Schwerpunkt: Raumaufteilung, Breite, Tiefe
- Variante: Spieler zwischen den Linien = 2 Zählpässe

⚽ Spielform 2: 9v9 Aufbauspiel (25 Min)
- Aufbau aus dem eigenen Drittel mit Gegenpressing
- 3 Zonen: Defensiv → Mittel → Offensiv
- Schwerpunkt: Ballzirkulation und geduld
- Variante: Pass in Offensivzone = 3 Punkte

⚽ Spielform 3: 11v11 Positionsspiel (20 Min)
- Vollständiges Taktiktraining mit allen Positionen
- Schwerpunkt: Spieler zwischen den Linien finden
- Integration aller Ballbesitz-Prinzipien`,
        intensity: weekInCycle === trainingDays.length ? 'Niedrig-Mittel' : 'Mittel-Hoch'
      },
      umschaltung_offensiv: {
        title: 'Van Gaal: Gegenpressing-Training (Wiederholung)',
        description: `🎯 Spielphase: ${gamePhases.umschaltung_offensiv.name}

📚 Trainingsprinzipien:
${gamePhases.umschaltung_offensiv.principles.map(p => `  • ${p}`).join('\n')}

⚽ Spielform 1: 7v7 Gegenpressing (20 Min)
- Bei Ballverlust: 5-Sekunden-Regel für Rückeroberung
- Erfolg = Punkt, Misserfolg = Gegner bekommt Ball
- Schwerpunkt: Sofortiges Anlaufen und Kompaktheit
- Variante: Rückeroberung in 3 Sek = Doppelpunkt

⚽ Spielform 2: 8v8+2 Übergangsspiel (25 Min)
- Wechsel zwischen Ballbesitz und Ballverlust
- Schwerpunkt: Schnelles Umschalten bei Ballverlust
- Gegenpressing-Zone im Mittelfeld markiert
- Variante: Ballgewinn in Zone = 3 Punkte

⚽ Spielform 3: 10v10 Gegenpressing-Simulation (20 Min)
- Vollständiges Mannschaftstraining
- Schwerpunkt: Koordiniertes Gegenpressing
- Integration: Passwege zustellen + Kompaktheit`,
        intensity: weekInCycle === trainingDays.length ? 'Niedrig-Mittel' : 'Mittel-Hoch'
      },
      ballverlust: {
        title: 'Van Gaal: Defensive Organization (Wiederholung)',
        description: `🎯 Spielphase: ${gamePhases.ballverlust.name}

📚 Trainingsprinzipien:
${gamePhases.ballverlust.principles.map(p => `  • ${p}`).join('\n')}

⚽ Spielform 1: 8v8 Kompakt-Verteidigen (20 Min)
- Defensivformation 4-4-2 oder 4-3-3
- Schwerpunkt: Kompaktheit und Raumdeckung
- Gegner zu Außenbahnen zwingen
- Variante: Balleroberung im Zentrum = 2 Punkte

⚽ Spielform 2: 9v9 Pressing-Trigger (25 Min)
- Pressing bei schlechtem Rückpass oder Ballkontrolle
- Schwerpunkt: Erkennen von Pressing-Momenten
- Staffelung: Vordere → Mittlere → Hintere Linie
- Variante: Ballgewinn nach Trigger = 3 Punkte

⚽ Spielform 3: 11v11 Defensiv-Taktik (20 Min)
- Vollständige Mannschaftsverteidigung
- Schwerpunkt: Raumverteidigung und Absicherung
- Integration aller Defensiv-Prinzipien`,
        intensity: weekInCycle === trainingDays.length ? 'Niedrig-Mittel' : 'Mittel-Hoch'
      },
      umschaltung_defensiv: {
        title: 'Van Gaal: Schnelles Umschalten (Wiederholung)',
        description: `🎯 Spielphase: ${gamePhases.umschaltung_defensiv.name}

📚 Trainingsprinzipien:
${gamePhases.umschaltung_defensiv.principles.map(p => `  • ${p}`).join('\n')}

⚽ Spielform 1: 7v7+GK Konter-Training (20 Min)
- Nach Ballgewinn: Schneller vertikaler Pass
- 4 Tore (2 pro Seite) für mehr Optionen
- Schwerpunkt: Tempo und Tiefe nach Ballgewinn
- Variante: Tor nach Ballgewinn in 10 Sek = 3 Punkte

⚽ Spielform 2: 8v8 Übergangs-Spielform (25 Min)
- Wechsel: Defensive → Offensive Organisation
- Schwerpunkt: Tiefe Läufe in den Raum
- Vertikales Passing bevorzugen (= 2 Zählpässe)
- Variante: Überzahl-Konter = Doppelpunkt

⚽ Spielform 3: 10v10 Komplettes Umschaltspiel (20 Min)
- Vollständiges Mannschaftstraining
- Schwerpunkt: Schnelligkeit im Umschalten
- Integration: Tiefe + Tempo + Überzahl nutzen`,
        intensity: weekInCycle === trainingDays.length ? 'Niedrig-Mittel' : 'Mittel-Hoch'
      }
    },
    defensive: {
      ballverlust: {
        title: 'Van Gaal: Defensive Spielphasen (Donnerstag)',
        description: `🎯 Spielphasen: Defensive Organization + Gegenpressing

📚 Defensiv-Prinzipien:
${gamePhases.ballverlust.principles.map(p => `  • ${p}`).join('\n')}

📚 Gegenpressing-Prinzipien:
${gamePhases.umschaltung_offensiv.principles.map(p => `  • ${p}`).join('\n')}

⚽ Spielform 1: 8v10 Unterzahl-Verteidigen (20 Min)
- Unterzahl simuliert Druck auf Defensive
- Schwerpunkt: Kompaktheit unter Druck
- Pressing-Trigger gemeinsam trainieren
- Variante: Erfolgreiche 3er-Absicherung = Punkt

⚽ Spielform 2: 9v9 Defensive mit Gegenpressing (25 Min)
- Kombination: Verteidigen + 5-Sek-Gegenpressing
- Schwerpunkt: Ballverlust sofort korrigieren
- Zonen für Pressing-Erfolg definieren
- Variante: Ballgewinn in 3 Sek in Mittelfeld = 3 Punkte

⚽ Spielform 3: 11v11 Defensiv-Taktik Spezial (25 Min)
- Vollständige Defensivformation
- Schwerpunkt: Raumverteidigung + Umschalten
- Gegner zu schwachen Bereichen lenken
- Integration: Alle defensiven Spielphasen`,
        intensity: weekInCycle === trainingDays.length ? 'Niedrig' : 'Mittel-Hoch'
      },
      umschaltung_offensiv: {
        title: 'Van Gaal: Defensive Spielphasen (Donnerstag)',
        description: `🎯 Spielphasen: Defensive Organization + Gegenpressing

📚 Defensiv-Prinzipien:
${gamePhases.ballverlust.principles.map(p => `  • ${p}`).join('\n')}

📚 Gegenpressing-Prinzipien:
${gamePhases.umschaltung_offensiv.principles.map(p => `  • ${p}`).join('\n')}

⚽ Spielform 1: 7v7 Gegenpressing Intensiv (20 Min)
- Hauptfokus: 5-Sekunden-Regel durchsetzen
- Schwerpunkt: Ballnahe Verschiebung trainieren
- Passwege aggressiv zustellen
- Variante: Team-Gegenpressing (alle laufen an) = Doppelpunkt

⚽ Spielform 2: 9v9 Pressing-Koordination (25 Min)
- Linienweises Pressing (Sturm → Mittelfeld → Abwehr)
- Schwerpunkt: Kommunikation und Timing
- Kompaktheit nach Ballverlust herstellen
- Variante: Ballgewinn durch koordiniertes Pressing = 3 Punkte

⚽ Spielform 3: 11v11 Defensiv-Gesamtkonzept (25 Min)
- Integration beider defensiver Spielphasen
- Schwerpunkt: Automatisierung der Abläufe
- Pressing-Trigger als Mannschaft erkennen`,
        intensity: weekInCycle === trainingDays.length ? 'Niedrig' : 'Mittel-Hoch'
      }
    },
    offensive: {
      ballbesitz: {
        title: 'Van Gaal: Offensive Spielphasen (Freitag)',
        description: `🎯 Spielphasen: Ballbesitz + Offensives Umschalten

📚 Ballbesitz-Prinzipien:
${gamePhases.ballbesitz.principles.map(p => `  • ${p}`).join('\n')}

📚 Offensiv-Umschalt-Prinzipien:
${gamePhases.umschaltung_defensiv.principles.map(p => `  • ${p}`).join('\n')}

⚽ Spielform 1: 8v8+2 Offensives Positionsspiel (20 Min)
- Fokus auf Raumaufteilung im Angriffsdrittel
- Schwerpunkt: Spieler zwischen den Linien
- Joker für Überzahlsituationen
- Variante: Tor nach 10 Pässen = Doppelpunkt

⚽ Spielform 2: 9v9 Ballbesitz mit Abschluss (25 Min)
- Aufbau → Durchdringen → Torabschluss
- Schwerpunkt: Geduld und finale Aktionen
- 3 Zonen durchspielen für Punkte
- Variante: Pass zwischen Linien + Tor = 3 Punkte

⚽ Spielform 3: 11v11 Offensiv-Konzept Komplett (25 Min)
- Vollständiges Angriffsspiel
- Schwerpunkt: Ballbesitz + Konter-Kombinationen
- Integration aller offensiven Prinzipien
- Torschuss-Pflicht nach max. 15 Pässen`,
        intensity: weekInCycle === trainingDays.length ? 'Niedrig-Mittel' : 'Mittel-Hoch'
      },
      umschaltung_defensiv: {
        title: 'Van Gaal: Offensive Spielphasen (Freitag)',
        description: `🎯 Spielphasen: Ballbesitz + Offensives Umschalten

📚 Ballbesitz-Prinzipien:
${gamePhases.ballbesitz.principles.map(p => `  • ${p}`).join('\n')}

📚 Offensiv-Umschalt-Prinzipien:
${gamePhases.umschaltung_defensiv.principles.map(p => `  • ${p}`).join('\n')}

⚽ Spielform 1: 7v7 Konter-Spezial (20 Min)
- Nach Ballgewinn: 10-Sekunden-Tor-Regel
- Schwerpunkt: Vertikales Passing und Tempo
- Tiefe Läufe aggressiv anbieten
- Variante: Tor in 7 Sekunden = 3 Punkte

⚽ Spielform 2: 9v9 Umschalt-Kombinationen (25 Min)
- Defensive → Offensive in 3 Pässen
- Schwerpunkt: Überzahl im Konter nutzen
- 4 Tore für variable Angriffe
- Variante: Konter mit 3-Mann-Überzahl = Doppelpunkt

⚽ Spielform 3: 11v11 Offensiv-Gesamtkonzept (25 Min)
- Integration: Ballbesitz + Konter
- Schwerpunkt: Variabler Angriff
- Automatisierung der offensiven Abläufe`,
        intensity: weekInCycle === trainingDays.length ? 'Niedrig-Mittel' : 'Mittel-Hoch'
      }
    }
  };

  // Determine which session to return based on day template
  const templateType = dayTemplates[day] || 'repetition';
  
  if (templateType === 'repetition') {
    // Cycle through all 4 phases on repetition days
    const phaseKeys = Object.keys(sessions.repetition);
    const phaseIndex = (weekInCycle - 1) % phaseKeys.length;
    const phaseKey = phaseKeys[phaseIndex];
    return sessions.repetition[phaseKey];
  } else if (templateType === 'defensive') {
    // Alternate between defensive phases
    const defensivePhases = ['ballverlust', 'umschaltung_offensiv'];
    const phaseIndex = (weekInCycle - 1) % defensivePhases.length;
    return sessions.defensive[defensivePhases[phaseIndex]];
  } else if (templateType === 'offensive') {
    // Alternate between offensive phases
    const offensivePhases = ['ballbesitz', 'umschaltung_defensiv'];
    const phaseIndex = (weekInCycle - 1) % offensivePhases.length;
    return sessions.offensive[offensivePhases[phaseIndex]];
  }
}

function generateVanGaalPlan(startDate, weeks, trainingDays = ['Dienstag', 'Donnerstag', 'Freitag']) {
  const mesoName = `Van Gaal Taktiksystem ${new Date(startDate).toLocaleDateString('de-DE')}`;
  const description = `Periodisierter ${weeks}-Wochen Trainingsplan basierend auf Van Gaal's 4 Spielphasen:\n\n` +
    `1. ${gamePhases.ballbesitz.name}\n` +
    `2. ${gamePhases.umschaltung_offensiv.name}\n` +
    `3. ${gamePhases.ballverlust.name}\n` +
    `4. ${gamePhases.umschaltung_defensiv.name}\n\n` +
    `Trainingstage: ${trainingDays.join(', ')}\n` +
    `Jeder Tag hat einen spezifischen Fokus nach Van Gaal-Prinzipien.\n\n` +
    `Basiert auf taktischer Periodisierung nach Louis van Gaal.`;

  const microPlans = [];
  const start = new Date(startDate);

  // Calculate end date
  const endDate = new Date(start);
  endDate.setDate(endDate.getDate() + (weeks * 7) - 1);

  // Map German day names to day numbers
  const dayMap = {
    'Montag': 1,
    'Dienstag': 2,
    'Mittwoch': 3,
    'Donnerstag': 4,
    'Freitag': 5,
    'Samstag': 6,
    'Sonntag': 0
  };

  // Generate micro plans for each week
  for (let week = 0; week < weeks; week++) {
    const isRecoveryWeek = weeks >= 4 && week === weeks - 1;
    
    trainingDays.forEach((day, dayIndex) => {
      const dayNumber = dayMap[day];
      const sessionDate = new Date(start);
      sessionDate.setDate(sessionDate.getDate() + (week * 7));
      
      // Find the next occurrence of the training day
      const currentDay = sessionDate.getDay();
      const daysUntilTraining = (dayNumber - currentDay + 7) % 7;
      sessionDate.setDate(sessionDate.getDate() + daysUntilTraining);

      // Generate session based on Van Gaal methodology
      const phaseRotation = (week * trainingDays.length + dayIndex) % 4;
      const session = generateVanGaalSession(phaseRotation, day, week + 1, trainingDays);

      let finalDescription = session.description;
      if (isRecoveryWeek) {
        finalDescription = `🔄 REGENERATIONSWOCHE - Reduzierte Belastung (70% Volumen)\n\n` + finalDescription;
      }

      microPlans.push({
        date: sessionDate.toISOString().split('T')[0],
        session_type: session.title,
        description: finalDescription,
        duration_minutes: isRecoveryWeek ? 60 : 75,
        intensity: session.intensity
      });
    });
  }

  return {
    mesoName,
    startDate: start.toISOString().split('T')[0],
    endDate: endDate.toISOString().split('T')[0],
    focus: 'Van Gaal Taktiksystem',
    description,
    microPlans
  };
}

module.exports = {
  generateVanGaalPlan,
  gamePhases,
  dayTemplates
};
