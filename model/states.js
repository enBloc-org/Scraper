const db = require("../database/db.js")

// INSERT
const update_states = db.prepare(/*sql*/ `
  INSERT INTO states (id, states_file)
  VALUES (1, ?)
  ON CONFLICT(id) DO UPDATE SET states_file = excluded.states_file
  WHERE id = (SELECT MAX(id) FROM states)
`)

const updateStates = object => {
  return update_states.run(object)
}

// SELECT
const select_latest = db.prepare(/*sql*/ `
  SELECT states_file FROM states ORDER BY id DESC LIMIT 1
`)

const selectLatest = () => {
  return select_latest.get()
}

const select_all = db.prepare(/*sql*/ `
  SELECT states_file FROM states
`)

const selectAll = () => {
  return select_all.all()
}

// DELETE
const delete_state = db.prepare(/*sql*/ `
DELETE FROM states
WHERE id = (SELECT MAX(id) FROM states)
`)

const deleteState = () => {
  return delete_state.run()
}

module.exports = {
  selectLatest,
  updateStates,
  deleteState,
  selectAll,
}
