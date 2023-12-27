import path from "path"

import processGeneralData from "./utils/scraper/processGeneralData.js"
import processTableData from "./utils/scraper/processTableData.js"
import insertSchoolData from "./model/school_data.js"

const yearRegex = /(2018-19)|(2019-20)|(2020-21)|(2021-22)|(2022-23)/

const scraper = async pdfPath => {
  const pdfSchoolData = await processGeneralData(pdfPath)
  const tableData = await processTableData(pdfPath)
  pdfSchoolData.push(tableData)

  const fileBaseTitle = path.basename(pdfPath)
  const year = fileBaseTitle.match(yearRegex)[0]
  pdfSchoolData.push({ year })

  insertSchoolData(pdfSchoolData)

  console.log(`Scraped`)
}

export default scraper
