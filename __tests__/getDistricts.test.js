require("dotenv").config()

const { getDistricts } = require("../utils/crawler/getDistricts.js")
const { selectLatest } = require("../model/states.js")

jest.mock("../utils/crawler/getBlocks.js", () => ({
  getBlocks: jest.fn(currentState => currentState),
}))

global.fetch = jest.fn().mockResolvedValue({
  json: jest.fn().mockResolvedValue([
    { districtId: 1, districtName: "District1" },
    { districtId: 2, districtName: "District2" },
  ]),
})

const mockConsoleGroupCollapsed = jest
  .spyOn(console, "groupCollapsed")
  .mockImplementation(() => {})

const mockConsoleGroupEnd = jest
  .spyOn(console, "groupEnd")
  .mockImplementation(() => {})

const mockConsoleLog = jest.spyOn(console, "log").mockImplementation(() => {})

const mockConsoleError = jest
  .spyOn(console, "error")
  .mockImplementation(() => {})

describe("getDistricts", () => {
  beforeEach(async () => {
    const testStates = [
      {
        stateId: 135,
        stateName: "Fake State",
        stateSize: "Large",
      },
    ]

    await getDistricts(testStates)
  })

  test("updates devs at each recursion", () => {
    expect(mockConsoleGroupCollapsed).toHaveBeenCalled()
    expect(mockConsoleGroupEnd).toHaveBeenCalled()
    expect(mockConsoleLog).toHaveBeenCalled()
    expect(mockConsoleError).not.toHaveBeenCalled()
  })

  test("it should process states and update the database", async () => {
    expect(
      require("../utils/crawler/getBlocks.js").getBlocks,
    ).toHaveBeenCalledWith({
      stateId: 135,
      stateName: "Fake State",
      districts: [
        { districtId: 1, districtName: "District1" },
        { districtId: 2, districtName: "District2" },
      ],
    })

    const resultJSON = selectLatest()
    const result = JSON.parse(resultJSON.states_file)

    const hasStateId = result[0].hasOwnProperty("stateId")
    const hasStateName = result[0].hasOwnProperty("stateName")
    const hasStateSize = result[0].hasOwnProperty("stateSize")
    const hasDistricts = result[0].hasOwnProperty("districts")
    const numberOfKeys = Object.keys(result[0]).length

    expect(hasStateId).toBe(true)
    expect(hasStateName).toBe(true)
    expect(hasStateSize).toBe(false)
    expect(hasDistricts).toBe(true)
    expect(numberOfKeys).toBe(3)
  })
})
