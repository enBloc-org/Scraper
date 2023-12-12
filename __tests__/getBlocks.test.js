require("dotenv").config()

const { getBlocks } = require("../utils/crawler/getBlocks.js")

jest.mock("../utils/crawler/getSchools.js", () => ({
  getSchools: jest.fn(currentDistrict => {
    return {
      ...currentDistrict,
      blocks: currentDistrict.blocks.map(block => {
        return {
          ...block,
          schoolList: [{ schoolId: 1 }, { schoolId: 2 }],
        }
      }),
    }
  }),
}))

global.fetch = jest.fn().mockResolvedValue({
  json: jest.fn().mockResolvedValue([
    { eduBlockId: 1, eduBlockName: "block 1" },
    { eduBlockId: 2, eduBlockName: "block 2" },
  ]),
})

describe("getSchools", () => {
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

  test("it should add schoolList to each Block in a District", () => {
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
      districtId: 1,
      districtName: "district 1",
      stateId: 1,
      blocks: [
        { eduBlockId: 1, eduBlockName: "block 1" },
        { eduBlockId: 2, eduBlockName: "block 2" },
      ],
    })

    const firstBlock = result.districts[0].blocks[0]
    const secondBlock = result.districts[0].blocks[1]

    const firstBlockHasSchoolList = firstBlock.hasOwnProperty("schoolList")
    expect(firstBlockHasSchoolList).toBe(true)

    const firstBlockNumberOfSchools = firstBlock.schoolList?.length
    expect(firstBlockNumberOfSchools).toBe(2)

    const secondBlockHasSchoolList = secondBlock.hasOwnProperty("schoolList")
    expect(secondBlockHasSchoolList).toBe(true)

    const secondBlockNumberOfSchools = secondBlock.schoolList?.length
    expect(secondBlockNumberOfSchools).toBe(2)
  })

  test("should remove unwanted data from each District", () => {
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
      districtId: 1,
      districtName: "district 1",
      stateId: 1,
      blocks: [
        { eduBlockId: 1, eduBlockName: "block 1" },
        { eduBlockId: 2, eduBlockName: "block 2" },
      ],
    })

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
