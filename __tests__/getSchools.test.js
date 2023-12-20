import { jest } from "@jest/globals"
import { getSchools } from "../utils/crawler/getSchools.js"

global.fetch = jest.fn().mockResolvedValue({
  json: jest.fn().mockResolvedValue({
    list: [
      {
        schoolId: 1,
        schoolName: "First School",
        extraProperty: "I should not be here",
        isOperational201819: 0,
        isOperational201920: 0,
        isoperational202021: 1,
        isoperational202122: 0,
        isoperational202223: 1,
      },
      {
        schoolId: 2,
        schoolName: "Second School",
        extraProperty: "I should not be here",
        isOperational201819: 0,
        isOperational201920: 0,
        isoperational202021: 1,
        isoperational202122: 0,
        isoperational202223: 1,
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

  test("stores 'isOperational' value for 5 school years", () => {
    const firstSchool = result.blocks[0].schoolList[0]
    const hasOperationalData202122 = firstSchool.hasOwnProperty(
      "isOperational202122",
    )
    const numberOfKeys = Object.keys(firstSchool).length

    expect(hasOperationalData202122).toBe(true)
    expect(numberOfKeys).toBe(12)
  })
})
