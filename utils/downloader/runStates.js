import "dotenv/config"

import { errorLogColour, firstLogColour } from "../colours.js"
import { runDistricts } from "./runDistricts.js"

const delayInterval = process.env.DELAY

/**
 *
 * @param {*} states should be the full object of states stored in the database after running crawler.js
 * @returns a pdf for each available year in each school
 * @remarks this is a recursive function that calls each school endpoint in sucession
 */
export const runStates = async states => {
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
