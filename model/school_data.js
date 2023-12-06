const parseLocalPDF = require("../utils/scraper/processGeneralData")
const db = require("../database/school_data_db")

const insertSchoolData = async schoolData => {
  
  const columns = schoolData
    .map(obj =>
      Object.entries(obj)
        .filter(([key, value]) => key !== "undefined")
        .map(([key, value]) => key),
    )
    .flat()
  // const placeholders = schoolData
  //   .map(obj =>
  //     Object.entries(obj)
  //       .filter(([key, value]) => key !== "undefined")
  //       .map(() => "?"),
  //   )
  //   .flat()
  
  const data = schoolData
    .map(obj =>
      Object.entries(obj)
        .filter(([key, value]) => key !== "undefined")
        .map(([key, value]) => value),
    )
    .flat()

    console.log(columns)
    console.log(data)

  
  // const insert_school_data = db.prepare(/*sql*/ `INSERT INTO school_data (${columns}) VALUES (${data})
  //   `);
    const insert_school_data = db.prepare(/*sql*/ `INSERT INTO school_data (state,district,block,urban) VALUES ('Delhi',
    'North West A',
    'DoE Zone-10',
    '2-Urban')
    `);
    insert_school_data.run()

}

const run = async () => {
  const pdfPath =
    "/Users/eazzopardi/code/agency-scraper/sample report card (1).pdf"

  const pdfSchoolData = await parseLocalPDF(pdfPath)
  insertSchoolData(pdfSchoolData)
}

run()
