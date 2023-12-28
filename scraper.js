import processGeneralData from "./utils/scraper/processGeneralData.js"
import processTableData from "./utils/scraper/processTableData.js"
import insertSchoolData from "./model/school_data.js"

const scraper = async pdfPath => {
  const pdfSchoolData = await processGeneralData(pdfPath)
  const tableData = await processTableData(pdfPath)
  pdfSchoolData.push(tableData)

  insertSchoolData(pdfSchoolData)

  console.log(`Scraped`)
}

export default scraper
