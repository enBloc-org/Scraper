const parseLocalPDF = require("./utils/scraper/processGeneralData")
const insertSchoolData = require("./model/school_data")

const scraper = async pdfPath => {
  const pdfSchoolData = await parseLocalPDF(pdfPath)
  insertSchoolData(pdfSchoolData)
  console.log(`Scraped`)
}

scraper()
