require("dotenv").config()

const delayInterval = process.env.DELAY
const { errorLogColour, secondLogColour } = require("../colours")
const { runBlocks } = require("./runBlocks")

/**
 *
 * @param {*} givenState should be the full object of the state currently being processed
 * @returns no value
 * @remarks this is a recursive function that allows us to process each district in a state in succession
 */
const runDistricts = async givenState => {
  try {
    for (let index = 0; index < givenState.districts.length; index++) {
      const currentDistrict = givenState.districts[index]

      try {
        console.groupCollapsed(
          secondLogColour,
          `Running ${currentDistrict.districtName} District - ${index + 1}/${
            givenState.districts.length
          }`,
        )

        await new Promise(resolve => {
          setTimeout(async () => {
            const trigger = await runBlocks(currentDistrict)
            resolve(trigger)
          }, delayInterval)
        })

        console.groupEnd()
      } catch (error) {
        console.error(errorLogColour, `Error running District: ${error}`)
        throw error
      }
    }
  } catch (error) {
    console.error(errorLogColour, `Error running Districts: ${error}`)
    throw error
  }
}

module.exports = { runDistricts }
