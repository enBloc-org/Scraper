export default {
  testEnvironment: "node",
  setupFilesAfterEnv: ["./jest.setup.js"],
  globalSetup: "./jest.setup.js",
  globalTeardown: "./jest.teardown.js",
  moduleFileExtensions: ["js", "json", "es6"],
  transform: {},
}
