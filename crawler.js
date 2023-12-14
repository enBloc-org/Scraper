require("dotenv").config()
const { getDistricts } = require("./utils/crawler/getDistricts.js")

const states = JSON.parse(process.env.STATE_LIST)

getDistricts(states)
