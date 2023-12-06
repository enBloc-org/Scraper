/* eslint-disable no-unused-vars */

const db = require("../database/school_data_db")

const insertSchoolData = async schoolData => {
  const columns = schoolData
    .map(obj =>
      Object.entries(obj)
        .filter(([key, value]) => key !== "undefined")
        .map(([key, value]) => key),
    )
    .flat()

  const data = schoolData
    .map(obj =>
      Object.entries(obj)
        .filter(([key, value]) => key !== "undefined")
        .map(([key, value]) => value),
    )
    .flat()

  const insert_school_data = db.prepare(
    /*sql*/ `INSERT INTO school_data (${columns.join(", ")}) VALUES (${data
      .map(() => "?")
      .join(", ")})`,
  )

  insert_school_data.run(data)
}

module.exports = insertSchoolData