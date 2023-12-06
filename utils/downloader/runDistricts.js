require("dotenv").config()

const delayInterval = process.env.DELAY
const { errorLogColour, secondLogColour } = require("../colours")
const { runBlocks } = require("./runBlocks")

const runDistricts = async givenState => {
  try {
    const runSingleDistrict = async index => {
      const currentDistrict = givenState.districts[index]

      // base case
      if (index >= givenState.districts.length) {
        console.log(secondLogColour, `${givenState.stateName} State processed`)

        return
      }

      //function declaration
      try {
        console.groupCollapsed(
          secondLogColour,
          `Running ${currentDistrict.districtName} District - ${index + 1}/${
            givenState.districts.length
          }`,
        )

        await runBlocks(currentDistrict)

        console.groupEnd()

        const result = await new Promise(resolve => {
          setTimeout(async () => {
            const trigger = await runSingleDistrict(index + 1)
            resolve(trigger)
          }, delayInterval)
        })
        return result
      } catch (error) {
        console.error(
          errorLogColour,
          `Error running ${currentDistrict.districtName} District: ${error}`,
        )
        throw error
      }
    }

    // recursive call command
    return runSingleDistrict(0)
  } catch (error) {
    console.error(errorLogColour, `Error running Districts: ${error}`)
    throw error
  }
}

module.exports = { runDistricts }
