const { readFileSync } = require("node:fs")
const { join } = require("node:path")
const Database = require("better-sqlite3")

const db = new Database("school_data.sql")
const schemaPath = join("database", "school_data.sql")
const schema = readFileSync(schemaPath, "utf-8")
db.exec(schema)

module.exports = db
