import fs from "fs"
import path from "path"
import { jest } from "@jest/globals"

import { schoolDownload } from "../utils/downloader/schoolDownload.js"

global.fetch = jest.fn().mockResolvedValue({
  body: {
    getReader: jest.fn().mockResolvedValue({
      read: jest.fn().mockResolvedValue({
        done: true,
        value: "fetched String",
      }),
    }),
  },
})

const mockFS = jest.spyOn(fs, "createWriteStream").mockImplementation(() => ({
  on: jest.fn().mockResolvedValue(() => {}),
  write: jest.fn().mockResolvedValue(() => {}),
  end: jest.fn().mockResolvedValue(() => {}),
}))

jest.spyOn(path, "join").mockImplementation((...strings) => strings.join("/"))

describe("schoolDownload", () => {
  beforeEach(() => {
    const testSchool = {
      schoolId: 1,
      schoolName: "Test School",
      stateId: 1,
      districtId: 1,
      blockId: 1,
      schoolStatus: 0,
      schMgmtId: 1,
      isOperational201819: 0,
      isOperational201920: 0,
      isOperational202021: 0,
      isOperational202122: 0,
      isOperational202223: 0,
    }

    schoolDownload(testSchool, 8)
  })

  test("fetches data from the given school endpoint", () => {
    expect(global.fetch).toHaveBeenCalledWith(
      "https://src.udiseplus.gov.in/NewReportCard/PdfReportSchId",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          cookie: "testCookie",
          "Content-Type": "application/x-www-form-urlencoded",
          "User-Agent": "insomnia/8.4.0",
        }),
      }),
    )
  })

  test("creates a writeStream", () => {
    expect(mockFS).toHaveBeenCalled()
  })
})
