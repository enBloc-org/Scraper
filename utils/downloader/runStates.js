require("dotenv").config()

const delayInterval = process.env.DELAY
const { errorLogColour, firstLogColour } = require("../colours")
const { runDistricts } = require("./runDistricts")

/**
 *
 * @param {*} states should be the full object of states stored in the database after running crawler.js
 * @returns a pdf for each available year in each school
 * @remarks this is a recursive function that calls each school endpoint in sucession
 */
const runStates = async states => {
  try {
    for (let index = 0; index < states.length; index++) {
      const currentState = states[index]

      try {
        console.groupCollapsed(
          firstLogColour,
          `Running ${currentState.stateName} State - ${index + 1}/${
            states.length
          }`,
        )

        await new Promise(resolve => {
          setTimeout(async () => {
            const trigger = await runDistricts(currentState)
            resolve(trigger)
          }, delayInterval)
        })

        console.groupEnd()
      } catch (error) {
        console.error(errorLogColour, `Error running State: ${error}`)
        throw error
      }
    }
  } catch (error) {
    console.error(errorLogColour, `Error running States: ${error}`)
    throw error
  }
}

module.exports = { runStates }
