const parseLocalPDF = require("./utils/scraper/processGeneralData")
const insertSchoolData = require("./model/school_data")

const scraper = async () => {
    const pdfPath =
      "/Users/eazzopardi/code/agency-scraper/sample report card (1).pdf"
  
    const pdfSchoolData = await parseLocalPDF(pdfPath)
    insertSchoolData(pdfSchoolData)
  }
  
  scraper()