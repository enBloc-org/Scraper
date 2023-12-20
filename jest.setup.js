import "dotenv/config"
import fs from "fs"
import path from "path"
import { execSync } from "child_process"

export default function setup() {
  process.env.NODE_ENV = "test"
  process.env.COOKIE = "testCookie"
  process.env.DELAY = "1"

  const __dirname = new URL(".", import.meta.url).pathname
  const testDataDir = path.join(__dirname, "__tests__", "data")
  if (!fs.existsSync(testDataDir)) {
    fs.mkdirSync(testDataDir)
  }

  const testDbPath = path.join(testDataDir, "test.db")
  execSync(`sqlite3 ${testDbPath} < ./database/schema.sql`)

  global.TEST_DB_PATH = testDbPath
}
