const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
const db = require('./database');
const { generateScientificTrainingPlan } = require('./scientificPlanGenerator');
const { generatePositionSpecificPlan } = require('./positionSpecificGenerator');
const { generateVerheijenPlan } = require('./verheijenGenerator');
const { generateVanGaalPlan } = require('./vanGaalGenerator');

const app = express();
const PORT = process.env.PORT || 5000;

// Rate limiting to prevent abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // Limit each IP to 50 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

// Middleware
// Restrict CORS to specific origin in production
const corsOptions = {
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api/', limiter);

// ===== PLAYERS ROUTES =====

// Get all players
app.get('/api/players', (req, res) => {
  db.all('SELECT * FROM players ORDER BY name', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Get single player
app.get('/api/players/:id', (req, res) => {
  db.get('SELECT * FROM players WHERE id = ?', [req.params.id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(row);
  });
});

// Create player
app.post('/api/players', (req, res) => {
  const { name, position, status, notes } = req.body;
  db.run(
    'INSERT INTO players (name, position, status, notes) VALUES (?, ?, ?, ?)',
    [name, position, status || 'active', notes],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: this.lastID, name, position, status, notes });
    }
  );
});

// Update player
app.put('/api/players/:id', (req, res) => {
  const { name, position, status, notes } = req.body;
  db.run(
    'UPDATE players SET name = ?, position = ?, status = ?, notes = ? WHERE id = ?',
    [name, position, status, notes, req.params.id],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: req.params.id, name, position, status, notes });
    }
  );
});

// Delete player
app.delete('/api/players/:id', (req, res) => {
  db.run('DELETE FROM players WHERE id = ?', [req.params.id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ deleted: this.changes });
  });
});

// ===== MESO PLANS ROUTES =====

// Get all meso plans
app.get('/api/meso-plans', (req, res) => {
  db.all('SELECT * FROM meso_plans ORDER BY start_date DESC', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Get single meso plan
app.get('/api/meso-plans/:id', (req, res) => {
  db.get('SELECT * FROM meso_plans WHERE id = ?', [req.params.id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(row);
  });
});

// Create meso plan
app.post('/api/meso-plans', (req, res) => {
  const { name, start_date, end_date, focus, description } = req.body;
  db.run(
    'INSERT INTO meso_plans (name, start_date, end_date, focus, description) VALUES (?, ?, ?, ?, ?)',
    [name, start_date, end_date, focus, description],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: this.lastID, name, start_date, end_date, focus, description });
    }
  );
});

// Update meso plan
app.put('/api/meso-plans/:id', (req, res) => {
  const { name, start_date, end_date, focus, description } = req.body;
  db.run(
    'UPDATE meso_plans SET name = ?, start_date = ?, end_date = ?, focus = ?, description = ? WHERE id = ?',
    [name, start_date, end_date, focus, description, req.params.id],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: req.params.id, name, start_date, end_date, focus, description });
    }
  );
});

// Delete meso plan
app.delete('/api/meso-plans/:id', (req, res) => {
  db.run('DELETE FROM meso_plans WHERE id = ?', [req.params.id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ deleted: this.changes });
  });
});

// ===== MICRO PLANS ROUTES =====

// Get all micro plans
app.get('/api/micro-plans', (req, res) => {
  const { meso_plan_id } = req.query;
  let query = 'SELECT * FROM micro_plans';
  let params = [];
  
  if (meso_plan_id) {
    query += ' WHERE meso_plan_id = ?';
    params.push(meso_plan_id);
  }
  
  query += ' ORDER BY date DESC';
  
  db.all(query, params, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Get single micro plan
app.get('/api/micro-plans/:id', (req, res) => {
  db.get('SELECT * FROM micro_plans WHERE id = ?', [req.params.id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(row);
  });
});

// Create micro plan
app.post('/api/micro-plans', (req, res) => {
  const { meso_plan_id, date, session_type, focus, duration, intensity, description } = req.body;
  db.run(
    'INSERT INTO micro_plans (meso_plan_id, date, session_type, focus, duration, intensity, description) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [meso_plan_id, date, session_type, focus, duration, intensity, description],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: this.lastID, meso_plan_id, date, session_type, focus, duration, intensity, description });
    }
  );
});

// Update micro plan
app.put('/api/micro-plans/:id', (req, res) => {
  const { meso_plan_id, date, session_type, focus, duration, intensity, description } = req.body;
  db.run(
    'UPDATE micro_plans SET meso_plan_id = ?, date = ?, session_type = ?, focus = ?, duration = ?, intensity = ?, description = ? WHERE id = ?',
    [meso_plan_id, date, session_type, focus, duration, intensity, description, req.params.id],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: req.params.id, meso_plan_id, date, session_type, focus, duration, intensity, description });
    }
  );
});

// Delete micro plan
app.delete('/api/micro-plans/:id', (req, res) => {
  db.run('DELETE FROM micro_plans WHERE id = ?', [req.params.id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ deleted: this.changes });
  });
});

// ===== PLAYER INDIVIDUALIZATIONS ROUTES =====

// Get all individualizations
app.get('/api/individualizations', (req, res) => {
  const { player_id, active } = req.query;
  let query = `
    SELECT pi.*, p.name as player_name 
    FROM player_individualizations pi
    LEFT JOIN players p ON pi.player_id = p.id
    WHERE 1=1
  `;
  let params = [];
  
  if (player_id) {
    query += ' AND pi.player_id = ?';
    params.push(player_id);
  }
  
  if (active !== undefined) {
    query += ' AND pi.active = ?';
    params.push(active);
  }
  
  query += ' ORDER BY pi.start_date DESC';
  
  db.all(query, params, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Get single individualization
app.get('/api/individualizations/:id', (req, res) => {
  db.get('SELECT * FROM player_individualizations WHERE id = ?', [req.params.id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(row);
  });
});

// Create individualization
app.post('/api/individualizations', (req, res) => {
  const { player_id, micro_plan_id, reason, modification, start_date, end_date, active } = req.body;
  db.run(
    'INSERT INTO player_individualizations (player_id, micro_plan_id, reason, modification, start_date, end_date, active) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [player_id, micro_plan_id, reason, modification, start_date, end_date, active !== undefined ? active : 1],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: this.lastID, player_id, micro_plan_id, reason, modification, start_date, end_date, active });
    }
  );
});

// Update individualization
app.put('/api/individualizations/:id', (req, res) => {
  const { player_id, micro_plan_id, reason, modification, start_date, end_date, active } = req.body;
  db.run(
    'UPDATE player_individualizations SET player_id = ?, micro_plan_id = ?, reason = ?, modification = ?, start_date = ?, end_date = ?, active = ? WHERE id = ?',
    [player_id, micro_plan_id, reason, modification, start_date, end_date, active, req.params.id],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: req.params.id, player_id, micro_plan_id, reason, modification, start_date, end_date, active });
    }
  );
});

// Delete individualization
app.delete('/api/individualizations/:id', (req, res) => {
  db.run('DELETE FROM player_individualizations WHERE id = ?', [req.params.id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ deleted: this.changes });
  });
});

// ===== EVENTS ROUTES =====

// Get all events
app.get('/api/events', (req, res) => {
  db.all('SELECT * FROM events ORDER BY date DESC', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Get single event
app.get('/api/events/:id', (req, res) => {
  db.get('SELECT * FROM events WHERE id = ?', [req.params.id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(row);
  });
});

// Create event
app.post('/api/events', (req, res) => {
  const { name, type, date, location, opponent, importance, notes } = req.body;
  db.run(
    'INSERT INTO events (name, type, date, location, opponent, importance, notes) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [name, type, date, location, opponent, importance, notes],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: this.lastID, name, type, date, location, opponent, importance, notes });
    }
  );
});

// Update event
app.put('/api/events/:id', (req, res) => {
  const { name, type, date, location, opponent, importance, notes } = req.body;
  db.run(
    'UPDATE events SET name = ?, type = ?, date = ?, location = ?, opponent = ?, importance = ?, notes = ? WHERE id = ?',
    [name, type, date, location, opponent, importance, notes, req.params.id],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: req.params.id, name, type, date, location, opponent, importance, notes });
    }
  );
});

// Delete event
app.delete('/api/events/:id', (req, res) => {
  db.run('DELETE FROM events WHERE id = ?', [req.params.id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ deleted: this.changes });
  });
});

// ===== AUTO-GENERATION ROUTES =====

// Generate scientifically sound training plan (meso + micro) based on periodization principles
app.post('/api/generate-plan', (req, res) => {
  const { start_date, weeks, focus, position, methodology, training_days } = req.body;
  
  if (!start_date || !weeks) {
    res.status(400).json({ error: 'start_date and weeks are required' });
    return;
  }

  // Calculate end date
  const startDate = new Date(start_date);
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + (weeks * 7));

  // Determine methodology and type
  const useVerheijen = methodology === 'verheijen';
  const useVanGaal = methodology === 'vangaal';
  const isPositionSpecific = position && position !== 'Alle';
  const planType = isPositionSpecific ? position : (focus || 'Kondition');
  
  // Handle Van Gaal methodology separately (doesn't use database insertion in same way)
  if (useVanGaal) {
    const trainingDays = training_days || ['Dienstag', 'Donnerstag', 'Freitag'];
    const vanGaalPlan = generateVanGaalPlan(start_date, weeks, trainingDays);
    
    db.run(
      'INSERT INTO meso_plans (name, start_date, end_date, focus, description) VALUES (?, ?, ?, ?, ?)',
      [vanGaalPlan.mesoName, vanGaalPlan.startDate, vanGaalPlan.endDate, vanGaalPlan.focus, vanGaalPlan.description],
      function(err) {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        
        const mesoPlanId = this.lastID;
        
        // Insert all micro plans
        const insertPromises = vanGaalPlan.microPlans.map(microPlan => {
          return new Promise((resolve, reject) => {
            db.run(
              'INSERT INTO micro_plans (meso_plan_id, date, session_type, description, duration, intensity) VALUES (?, ?, ?, ?, ?, ?)',
              [mesoPlanId, microPlan.date, microPlan.session_type, microPlan.description, microPlan.duration_minutes, microPlan.intensity],
              function(err) {
                if (err) reject(err);
                else resolve({ id: this.lastID });
              }
            );
          });
        });
        
        Promise.all(insertPromises)
          .then(() => {
            res.json({
              meso_plan_id: mesoPlanId,
              micro_plans_created: vanGaalPlan.microPlans.length,
              details: {
                type: 'Van Gaal Taktiksystem',
                methodology: 'Louis van Gaal (4 Spielphasen)',
                periodization: 'Taktische Periodisierung nach Spielphasen',
                training_days: trainingDays.join(', '),
                focus: 'Van Gaal Spielphasen',
                scientific_base: 'Van Gaal: 4 Spielphasen (Ballbesitz, Umschaltung offensiv, Ballverlust, Umschaltung defensiv) mit tagesspezifischen Schwerpunkten'
              }
            });
          })
          .catch(err => {
            res.status(500).json({ error: err.message });
          });
      }
    );
    return;
  }
  
  const mesoName = useVerheijen
    ? `${position || 'Team'}-Verheijen-Plan ${startDate.toLocaleDateString('de-DE')}`
    : isPositionSpecific 
      ? `${position}-Trainingsplan ${startDate.toLocaleDateString('de-DE')}`
      : `${planType}-Mesozyklus ${startDate.toLocaleDateString('de-DE')}`;
  
  // Create meso plan with methodology-specific description
  const description = useVerheijen
    ? `Fußballspezifischer ${weeks}-Wochen Trainingsplan nach Raymond Verheijen (Niederländische Schule) für ${position || 'alle Positionen'}: Spielformen statt isolierte Übungen, fußballspezifisches Konditionstraining, taktische Periodisierung mit mehreren Varianten pro Trainingsform.`
    : isPositionSpecific
      ? `Positionsspezifischer ${weeks}-Wochen Trainingsplan für ${position} nach trainingswissenschaftlichen Prinzipien: Progressive Belastungssteigerung, systematische Regenerationsphasen, positions-spezifische Schwerpunkte (Technik, Taktik, Athletik).`
      : `Periodisierter ${weeks}-Wochen Mesozyklus nach trainingswissenschaftlichen Prinzipien: Progressive Belastungssteigerung, systematische Regenerationsphasen (Superkompensation), fokussierte ${planType}-Entwicklung. Basiert auf Periodisierungsmodellen nach Bompa & Haff.`;
  
  db.run(
    'INSERT INTO meso_plans (name, start_date, end_date, focus, description) VALUES (?, ?, ?, ?, ?)',
    [mesoName, start_date, endDate.toISOString().split('T')[0], planType, description],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }

      const mesoPlanId = this.lastID;
      
      // Select generator based on methodology
      let generatorPromise;
      if (useVerheijen) {
        // Verheijen methodology requires position
        const verheijenPosition = position || 'Mittelfeld';
        generatorPromise = generateVerheijenPlan(mesoPlanId, startDate, weeks, verheijenPosition, db);
      } else if (isPositionSpecific) {
        generatorPromise = generatePositionSpecificPlan(mesoPlanId, startDate, weeks, position, db);
      } else {
        generatorPromise = generateScientificTrainingPlan(mesoPlanId, startDate, weeks, planType, db);
      }
      
      generatorPromise
        .then(result => {
          res.json({
            meso_plan_id: mesoPlanId,
            ...result,
            details: {
              type: useVerheijen ? 'Verheijen-Methode (Spielformen)' : (isPositionSpecific ? 'Positionsspezifisch' : 'Allgemeine Periodisierung'),
              methodology: useVerheijen ? 'Raymond Verheijen (Niederländisch)' : 'Bompa & Haff',
              periodization: useVerheijen ? 'Taktische Periodisierung mit Spielformen' : 'Progressives Belastungsmodell mit Regenerationswochen',
              load_recovery_ratio: `${result.load_weeks}:${result.recovery_weeks}`,
              focus: planType,
              position: isPositionSpecific || useVerheijen ? (position || 'Alle Positionen') : 'Alle Positionen',
              scientific_base: useVerheijen 
                ? 'Verheijen: Fußballspezifisches Training, keine isolierten Übungen, Spielformen mit Varianten'
                : 'Trainingsprinzipien: Progressive Overload, Supercompensation, Specificity, Variation'
            }
          });
        })
        .catch(err => {
          res.status(500).json({ error: err.message });
        });
    }
  );
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
