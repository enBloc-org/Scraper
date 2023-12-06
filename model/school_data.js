const parseLocalPDF = require("../utils/scraper/processGeneralData")
const db = require("../database/school_data_db")

const insert_school_data = async schoolData => {
  const columns = schoolData
    .map(obj =>
      Object.entries(obj)
        .filter(([key, value]) => key !== "undefined")
        .map(([key, value]) => key),
    )
    .flat()
  const placeholders = schoolData
    .map(obj =>
      Object.entries(obj)
        .filter(([key, value]) => key !== "undefined")
        .map(() => "?"),
    )
    .flat()
  const data = schoolData
    .map(obj =>
      Object.entries(obj)
        .filter(([key, value]) => key !== "undefined")
        .map(([key, value]) => value),
    )
    .flat()

  db.run(/*sql*/ `INSERT INTO school_data (${columns}) VALUES (${data})`
  );
}

const run = async () => {
  const pdfPath =
    "/Users/eazzopardi/code/agency-scraper/sample report card (1).pdf"

  const pdfSchoolData = await parseLocalPDF(pdfPath)
  insert_school_data(pdfSchoolData)
}

run()
