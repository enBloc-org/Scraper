import "dotenv/config"

import { readFileSync } from "node:fs"
import { join } from "node:path"
import Database from "better-sqlite3"

const dbPath =
  process.env.NODE_ENV === "test" ? global.TES_DB_PATH : "statesDB.sql"

export const db = new Database(dbPath)
const schemaPath = join("database", "schema.sql")
const schema = readFileSync(schemaPath, "utf-8")
db.exec(schema)
