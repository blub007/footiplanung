const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'footiplanung.db');
const db = new sqlite3.Database(dbPath);

// Initialize database tables
db.serialize(() => {
  // Players table
  db.run(`
    CREATE TABLE IF NOT EXISTS players (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      position TEXT,
      status TEXT DEFAULT 'active',
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Meso plans (medium-term planning: weeks to months)
  db.run(`
    CREATE TABLE IF NOT EXISTS meso_plans (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      start_date DATE NOT NULL,
      end_date DATE NOT NULL,
      focus TEXT,
      description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Micro plans (short-term planning: daily to weekly)
  db.run(`
    CREATE TABLE IF NOT EXISTS micro_plans (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      meso_plan_id INTEGER,
      date DATE NOT NULL,
      session_type TEXT,
      focus TEXT,
      duration INTEGER,
      intensity TEXT,
      description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (meso_plan_id) REFERENCES meso_plans(id)
    )
  `);

  // Player individualizations (injuries, illness, specific adjustments)
  db.run(`
    CREATE TABLE IF NOT EXISTS player_individualizations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      player_id INTEGER NOT NULL,
      micro_plan_id INTEGER,
      reason TEXT,
      modification TEXT,
      start_date DATE NOT NULL,
      end_date DATE,
      active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (player_id) REFERENCES players(id),
      FOREIGN KEY (micro_plan_id) REFERENCES micro_plans(id)
    )
  `);

  // Events (games, tournaments, highlights)
  db.run(`
    CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      date DATE NOT NULL,
      location TEXT,
      opponent TEXT,
      importance TEXT,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  console.log('Database initialized successfully');
});

module.exports = db;
