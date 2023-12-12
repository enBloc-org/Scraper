const { getBlocks } = require("../utils/crawler/getBlocks.js")

jest.mock("../utils/crawler/getSchools.js", () => ({
  getSchools: jest.fn(currentDistrict => currentDistrict),
}))

global.fetch = jest.fn().mockResolvedValue({
  json: jest.fn().mockResolvedValue([
    { eduBlockId: 1, eduBlockName: "block 1" },
    { eduBlockId: 2, eduBlockName: "block 2" },
  ]),
})

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

  test("calls getSchools for each Block in a District", () => {
    expect(
      require("../utils/crawler/getSchools.js").getSchools,
    ).toHaveBeenCalledWith({
      districtId: 1,
      districtName: "district 1",
      stateId: 1,
      blocks: [
        { eduBlockId: 1, eduBlockName: "block 1" },
        { eduBlockId: 2, eduBlockName: "block 2" },
      ],
    })

    expect(
      require("../utils/crawler/getSchools.js").getSchools,
    ).toHaveBeenCalledWith({
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
