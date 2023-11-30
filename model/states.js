const db = require("../database/db.js")

// INSERT
const insert_states = db.prepare(/*sql*/ `
  INSERT INTO states (states_file)
  VALUES (?)
`)

const insertStates = object => {
  return insert_states.run(object)
}

// SELECT
const select_states = db.prepare(/*sql*/ `
  SELECT (states_file) FROM states WHERE id = ?
`)

const selectStates = number => {
  return select_states.get(number)
}

module.exports = { insertStates, selectStates }
