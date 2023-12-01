require("dotenv").config()

const { selectStates } = require("./model/states.js")
const {runStates} = require("./utils/runStates.js")


const jsonStates = selectStates(1)
const states = JSON.parse(jsonStates.states_file)
const testStates = states.filter(
  state => state.stateId === 135,
)

runStates(testStates)