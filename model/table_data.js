import db from "../database/school_data_db.js"

const insertTableData = async tableData => {
  const columns = tableData.map(obj => console.log(Object.entries(obj)))
}

export default insertTableData
