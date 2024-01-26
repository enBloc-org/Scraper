import {
  processGeneralData,
  getNameValue,
  getYearValue,
} from "./utils/scraper/processGeneralData.js"
import processTableData from "./utils/scraper/processTableData.js"
import insertSchoolData from "./model/school_data.js"

const scraper = async pdfPath => {
  // SCHOOL NAME AND YEAR VALUES
  const schoolname = { schoolname: getNameValue(pdfPath) }
  const year = { year: getYearValue(pdfPath) }

  // GENERAL VALUES
  let pdfSchoolData = []

  try {
  pdfSchoolData = await processGeneralData(pdfPath)
  } catch (error){
    console.error(error)
  }

  // UDISE AND TABLE VALUES
  let tableData
  try {
  tableData = await processTableData(pdfPath)
  pdfSchoolData.push(tableData)
  } catch (error){
    console.log({tableData})
    console.error(error)
  }

  pdfSchoolData.push(schoolname, year)

  insertSchoolData(pdfSchoolData)

  console.log(`Scraped`)
}

export default scraper
