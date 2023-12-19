import "dotenv/config.js"
import path from "path"
import fs from "fs"
import { jest } from "@jest/globals"
import base64 from "base64topdf"

import { convertBase64 } from "../utils/converter/convertBase64.js"

const __dirname = new URL(".", import.meta.url).pathname
const projectRoot = path.resolve(__dirname, "..")

const mockBase64Decoder = jest
  .spyOn(base64, "base64Decode")
  .mockImplementation(() => {})

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

    expect(mockBase64Decoder).toHaveBeenCalledWith("Test String", newFilePath)
  })

  test("logs the process for dev experience", () => {
    expect(mockConsoleGroupCollapsed).toHaveBeenCalledWith()
    expect(mockConsoleLog).toHaveBeenCalledWith(
      "\u001b[0m\u001b[34m",
      "2018-19 testFile converted to PDF",
    )
    expect(mockConsoleGroupEnd).toHaveBeenCalled()
  })
})
