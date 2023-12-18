import parseLocalPDF from "./utils/scraper/processGeneralData.js"
import processTableData from "./utils/scraper/processTableData.js"
import insertSchoolData from "./model/school_data.js"
import insertTableData from "./model/table_data.js"

const scraper = async pdfPath => {
  const pdfSchoolData = await parseLocalPDF(pdfPath)
  insertSchoolData(pdfSchoolData)
}

// const tableData = processTableData(
//   "/Users/eazzopardi/code/agency-scraper/sample report card (1).pdf",
// )
// insertTableData(tableData)


