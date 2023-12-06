require("dotenv").config()

const delayInterval = process.env.DELAY
const { errorLogColour, thirdLogColour } = require("../colours")
const { runSchools } = require("./runSchools")

const runBlocks = async givenDistrict => {
  try {
    const runSingleBlock = async index => {
      const currentBlock = givenDistrict.blocks[index]

      // base case
      if (index >= givenDistrict.blocks.length) {
        console.log(
          thirdLogColour,
          `${givenDistrict.districtName} District processed`,
        )

        return
      }

      // function declaration
      try {
        console.groupCollapsed(
          thirdLogColour,
          `Running ${currentBlock.eduBlockName} Block - ${index + 1}/${
            givenDistrict.blocks.length
          }`,
        )

        await runSchools(currentBlock)

        console.groupEnd()

        const result = await new Promise(resolve => {
          setTimeout(async () => {
            const trigger = await runSingleBlock(index + 1)
            resolve(trigger)
          }, delayInterval)
        })
        return result
      } catch (error) {
        console.error(
          errorLogColour,
          `Error running ${currentBlock.eduBlockName} block: ${error}`,
        )
        throw error
      }
    }

    // recursive call command
    return runSingleBlock(0)
  } catch (error) {
    console.error(
      errorLogColour,
      `Error running ${givenDistrict.districtName}: ${error}`,
    )
    throw error
  }
}

module.exports = { runBlocks }
