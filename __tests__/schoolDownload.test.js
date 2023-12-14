const { schoolDownload } = require("../utils/downloader/schoolDownload.js")

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

jest.mock("fs", () => ({
  createWriteStream: jest.fn().mockReturnValue({
    on: jest.fn().mockResolvedValue(() => {}),
    write: jest.fn().mockResolvedValue(() => {}),
    end: jest.fn().mockResolvedValue(() => {}),
  }),
  readFileSync: jest.fn().mockResolvedValue(() => {}),
  unlinkFileSync: jest.fn().mockResolvedValue(() => {}),
}))

jest.mock("path", () => ({
  join: jest.fn().mockResolvedValue((...strings) => strings.join("/")),
}))

jest.mock("base64topdf", () => ({
  base64: jest.fn().mockResolvedValue({
    base64Decode: jest.fn().mockResolvedValue((string, path) => {
      if (string) return path
    }),
  }),
}))

jest.mock("pdf-parse", () => {
  pdfParse: jest.fn().mockResolvedValue(() => {
    data: jest.fn().mockResolvedValue({
      text: jest.fn().mockResolvedValue({
        length: 1,
      }),
    })
  })
})

jest.mock("../scraper.js", () => ({
  scraper: jest.fn().mockResolvedValue(() => {}),
}))

// const mockConsoleGroupCollapsed = jest
//   .spyOn(console, "groupCollapsed")
//   .mockImplementation(() => {})

// const mockConsoleLog = jest.spyOn(console, "log").mockImplementation(() => {})

// const mockConsoleError = jest
//   .spyOn(console, "error")
//   .mockImplementation(() => {})

// const mockConsoleGroupEnd = jest
//   .spyOn(console, "groupEnd")
//   .mockImplementation(() => {})

describe("schoolDownload", () => {
  beforeAll(() => {
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
})
