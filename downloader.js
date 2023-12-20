import "dotenv/config"

import { selectLatest } from "./model/states.js"
import { runStates } from "./utils/downloader/runStates.js"

const jsonStates = selectLatest()
const states = JSON.parse(jsonStates.states_file)

runStates(states)
