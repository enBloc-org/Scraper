require("dotenv").config()
const path = require("path")
const fs = require("fs")
const base64 = require("base64topdf")

const delayInterval = process.env.DELAY
const { firstLogColour } = require("../colours.js")

const downloadsDir = path.join(__dirname, "downloads")
if (!fs.existsSync(downloadsDir)) {
  fs.mkdirSync(downloadsDir)
}

const convertBase64 = async base64StringPath => {
  const base64String = fs.readFileSync(base64StringPath, "utf-8")
  const baseTitle = path.basename(base64StringPath)
  const pdfFilePath = path.join(__dirname, "downloads", `${baseTitle}.pdf`)

  console.groupCollapsed()
  await new Promise(deliver => {
    setTimeout(() => {
      const trigger = base64.base64Decode(base64String, pdfFilePath)
      deliver(trigger)
    }, delayInterval / 2)
  })
  console.log(firstLogColour, `${baseTitle.replace("_", " ")} converted to PDF`)
  // fs.unlinkSync(base64StringPath)

  console.groupEnd()
}

module.exports = { convertBase64 }
