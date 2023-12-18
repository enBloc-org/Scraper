import { readFileSync } from "node:fs"
import { join } from "node:path"
import Database from "better-sqlite3"

const db = new Database("school_data.sql")
const schemaPath = join("database", "school_data.sql")
const schema = readFileSync(schemaPath, "utf-8")
db.exec(schema)

export default db
