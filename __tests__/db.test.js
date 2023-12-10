require("dotenv").config()
process.env.NODE_ENV = "test"

const { updateStates, selectAll } = require("../model/states.js")

const testState = process.env.STATES_LIST

describe("updateStates", () => {
  it("updateStates inserts a new row when db is empty", () => {
    updateStates(testState)
    const outcome = selectAll()
    const result = outcome.length

    expect(result).toBe(1)
  })

  it("replaces the first entry when a new one is added", () => {
    updateStates(testState)
    const outcome = selectAll()
    const result = outcome.length

    expect(result).toBe(1)
  })
})
