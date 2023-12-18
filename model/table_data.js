// import db from "../database/school_data_db.js"
import processTableData from "../utils/scraper/processTableData.js"

const processedTableData = await processTableData("/Users/eazzopardi/code/agency-scraper/school report card 2.pdf")

const insertTableData = async tableData => {
  console.log(tableData)
  // const columns = tableData.map(obj => console.log(Object.entries(obj)))
}

insertTableData(processedTableData )

export default insertTableData
