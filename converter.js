const path = require("path")
const fs = require("fs")
const { convertBase64 } = require("./utils/converter/convertBase64.js")
const { errorLogColour, bgLogColour } = require("./utils/colours.js")

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
      })
      totalProcessed++
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
