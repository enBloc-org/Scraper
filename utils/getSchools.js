require("dotenv").config()

const { errorLogColour, thirdLogColour } = require("./colours.js")
const baseURL = process.env.BASE_URL
const requestCookie = process.env.COOKIE
const delayInterval = process.env.DELAY

// Fetch Call to the endpoint in each Block
const schoolFetch = async (stateId, givenBlock) => {
  const givenDistrictName = givenBlock.districtId
  const givenBlockName = givenBlock.eduBlockId

  try {
    const options = {
      method: "POST",
      headers: {
        cookie: requestCookie,
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "insomnia/8.3.0",
      },
      body: new URLSearchParams({
        stateName: stateId,
        districtName: givenDistrictName,
        blockName: givenBlockName,
        villageId: "",
        clusterId: "",
        categoryName: "0",
        managementName: "0",
        Search: "search",
      }),
    }

    const response = await fetch(
      `${baseURL}/locateSchool/searchSchool`,
      options,
    )
    const parsedResponse = await response.json()
    const schoolList = parsedResponse.list

    // console.dir(schoolList)
    const updatedBlock = {
      ...givenBlock,
      schoolList: schoolList,
    }
    console.log(
      thirdLogColour,
      `Fetched ${schoolList.length} schools for ${givenBlock.eduBlockName} Block`,
    )

    return updatedBlock
  } catch (error) {
    console.error(
      errorLogColour,
      `Error Fetching Schools from ${givenBlock.eduBlockName} Block`,
    )
    throw error
  }
}

// Iterate through all Blocks in a District
const getSchools = async givenDistrict => {
  try {
    const newBlocks = []

    const processSingleBlock = async index => {
      // base case
      if (index >= givenDistrict.blocks.length) {
        const updatedDistrict = {
          ...givenDistrict,
          blocks: newBlocks,
        }

        return updatedDistrict
      }

      // function declaration
      const currentBlock = givenDistrict.blocks[index]
      const stateId = givenDistrict.districtId

      try {
        const processedBlock = await schoolFetch(stateId, currentBlock)
        newBlocks.push(processedBlock)

        const result = await new Promise(resolve => {
          setTimeout(async () => {
            const result = await processSingleBlock(index + 1)
            resolve(result)
          }, delayInterval * 2)
        })
        return result
      } catch (error) {
        console.error(
          errorLogColour,
          `Error getting schools from ${currentBlock.eduBlockName} block`,
        )
      }
    }

    // recursive call command
    return processSingleBlock(0)
  } catch (error) {
    console.error(
      errorLogColour,
      `Error getting scools from ${givenState.stateName}: ${error}`,
    )
    throw error
  }
}

module.exports = { getSchools }
