import path from "path"
import fs from "fs"

import { parseDocument } from "./utils/scraper/processGeneralData.js"
import { bgLogColour, errorLogColour } from "./utils/colours.js"

const __dirname = new URL(".", import.meta.url).pathname
const targetFolder = path.resolve(__dirname, "./utils/converter/downloads")
const targetFiles = fs.readdirSync(targetFolder)

const pathsList = targetFiles.map(file => path.join(targetFolder, file))

const checkPdfContents = async pdfpath => {
    const pdfdata = await parseDocument(pdfpath)
    const pdftext = pdfdata.text
    if (pdftext === '\n\n'){
        console.log(errorLogColour, "corrupted pdf")
    } else console.log(bgLogColour, "valid pdf")
}

// checkPdfContents('/Users/eazzopardi/code/agency/agency-scraper/1203410_2022-23_LAYALPUR-KHALSA-COLLEGIATE-SEN.SEC-SCHOOL.pdf') // broken pdf

const validateFiles = async () => {
  if (pathsList.length === 0) {
    console.log(errorLogColour, "No files available to validate")
    return
  }

  let totalProcessed = 0

  for (let index = 0; index < pathsList.length; index++) {
    if (!pathsList[index].includes(".DS_Store")) {
      try {
        await
          checkPdfContents(pathsList[index])
          totalProcessed++
          console.log(totalProcessed)
        }
        catch (error) {
        console.error(
          errorLogColour,
          `Error scraping ${pathsList[index]}: ${error}`,
        )
      }
    }
  }

  console.log(bgLogColour, `${totalProcessed} files validated`)
}

validateFiles()
