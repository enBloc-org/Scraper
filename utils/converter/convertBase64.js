import "dotenv/config.js"
import path from "path"
import fs from "fs"
import base64 from "base64topdf"

import { firstLogColour } from "../colours.js"

const __dirname = new URL(".", import.meta.url).pathname
const downloadsDir = path.join(__dirname, "downloads")
if (!fs.existsSync(downloadsDir)) {
  fs.mkdirSync(downloadsDir)
}

export const convertBase64 = async base64StringPath => {
  const base64String = fs.readFileSync(base64StringPath, "utf-8")
  const baseTitle = path.basename(base64StringPath)

  const pdfFilePath = path.join(__dirname, "downloads", `${baseTitle}.pdf`)
  if (fs.existsSync(pdfFilePath)) {
    console.log("Already Converted")
    console.groupEnd()
    return
  }

  console.groupCollapsed()
  await new Promise(deliver => {
    const trigger = base64.base64Decode(base64String, pdfFilePath)
    deliver(trigger)
  })
  console.log(firstLogColour, `${baseTitle.replace("_", " ")} converted to PDF`)
  // fs.unlinkSync(base64StringPath)

  console.groupEnd()
}
