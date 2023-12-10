// jest.setup.js

const fs = require("fs")
const path = require("path")
const { execSync } = require("child_process")

// Create a directory for test data (if not exists)
const testDataDir = path.join(__dirname, "__tests__", "data")
if (!fs.existsSync(testDataDir)) {
  fs.mkdirSync(testDataDir)
}

// Create a test SQLite database file
const testDbPath = path.join(testDataDir, "test.db")

// Execute SQLite commands to set up your test database schema
execSync(`sqlite3 ${testDbPath} < ./database/schema.sql`)

// Set the test database file path in a global variable for your tests to use
global.TEST_DB_PATH = testDbPath
