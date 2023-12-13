module.exports = {
  testEnvironment: "node",
  setupFilesAfterEnv: ["./jest.setup.js"],
  globalSetup: "./jest.setup.js",
  globalTeardown: "./jest.teardown.js",
}
