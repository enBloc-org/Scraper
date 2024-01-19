import { processGeneralData, getNameValue, getYearValue } from "./utils/scraper/processGeneralData.js"
import processTableData from "./utils/scraper/processTableData.js"
import insertSchoolData from "./model/school_data.js"

const scraper = async pdfPath => {
  // CORE VALUES
  const schoolname = { schoolname: getNameValue(pdfPath) }
  const year = { year: getYearValue(pdfPath) }

  // GENERAL VALUES
  const pdfSchoolData = await processGeneralData(pdfPath)

  // UDISE AND TABLE VALUES
  const tableData = await processTableData(pdfPath)

  pdfSchoolData.push(schoolname, year, tableData)

  insertSchoolData(pdfSchoolData)

  console.log(`Scraped`)
}

export default scraper
