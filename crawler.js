require("dotenv").config()
const { getDistricts } = require("./utils/getDistricts.js")

const states = process.env.STATE_LIST
const testStates = states.filter(
  states => states.stateId === 135 || states.stateId === 128,
)

getDistricts(testStates)
