require("dotenv").config()
const { getDistricts } = require("./utils/crawler/getDistricts.js")

const states = JSON.parse(process.env.STATE_LIST)
const testStates = states.filter(
  state => state.stateId === 135 || state.stateId === 128,
)

getDistricts(testStates)
