import Database from 'better-sqlite3'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

const carpetaServer = path.dirname(fileURLToPath(import.meta.url))
const carpetaDb = path.join(carpetaServer, '..', 'database')

if (!fs.existsSync(carpetaDb)) {
  fs.mkdirSync(carpetaDb, { recursive: true })
}

export const rutaBaseDatos = path.join(carpetaDb, 'tienditagaming.db')

const db = new Database(rutaBaseDatos)

db.pragma('journal_mode = WAL')

db.exec(`
CREATE TABLE IF NOT EXISTS productos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT NOT NULL,
  descripcion TEXT,
  precio REAL NOT NULL,
  costo REAL NOT NULL DEFAULT 0,
  stock INTEGER NOT NULL DEFAULT 0,
  categoria TEXT,
  imagen TEXT,
  creado_en TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS pedidos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  cliente TEXT NOT NULL,
  email TEXT,
  fecha TEXT DEFAULT CURRENT_TIMESTAMP,
  estado TEXT DEFAULT 'pendiente',
  total REAL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS pedido_detalle (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  pedido_id INTEGER NOT NULL,
  producto_id INTEGER NOT NULL,
  nombre_producto TEXT,
  cantidad INTEGER NOT NULL DEFAULT 1,
  precio_unitario REAL DEFAULT 0,
  costo_unitario REAL DEFAULT 0
);
`)

export default db
