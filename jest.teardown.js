module.exports = () => {
  const fs = require("fs")
  const path = require("path")

  const testDataDir = path.join(__dirname, "__tests__", "data")
  const testDbPath = path.join(testDataDir, "test.db")

  if (fs.existsSync(testDbPath)) {
    fs.unlinkSync(testDbPath)
  }

  process.env.NODE_ENV = "production"
}
