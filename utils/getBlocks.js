require("dotenv").config()

const { errorLogColour, secondLogColour } = require("./colours.js")
const baseURL = process.env.BASE_URL
const requestCookie = process.env.COOKIE
const delayInterval = process.env.DELAY

const { getSchools } = require("./getSchools.js")

// Fetch Call to the endpoint in each District
const blockFetch = async givenDistrict => {
  const givenDistrictId = givenDistrict.districtId

  try {
    const options = {
      method: "GET",
      headers: {
        cookie: requestCookie,
        "User-Agent": "insomnia/8.4.0",
      },
    }

    const response = await fetch(
      `${baseURL}/locateSchool/getBlock?districtId=${givenDistrictId}`,
      options,
    )
    const parsedResponse = await response.json()

    const updatedDistrict = {
      ...givenDistrict,
      blocks: parsedResponse,
    }
    console.log(
      secondLogColour,
      `Fetched ${parsedResponse.length} Blocks for ${updatedDistrict.districtName} District`,
    )
    return updatedDistrict
  } catch (error) {
    console.error(
      errorLogColour,
      `Error fetching Blocks in ${givenDistrict.districtName}: ${error}`,
    )
    throw error
  }
}

// Iterate through all Districts in a State
const getBlocks = async currentState => {
  try {
    const newDistricts = []

    const processSingleDistrict = async index => {
      // base case
      if (index >= currentState.districts.length) {
        const updatedState = {
          ...currentState,
          districts: newDistricts,
        }

        return updatedState
      }

      // function declaration
      const currentDistrict = currentState.districts[index]

      try {
        console.groupCollapsed()

        const districtWithBlocks = await blockFetch(currentDistrict)
        console.groupCollapsed()
        const districtWithSchools = await getSchools(districtWithBlocks)
        console.groupEnd()
        console.groupEnd()

        newDistricts.push(districtWithSchools)

        const result = await new Promise(resolve => {
          setTimeout(async () => {
            const result = await processSingleDistrict(index + 1)
            resolve(result)
          }, delayInterval)
        })

        return result
      } catch (error) {
        console.error(
          errorLogColour,
          `Error processing ${currentDistrict.districtName}: ${error}`,
        )
        throw error
      }
    }

    //recursive call command
    return processSingleDistrict(0)
  } catch (error) {
    console.error(
      errorLogColour,
      `Error processing ${givenDistrict.districtName}: ${error}`,
    )
    throw error
  }
}

module.exports = { getBlocks }