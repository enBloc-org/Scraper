require("dotenv").config()

const delayInterval = process.env.DELAY
const { errorLogColour, firstLogColour } = require("./colours")
const { runDistricts } = require("./runDistricts")

const runStates = async states => {
  try {
    const runSingleState = async index => {
      const currentState = states[index]
      // base case
      if (index >= states.length) {
        console.log(firstLogColour, `All States Processed`)

        return
      }

      // function declaration
      try {
        console.groupCollapsed(
          firstLogColour,
          `Running ${currentState.stateName} State - ${
            states.indexOf(currentState) + 1
          }/${states.length - 1}`,
        )

        await runDistricts(currentState)

        console.groupEnd()

        const result = await new Promise(resolve => {
          seTimeout(async () => {
            const trigger = await runSingleState(index + 1)
            resolve(trigger)
          }, delayInterval)
        })
        return result
      } catch (error) {
        console.error(
          errorLogColour,
          `Error processing ${currentState.stateName} State: ${error}`,
        )
        throw error
      }
    }

    // recursive call command
    return runSingleState(0)
  } catch (error) {
    console.error(errorLogColour, `Error running States: ${error}`)
    throw error
  }
}

module.exports = { runStates }
