require("dotenv").config()

const { selectStates } = require("./model/states.js")

const jsonStates = selectStates(1)
const states = JSON.parse(jsonStates.states_file).filter(
  state => state.stateId === 135,
)

console.log(states[0].districts[3])
