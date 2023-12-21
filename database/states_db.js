import { readFileSync } from "node:fs"
import { join } from "node:path"
import Database from "better-sqlite3"

export const db = new Database("statesDB.sql")
const schemaPath = join("database", "schema.sql")
const schema = readFileSync(schemaPath, "utf-8")
db.exec(schema)
