require("dotenv").config()
const path = require("path")
const fs = require("fs")

const { convertBase64 } = require("../utils/converter/convertBase64.js")
const projectRoot = path.resolve(__dirname, "..")

jest.mock("base64topdf", () => ({
  base64Decode: jest.fn().mockResolvedValue(() => {}),
}))

const mockConsoleGroupCollapsed = jest
  .spyOn(console, "groupCollapsed")
  .mockImplementation(() => {})

const mockConsoleLog = jest.spyOn(console, "log").mockImplementation(() => {})

const mockConsoleGroupEnd = jest
  .spyOn(console, "groupEnd")
  .mockImplementation(() => {})

describe("convertBase64", () => {
  const testFilePath = path.join(
    projectRoot,
    "__tests__",
    "downloads",
    "2018-19_testFile",
  )

  beforeEach(async () => {
    fs.writeFileSync(testFilePath, "Test String", "utf-8")
    await convertBase64(testFilePath)
  })

  afterEach(() => {
    fs.unlinkSync(testFilePath)
  })

  test("passes decoder the title and value of the base64 target", () => {
    const newFilePath = path.join(
      projectRoot,
      "utils",
      "converter",
      "downloads",
      "2018-19_testFile.pdf",
    )

    expect(require("base64topdf").base64Decode).toHaveBeenCalledWith(
      "Test String",
      newFilePath,
    )
  })

  test("logs the process for dev experience", () => {
    expect(mockConsoleGroupCollapsed).toHaveBeenCalledWith(
      "\u001b[32m",
      "2018-19_testFile",
    )
    expect(mockConsoleLog).toHaveBeenCalledWith("downloaded")
    expect(mockConsoleGroupEnd).toHaveBeenCalled()
  })
})
