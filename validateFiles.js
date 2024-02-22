import path from "path"
import fs from "fs"

import { parseDocument } from "./utils/scraper/processGeneralData.js"
import { bgLogColour, errorLogColour } from "./utils/colours.js"

const __dirname = new URL(".", import.meta.url).pathname

const originalFolder = path.resolve(__dirname, "./utils/converter/downloads")
const originalFiles = fs.readdirSync(originalFolder)
const originalPathsList = originalFiles.map(file =>
  path.join(originalFolder, file),
)

const targetFolder = path.resolve(
  __dirname,
  "./utils/converter/corrupted_downloads",
)

const checkPdfContents = async pdfpath => {
  const pdfdata = await parseDocument(pdfpath)
  const pdftext = pdfdata.text
  if (pdftext === "\n\n") {
    const corruptedFilePath = path.join(targetFolder, path.basename(pdfpath))
    console.log(corruptedFilePath)
    console.log(errorLogColour, "corrupted pdf")
    fs.renameSync(pdfpath, corruptedFilePath)
  } else {
    console.log(bgLogColour, "valid pdf")
  }
}

const validateFiles = async () => {
  const corrupted_downloadsDir = path.join(
    __dirname,
    "utils",
    "converter",
    "corrupted_downloads",
  )
  if (!fs.existsSync(corrupted_downloadsDir)) {
    fs.mkdirSync(corrupted_downloadsDir)
  }
  if (originalPathsList.length === 0) {
    console.log(errorLogColour, "No files available to validate")
    return
  }

  let totalProcessed = 0

  for (let index = 0; index < originalPathsList.length; index++) {
    if (!originalPathsList[index].includes(".DS_Store")) {
      try {
        await checkPdfContents(originalPathsList[index])
        totalProcessed++
        console.log(totalProcessed)
      } catch (error) {
        console.error(
          errorLogColour,
          `Error scraping ${originalPathsList[index]}: ${error}`,
        )
      }
    }
  }

  console.log(bgLogColour, `${totalProcessed} files validated`)
}

validateFiles()
