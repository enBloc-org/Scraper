const { getSchools } = require("../utils/crawler/getSchools.js")

global.fetch = jest.fn().mockResolvedValue({
  json: jest.fn().mockResolvedValue({
    list: [
      {
        schoolId: 1,
        schoolName: "First School",
        extraProperty: "I should not be here",
      },
      {
        schoolId: 2,
        schoolName: "Second School",
        extraProperty: "I should not be here",
      },
    ],
  }),
})

const mockConsoleLog = jest.spyOn(console, "log").mockImplementation(() => {})

const mockConsoleError = jest
  .spyOn(console, "error")
  .mockImplementation(() => {})

describe("getSchools", () => {
  let result

  beforeEach(async () => {
    const testDistrict = {
      districtId: 1,
      districtName: "Test District",
      stateId: 1,
      blocks: [
        {
          eduBlockId: 1,
          eduBlockName: "First Block",
          districtId: 1,
        },
        {
          eduBlockId: 2,
          eduBlockName: "Second Block",
          districtId: 1,
        },
      ],
    }

    result = await getSchools(testDistrict)
  })

  test("updates devs at each recursion", () => {
    expect(mockConsoleLog).toHaveBeenCalled()
    expect(mockConsoleError).not.toHaveBeenCalled()
  })

  test("adds schoolList to every Block in a District", () => {
    const firstBlock = result.blocks[0]
    const firstBlockHasSchoolList = firstBlock.hasOwnProperty("schoolList")

    expect(firstBlockHasSchoolList).toBe(true)

    const secondBlock = result.blocks[1]
    const secondBlockHasSchoolList = secondBlock.hasOwnProperty("schoolList")

    expect(secondBlockHasSchoolList).toBe(true)
  })

  test("edits each school to remove unwanted data", () => {
    const firstSchool = result.blocks[0].schoolList[0]
    const hasExtraProperty = firstSchool.hasOwnProperty("extraProperty")

    expect(hasExtraProperty).toBe(false)
  })
})
