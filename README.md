# Fußball Trainingsplanung Web-Anwendung

Eine vollständige Web-Anwendung für die Trainingsplanung einer Fußballmannschaft mit Meso- und Mikroplanung sowie Individualisierungsmöglichkeiten für einzelne Spieler.

## Features

- **Spielerverwaltung**: Verwalten Sie Ihre Spieler mit Status (aktiv, verletzt, inaktiv)
- **Mesoplanung**: Mittelfristige Trainingsplanung (Wochen bis Monate)
- **Mikroplanung**: Kurzfristige, detaillierte Trainingsplanung (einzelne Sessions)
- **Individualisierung**: Spezielle Anpassungen für einzelne Spieler bei Krankheit, Verletzung oder besonderen Anforderungen
- **Events**: Verwaltung von Spielen, Turnieren und anderen wichtigen Terminen
- **Dashboard**: Übersicht über alle wichtigen Kennzahlen und kommende Events

## Installation und Start

### Voraussetzungen
- Node.js (Version 14 oder höher)
- npm

### Konfiguration (Optional)

Die Anwendung kann über Umgebungsvariablen konfiguriert werden:

**Backend** (`.env` im Hauptverzeichnis):
```
PORT=5000
CLIENT_URL=http://localhost:3000
```

**Frontend** (`client/.env`):
```
REACT_APP_API_URL=http://localhost:5000/api
```

Beispieldateien sind als `.env.example` vorhanden.

### Backend starten

1. Installieren Sie die Abhängigkeiten:
```bash
npm install
```

2. (Optional) Kopieren Sie die Beispielkonfiguration:
```bash
cp .env.example .env
```

3. Starten Sie den Backend-Server:
```bash
npm run server
```

Der Server läuft auf `http://localhost:5000`

### Frontend starten

1. Wechseln Sie in den client-Ordner:
```bash
cd client
```

2. Installieren Sie die Abhängigkeiten:
```bash
npm install
```

3. (Optional) Kopieren Sie die Beispielkonfiguration:
```bash
cp .env.example .env
```

4. Starten Sie die React-Anwendung:
```bash
npm start
```

Die Anwendung läuft auf `http://localhost:3000`

## Verwendung

### Erste Schritte

1. **Spieler anlegen**: Navigieren Sie zu "Spieler" und fügen Sie Ihre Mannschaftsmitglieder hinzu
2. **Mesoplan erstellen**: Erstellen Sie einen mittelfristigen Trainingsplan (z.B. Vorbereitungsphase)
3. **Mikropläne hinzufügen**: Fügen Sie detaillierte Trainings-Sessions hinzu
4. **Events planen**: Tragen Sie wichtige Spiele und Turniere ein
5. **Individualisierungen**: Bei Bedarf können Sie für einzelne Spieler Anpassungen vornehmen

### Datenbank

Die Anwendung verwendet SQLite als Datenbank. Die Datenbankdatei (`footiplanung.db`) wird automatisch beim ersten Start des Servers im `server`-Ordner erstellt.

## Technologien

- **Backend**: Node.js, Express, SQLite
- **Frontend**: React, Axios
- **Styling**: CSS

## Struktur

```
footiplanung/
├── server/
│   ├── database.js      # Datenbankinitialisierung
│   └── index.js         # Express Server & API Routes
├── client/
│   └── src/
│       ├── components/  # React Komponenten
│       ├── App.js       # Hauptkomponente
│       └── App.css      # Styling
├── package.json
└── README.md
```

## API Endpoints

- `GET/POST/PUT/DELETE /api/players` - Spielerverwaltung
- `GET/POST/PUT/DELETE /api/meso-plans` - Mesopläne
- `GET/POST/PUT/DELETE /api/micro-plans` - Mikropläne
- `GET/POST/PUT/DELETE /api/individualizations` - Individualisierungen
- `GET/POST/PUT/DELETE /api/events` - Events

## Sicherheit

Die Anwendung implementiert folgende Sicherheitsmaßnahmen:

- **Rate Limiting**: API-Endpunkte sind auf 50 Anfragen pro 15 Minuten beschränkt
- **CORS**: Cross-Origin-Requests sind auf konfigurierte Ursprünge beschränkt
- **Sichere Abhängigkeiten**: Alle Pakete wurden auf bekannte Sicherheitslücken geprüft

Für Produktionsumgebungen wird empfohlen:
- HTTPS verwenden
- Umgebungsvariablen für sensible Konfigurationen nutzen
- Authentifizierung/Autorisierung hinzufügen
- Regelmäßige Sicherheitsupdates durchführen

## Lizenz

ISC