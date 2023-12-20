import "dotenv/config"
import fs from "fs"
import path from "path"

export default function teardown() {
  const __dirname = new URL(".", import.meta.url).pathname
  const testDataDir = path.join(__dirname, "__tests__", "data")
  const testDbPath = path.join(testDataDir, "test.db")

  if (fs.existsSync(testDbPath)) {
    fs.unlinkSync(testDbPath)
  }

  process.env.NODE_ENV = "production"
}
