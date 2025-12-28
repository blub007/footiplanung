/**
 * Macro Plan Importer
 * Parses macro planning data (weekly structure with game phases and principles)
 * and generates detailed meso and micro plans
 */

// Van Gaal game phases descriptions
const gamePhases = {
  'S1+2': {
    name: 'Offensive Spielphasen',
    phase1: 'Phase 1: Eigener Ballbesitz - Gegner geordnet',
    phase2: 'Phase 2: Umschalten bei Ballverlust',
    description: 'Fokus auf Ballbesitz und schnelles Gegenpressing nach Ballverlust.'
  },
  'S3+4': {
    name: 'Defensive Spielphasen',
    phase3: 'Phase 3: Gegnerischer Ballbesitz - Eigene Mannschaft geordnet',
    phase4: 'Phase 4: Umschalten nach Ballgewinn',
    description: 'Fokus auf defensive Organisation und schnelles Umschalten nach Ballgewinn.'
  }
};

// Game principles catalog (Van Gaal)
const gamePrinciples = {
  'P1': 'In größtmöglichen Räumen auf Schnittstelle anbieten',
  'P2': 'Laufwege links und rechts vom Ballführenden anbieten',
  'P3': 'Gegner binden, Partner freispielen',
  'P4': 'Gegengleiche Laufwege',
  'P5': 'Spielbereite Körperhaltung',
  'P6': 'Freie Räume erkennen und besetzen',
  'P7': 'Diagonales und vertikales Passing bevorzugen',
  'P8': 'Tempo im Ballbesitz variieren',
  'P9': 'Gegenpressing oder Räume verengen oder Passwege/Räume schließen',
  'P10': 'Die Linie zwischen Ball und eigenem Tor schließen',
  'P11': 'Nach Ballverlust sofort Passwege zustellen',
  'P12': 'Enge Abstände zueinander halten',
  'P13': 'Ball- und tornäher als der Gegner stehen',
  'P14': 'Ballnah schiebt vor, Ballfern kippt ab bzw. "schwimmende" Positionen',
  'P15': 'Kompakte Formation halten',
  'P16': 'Räume statt Spieler verteidigen',
  'P17': 'Pressing-Trigger erkennen und nutzen',
  'P18': 'Erster Blick nach vorne, erste Aktion sicher',
  'P19': 'Im höchstmöglichem Tempo bleiben',
  'P20': 'Tiefe Läufe in den Raum'
};

/**
 * Parse macro plan data and generate meso/micro plans
 * @param {Object} macroData - Structure: { month: string, weeks: Array<{week, phases, principles}> }
 * @param {string} startDate - Starting date for the plan (YYYY-MM-DD)
 * @returns {Object} { mesoPlans: [], microPlans: [] }
 */
function generateFromMacro(macroData, startDate) {
  const mesoPlans = [];
  const microPlans = [];
  
  let currentDate = new Date(startDate);
  let weekCounter = 0;
  
  for (const monthData of macroData) {
    const { month, weeks } = monthData;
    
    for (const weekData of weeks) {
      const { week, phases, principles } = weekData;
      weekCounter++;
      
      // Calculate week start (Monday) and end (Sunday)
      const weekStart = new Date(currentDate);
      const weekEnd = new Date(currentDate);
      weekEnd.setDate(weekEnd.getDate() + 6);
      
      // Create Meso Plan for this week
      const phasesData = gamePhases[phases] || gamePhases['S1+2'];
      const mesoName = `${month} - Woche ${week}`;
      const mesoDescription = `${phasesData.name}\n\n${phasesData.phase1 || phasesData.phase3}\n${phasesData.phase2 || phasesData.phase4}\n\n📋 Spielprinzipien: ${principles}\n${formatPrinciples(principles)}\n\n${phasesData.description}`;
      
      const mesoPlan = {
        name: mesoName,
        start_date: weekStart.toISOString().split('T')[0],
        end_date: weekEnd.toISOString().split('T')[0],
        focus: phases,
        description: mesoDescription
      };
      
      mesoPlans.push(mesoPlan);
      
      // Generate Micro Plans for this week (Tuesday, Thursday, Friday)
      const trainingDays = [
        { day: 'Dienstag', offset: 1, focus: 'Haupttraining', intensity: 'Hoch' },
        { day: 'Donnerstag', offset: 3, focus: 'Wiederholung + Intensivierung', intensity: 'Mittel-Hoch' },
        { day: 'Freitag', offset: 4, focus: 'Spielvorbereitung', intensity: 'Mittel' }
      ];
      
      for (const trainingDay of trainingDays) {
        const trainingDate = new Date(weekStart);
        trainingDate.setDate(trainingDate.getDate() + trainingDay.offset);
        
        const microPlan = generateMicroPlan(
          trainingDate,
          trainingDay,
          phases,
          principles,
          weekCounter
        );
        
        // Add meso_plan_id placeholder - will be filled after meso plan is created
        microPlan.meso_plan_placeholder = mesoName;
        microPlans.push(microPlan);
      }
      
      // Move to next week
      currentDate.setDate(currentDate.getDate() + 7);
    }
  }
  
  return { mesoPlans, microPlans };
}

/**
 * Generate a single micro plan for a training day
 */
function generateMicroPlan(date, trainingDay, phases, principles, weekNumber) {
  const phasesData = gamePhases[phases] || gamePhases['S1+2'];
  const isOffensive = phases === 'S1+2';
  
  let sessionType, sessionDescription;
  
  if (trainingDay.day === 'Dienstag') {
    // Tuesday: Main training - detailed work on game phases
    sessionType = `${trainingDay.day}: ${phasesData.name}`;
    sessionDescription = generateDetailedSession(phases, principles, 'detailed');
  } else if (trainingDay.day === 'Donnerstag') {
    // Thursday: Repetition with intensity
    sessionType = `${trainingDay.day}: Wiederholung + Intensivierung`;
    sessionDescription = generateDetailedSession(phases, principles, 'repetition');
  } else {
    // Friday: Match preparation
    sessionType = `${trainingDay.day}: Spielvorbereitung`;
    sessionDescription = generateDetailedSession(phases, principles, 'matchprep');
  }
  
  return {
    date: date.toISOString().split('T')[0],
    type: sessionType,
    focus: phasesData.name,
    intensity: trainingDay.intensity,
    duration: '90',
    description: sessionDescription
  };
}

/**
 * Generate detailed session description based on session type
 */
function generateDetailedSession(phases, principles, sessionType) {
  const phasesData = gamePhases[phases] || gamePhases['S1+2'];
  const isOffensive = phases === 'S1+2';
  const principlesText = formatPrinciples(principles);
  
  let description = `**${phasesData.name}**\n\n`;
  description += `${phasesData.phase1 || phasesData.phase3}\n`;
  description += `${phasesData.phase2 || phasesData.phase4}\n\n`;
  description += `**🎯 Spielprinzipien:**\n${principlesText}\n\n`;
  
  if (sessionType === 'detailed') {
    // Tuesday: Detailed main training
    description += `**📋 Trainingsaufbau:**\n\n`;
    description += `**1. Aufwärmen (15 Min)**\n`;
    description += `- Dynamisches Aufwärmen mit Ball\n`;
    description += `- Aktivierung der Spielprinzipien\n`;
    description += `- Rondo 5v2 mit Fokus auf ${isOffensive ? 'schnelles Passspiel' : 'Positionierung'}\n\n`;
    
    description += `**2. Hauptteil I - Technisch-Taktisch (30 Min)**\n`;
    if (isOffensive) {
      description += `- 8v8+2 Positionsspiel: ${principlesText.split('\n')[0]}\n`;
      description += `- Spielfeld: 40x30m, Joker außen\n`;
      description += `- Regel: Mindestens 8 Pässe vor Torchance\n\n`;
      
      description += `🎯 **Varianten:**\n`;
      description += `- Var 1: Nach 6 Pässen Zonenwechsel Pflicht\n`;
      description += `- Var 2: Vertikaler Pass = 2 Zählpässe\n`;
      description += `- Var 3: Zeitlimit 3 Sek. pro Ballkontakt\n\n`;
    } else {
      description += `- 9v9 Defensiv-Spielform: ${principlesText.split('\n')[0]}\n`;
      description += `- Spielfeld: 50x40m mit Pressing-Zonen\n`;
      description += `- Regel: Pressing-Trigger bei Rückpass\n\n`;
      
      description += `🎯 **Varianten:**\n`;
      description += `- Var 1: Hoher Block (Mittellinie)\n`;
      description += `- Var 2: Mittlerer Block (30m-Linie)\n`;
      description += `- Var 3: Tiefer Block (16m-Raum)\n\n`;
    }
    
    description += `**3. Hauptteil II - Spielform (35 Min)**\n`;
    description += `- 11v11 auf großes Feld\n`;
    description += `- Integration aller Spielphasen und Prinzipien\n`;
    description += `- Coaching: Aktive Korrektur durch Trainer\n`;
    description += `- Videostopps bei kritischen Situationen\n\n`;
    
    description += `**4. Abschluss (10 Min)**\n`;
    description += `- Cool-Down mit leichtem Passspiel\n`;
    description += `- Kurze Reflexion der Prinzipien\n`;
    description += `- Ausblick auf nächste Einheit\n`;
    
  } else if (sessionType === 'repetition') {
    // Thursday: Repetition with higher intensity
    description += `**📋 Trainingsaufbau:**\n\n`;
    description += `**1. Aufwärmen (10 Min)**\n`;
    description += `- Schnelles Rondo 6v3\n`;
    description += `- Hohes Tempo, kurze Ballkontakte\n\n`;
    
    description += `**2. Wiederholung + Intensivierung (40 Min)**\n`;
    if (isOffensive) {
      description += `- 9v9+1 mit hohem Tempo\n`;
      description += `- 5-Sekunden-Regel für Torschuss nach Ballgewinn\n`;
      description += `- Schnelles Umschalten und Gegenpressing\n\n`;
    } else {
      description += `- 10v10 mit schnellen Umschaltsituationen\n`;
      description += `- Defensive Kompaktheit und sofortiges Pressing\n`;
      description += `- Schnelles Umschalten nach Ballgewinn\n\n`;
    }
    
    description += `**3. Spielform mit Wettkampfcharakter (30 Min)**\n`;
    description += `- 11v11 - Turniermodus (2x12 Min)\n`;
    description += `- Hohe Intensität, Simulation Wettkampf\n`;
    description += `- Fokus auf Automatisierung der Prinzipien\n\n`;
    
    description += `**4. Abschluss (10 Min)**\n`;
    description += `- Auslaufen und Stretching\n`;
    description += `- Mentale Vorbereitung auf Spiel\n`;
    
  } else {
    // Friday: Match preparation
    description += `**📋 Trainingsaufbau:**\n\n`;
    description += `**1. Aktivierung (10 Min)**\n`;
    description += `- Leichtes Aufwärmen mit Ball\n`;
    description += `- Kurzes Rondo 7v2\n\n`;
    
    description += `**2. Spielvorbereitung (35 Min)**\n`;
    description += `- 11v11 auf großes Feld\n`;
    description += `- Niedrige bis mittlere Intensität\n`;
    description += `- Fokus: Automatisierung und Timing\n`;
    description += `- Simulation von Spielsituationen\n\n`;
    
    description += `**3. Standards + Set Pieces (20 Min)**\n`;
    description += `- Offensiv-Standards (Ecken, Freistöße)\n`;
    description += `- Defensiv-Standards (Positionierung)\n`;
    description += `- Letzte taktische Absprachen\n\n`;
    
    description += `**4. Abschluss (15 Min)**\n`;
    description += `- Torschussübung (individuell)\n`;
    description += `- Regeneration und Stretching\n`;
    description += `- Team-Besprechung: Fokus für Spiel\n\n`;
    
    description += `**🎯 Ziel:** Mentale und taktische Vorbereitung auf das Wochenendspiel.\n`;
  }
  
  return description;
}

/**
 * Format principles (e.g., "P1+9") into readable text
 */
function formatPrinciples(principlesStr) {
  if (!principlesStr) return '';
  
  // Extract principle numbers (e.g., "P1+9" -> ["P1", "P9"])
  const matches = principlesStr.match(/P\d+/g);
  if (!matches) return principlesStr;
  
  const descriptions = matches.map(p => {
    const desc = gamePrinciples[p];
    return desc ? `${p}: ${desc}` : p;
  });
  
  return descriptions.join('\n');
}

/**
 * Parse text-based macro plan (from comment format)
 */
function parseMacroText(text) {
  const months = [];
  const lines = text.split('\n').map(l => l.trim()).filter(l => l);
  
  let currentMonth = null;
  let currentWeeks = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Detect month header
    if (/^(Januar|Februar|März|April|Mai|Juni|Juli|August|September|Oktober|November|Dezember)/.test(line)) {
      // Save previous month if exists
      if (currentMonth && currentWeeks.length > 0) {
        months.push({ month: currentMonth, weeks: currentWeeks });
      }
      currentMonth = line;
      currentWeeks = [];
      continue;
    }
    
    // Detect week headers (Woche 1, Woche 2, etc.)
    if (/^Woche \d/.test(line)) {
      continue; // Skip header row
    }
    
    // Parse week data
    if (line.startsWith('"S') || line.startsWith('S')) {
      // This is a phases line
      const phases = line.match(/S\d\+\d/)?.[0] || 'S1+2';
      const nextLine = lines[i + 1];
      const principles = nextLine && nextLine.match(/P\d+(?:\+P\d+)*/)?.[0] || '';
      
      currentWeeks.push({
        week: currentWeeks.length + 1,
        phases: phases,
        principles: principles
      });
      
      // Skip next line if it contains principles
      if (nextLine && /P\d+/.test(nextLine)) {
        i++;
      }
    }
  }
  
  // Save last month
  if (currentMonth && currentWeeks.length > 0) {
    months.push({ month: currentMonth, weeks: currentWeeks });
  }
  
  return months;
}

module.exports = {
  generateFromMacro,
  parseMacroText,
  gamePhases,
  gamePrinciples
};
