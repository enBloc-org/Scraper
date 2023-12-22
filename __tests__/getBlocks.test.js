import { jest } from "@jest/globals"
import { getBlocks } from "../utils/crawler/getBlocks.js"

// import { getSchools } from "../utils/crawler/getSchools.js"
// jest.mock("../utils/crawler/getSchools.js", () => {
//   const actualGetSchools = jest.requireActual("../utils/crawler/getSchools.js")
//   return {
//     __esModule: true,
//     ...actualGetSchools,
//     getSchools: jest.fn(currentDistrict => currentDistrict),
//   }
// })

jest.mock("../utils/crawler/getSchools.js", () => ({
  __esModule: true,
  getSchools: jest.fn(currentDistrict => currentDistrict),
}))

global.fetch = jest.fn().mockResolvedValue({
  json: jest.fn().mockResolvedValue([
    { eduBlockId: 1, eduBlockName: "block 1" },
    { eduBlockId: 2, eduBlockName: "block 2" },
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

describe("getBlocks", () => {
  let result

  beforeEach(async () => {
    const testState = {
      stateId: 1,
      stateName: "testDistrict",
      extraProperty: "I should be removed",
      districts: [
        { districtId: 1, districtName: "district 1", stateId: 1 },
        { districtId: 2, districtName: "district 2", stateId: 1 },
      ],
    }

    result = await getBlocks(testState)
  })

  test("updates devs at each recursion", () => {
    expect(mockConsoleGroupCollapsed).toHaveBeenCalled()
    expect(mockConsoleGroupEnd).toHaveBeenCalled()
    expect(mockConsoleLog).toHaveBeenCalled()
    expect(mockConsoleError).not.toHaveBeenCalled()
  })

  test("calls getSchools for each Block in a District", () => {
    expect("../utils/crawler/getSchools.js".getSchools).toHaveBeenCalledWith({
      districtId: 1,
      districtName: "district 1",
      stateId: 1,
      blocks: [
        { eduBlockId: 1, eduBlockName: "block 1" },
        { eduBlockId: 2, eduBlockName: "block 2" },
      ],
    })

    expect("../utils/crawler/getSchools.js".getSchools).toHaveBeenCalledWith({
      districtId: 2,
      districtName: "district 2",
      stateId: 1,
      blocks: [
        { eduBlockId: 1, eduBlockName: "block 1" },
        { eduBlockId: 2, eduBlockName: "block 2" },
      ],
    })
  })

  test("removes unwanted data from each District", () => {
    const firstDistrict = result.districts[0]
    const firstDistrictHasExtraProperty =
      firstDistrict.hasOwnProperty("extraProperty")
    const firstDistrictNumberOfKeys = Object.keys(firstDistrict).length

    expect(firstDistrictHasExtraProperty).toBe(false)
    expect(firstDistrictNumberOfKeys).toBe(4)

    const secondDistrict = result.districts[1]
    const secondDistrictHasExtraProperty =
      secondDistrict.hasOwnProperty("extraProperty")
    const secondDistrictNumberOfKeys = Object.keys(secondDistrict).length

    expect(secondDistrictHasExtraProperty).toBe(false)
    expect(secondDistrictNumberOfKeys).toBe(4)
  })
})
