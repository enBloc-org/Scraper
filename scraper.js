import {
  processGeneralData,
  getNameValue,
  getYearValue,
} from "./utils/scraper/processGeneralData.js"
import processTableData from "./utils/scraper/processTableData.js"
import insertSchoolData from "./model/school_data.js"
import {
  errorLogColour,
  firstLogColour,
  thirdLogColour,
} from "./utils/colours.js"

const scraper = async pdfPath => {
  console.log(`Start!`)
  // SCHOOL NAME AND YEAR VALUES
  const schoolname = { schoolname: getNameValue(pdfPath) }
  const year = { year: getYearValue(pdfPath) }
  console.log(
    thirdLogColour,
    `Get Data from name: ${schoolname.schoolname}-${year.year}`,
  )

  // GENERAL VALUES
  let pdfSchoolData = []

  try {
    pdfSchoolData = await processGeneralData(pdfPath)
  } catch (error) {
    console.error(error)
  }
  console.dir({ pdfSchoolData })

  // UDISE AND TABLE VALUES
  let tableData
  try {
    tableData = await processTableData(pdfPath)
    pdfSchoolData.push(tableData)
  } catch (error) {
    console.log(errorLogColour, `"I FAILED!!!"`)
    console.error(error)
  }
  console.dir({ tableData })

  pdfSchoolData.push(schoolname, year)

  insertSchoolData(pdfSchoolData)

  console.log(firstLogColour, `Scraped`)
}

export default scraper
