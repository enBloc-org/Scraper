require("dotenv").config()

const { selectLatest } = require("./model/states.js")
const { runStates } = require("./utils/downloader/runStates.js")

const jsonStates = selectLatest()
const states = JSON.parse(jsonStates.states_file)

runStates(states)
