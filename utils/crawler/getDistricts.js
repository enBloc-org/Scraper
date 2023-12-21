import "dotenv/config"

import { firstLogColour, errorLogColour, bgLogColour } from "../colours.js"
import { selectLatest, updateStates } from "../../model/states.js"
import { getBlocks } from "./getBlocks.js"

const baseURL = process.env.BASE_URL
const requestCookie = process.env.COOKIE
const delayInterval = process.env.DELAY

const mostRecentStatesJSON = selectLatest()
const mostRecentStates =
  mostRecentStatesJSON && JSON.parse(mostRecentStatesJSON.states_file)

// Fetch Call to the endpoint in each State
const districtFetch = async givenState => {
  const givenStateId = givenState.stateId

  const options = {
    method: "POST",
    headers: {
      cookie: requestCookie,
      "Content-Type": "application/x-www-form-urlencoded",
      "User-Agent": "insomnia/8.4.0",
    },
    body: new URLSearchParams({ stateId: givenStateId }),
  }

  try {
    const response = await fetch(`${baseURL}/locateSchool/getDistrict`, options)
    const parsedResponse = await response.json()
    const { stateId, stateName } = givenState

    givenState = {
      stateId,
      stateName,
      districts: parsedResponse,
    }

    console.log(firstLogColour, `Fetched ${parsedResponse.length} districts`)

    return givenState
  } catch (error) {
    console.error(
      errorLogColour,
      `Error fetching districts from ${givenState.stateName}: ${error}`,
    )
    throw error
  }
}

// Iterate through all States
export const getDistricts = async states => {
  try {
    const newStates = []

    const processSingleState = async index => {
      // base case
      if (index >= states.length) {
        const newStatesJSON = JSON.stringify(newStates)
        updateStates(newStatesJSON)
        console.log(bgLogColour, "States Object saved to DB")
        return
      }

      // failsafe stores at every second state
      if (index % 2 === 0 && index !== 0) {
        const newStatesJSON = JSON.stringify(newStates)
        updateStates(newStatesJSON)
        console.log(bgLogColour, "States Object saved to DB")
      }

      // function declaration
      let currentState = states[index]
      if (
        mostRecentStates &&
        mostRecentStates.length > 0 &&
        mostRecentStates.length > index
      ) {
        currentState = mostRecentStates[index]
      }

      try {
        console.log(
          firstLogColour,
          `Processing ${currentState.stateName} State - ${index + 1}/${
            states.length
          }`,
        )
        if (currentState.hasOwnProperty("districts")) {
          console.log(`Already in DB`)
        } else {
          const stateWithDistricts = await districtFetch(currentState)
          console.groupCollapsed()
          const stateWithBlocks = await getBlocks(stateWithDistricts)
          console.groupEnd()

          newStates.push(stateWithBlocks)
        }

        const result = await new Promise(resolve => {
          setTimeout(async () => {
            const nextState = await processSingleState(index + 1)
            resolve(nextState)
          }, delayInterval)
        })
        return result
      } catch (error) {
        console.error(
          errorLogColour,
          `Error fetching districts from ${currentState.stateName}: ${error}`,
        )
        throw error
      }
    }

    // recursive call command
    await processSingleState(0)
  } catch (error) {
    console.error(errorLogColour, `Error iterating through States: ${error}`)
    throw error
  }
}
