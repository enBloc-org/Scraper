require("dotenv").config()
const path = require("path")
const fs = require("fs")
const base64 = require("base64topdf")

const delayInterval = process.env.DELAY
const { fifthLogColour } = require("../colours.js")

const convertBase64 = async base64StringPath => {
  const base64String = fs.readFileSync(base64StringPath, "utf-8")
  const baseTitle = path.basename(base64StringPath)
  const pdfFilePath = path.join(__dirname, "downloads", `${baseTitle}.pdf`)

  console.groupCollapsed(fifthLogColour, `${baseTitle}`)
  await new Promise(deliver => {
    setTimeout(() => {
      const trigger = base64.base64Decode(base64String, pdfFilePath)
      deliver(trigger)
    }, delayInterval / 2)
  })
  console.log("downloaded")
  // fs.unlinkSync(base64StringPath)

  console.groupEnd()
}

module.exports = { convertBase64 }
