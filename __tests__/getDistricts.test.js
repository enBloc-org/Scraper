require("dotenv").config()
process.env.NODE_ENV = "test"

const { getDistricts } = require("../utils/crawler/getDistricts.js")
const { selectLatest } = require("../model/states.js")

jest.mock("../utils/crawler/getBlocks.js", () => ({
  getBlocks: jest.fn(currentState => currentState),
  // .mockResolvedValue({
  //   stateId: 135,
  //   stateName: "Fake State",
  //   districts: [
  //     { districtId: 1, districtName: "District1" },
  //     { districtId: 2, districtName: "District2" },
  //   ],
  // }),
}))

global.fetch = jest.fn().mockResolvedValue({
  json: jest.fn().mockResolvedValue([
    { districtId: 1, districtName: "District1" },
    { districtId: 2, districtName: "District2" },
  ]),
})

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
