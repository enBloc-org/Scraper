module.exports = () => {
  const fs = require("fs")
  const path = require("path")
  const { execSync } = require("child_process")

  process.env.NODE_ENV = "test"
  process.env.COOKIE = "testCookie"
  process.env.DELAY = "1"

  const testDataDir = path.join(__dirname, "__tests__", "data")
  if (!fs.existsSync(testDataDir)) {
    fs.mkdirSync(testDataDir)
  }

  const testDbPath = path.join(testDataDir, "test.db")
  execSync(`sqlite3 ${testDbPath} < ./database/schema.sql`)

  global.TEST_DB_PATH = testDbPath
}
