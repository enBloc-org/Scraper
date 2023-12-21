import path from "path"
import fs from "fs"
import { convertBase64 } from "./utils/converter/convertBase64.js"
import { errorLogColour, bgLogColour } from "./utils/colours.js"

const __dirname = new URL(".", import.meta.url).pathname
const targetFolder = path.resolve(__dirname, "./utils/downloader/downloads/")
const targetFiles = fs.readdirSync(targetFolder)
const pathsList = targetFiles.map(file => path.join(targetFolder, file))

const converter = async () => {
  if (pathsList.length === 0) {
    console.log(errorLogColour, "No files available to convert")
    return
  }

  let totalProcessed = 0

  for (let index = 0; index < pathsList.length; index++) {
    try {
      await new Promise(resolve => {
        const trigger = convertBase64(pathsList[index])
        resolve(trigger)
        totalProcessed++
      })

      const targetBaseTitle = path.basename(pathsList[index])
      const outputFile = path.join(
        __dirname,
        "utils",
        "converter",
        "downloads",
        `${targetBaseTitle}.pdf`,
      )
      const pdfCheck = fs.readFileSync(outputFile)

      if (pdfCheck.length === 0) {
        fs.unlinkSync(outputFile)
        console.log("RETRYING")
        await new Promise(fulfill => {
          const retry = convertBase64(pathsList[index])
          fulfill(retry)
        })
      }
    } catch (error) {
      console.error(
        errorLogColour,
        `Error converting ${pathsList[index]}: ${error}`,
      )
      throw error
    }
  }

  console.log(bgLogColour, `${totalProcessed} files converted to PDF`)
}

converter()
