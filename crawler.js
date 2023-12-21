import "dotenv/config"
import { getDistricts } from "./utils/crawler/getDistricts.js"

const states = JSON.parse(process.env.STATE_LIST)

getDistricts(states)
