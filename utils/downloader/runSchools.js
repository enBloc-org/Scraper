require("dotenv").config()
const fs = require("fs")
const path = require("path")
const base64 = require("base64topdf")

const delayInterval = process.env.DELAY
const requestCookie = process.env.COOKIE

const { errorLogColour, fourthLogColour } = require("../colours")

const downloadsDir = path.join(__dirname, "downloads")
if (!fs.existsSync(downloadsDir)) {
  fs.mkdirSync(downloadsDir)
}

const schoolDownload = async givenSchool => {
  const givenSchoolId = givenSchool.schoolId
  // const yearId = 7 // NEEDS TO ITERATE 5,6,7,8 and 9

  const options = {
    method: "POST",
    headers: {
      cookie: requestCookie,
      "Content-Type": "application/x-www-form-urlencoded",
      "User-Agent": "insomnia/8.4.0",
    },
    body: new URLSearchParams({ schoolId: givenSchoolId, yearId: "7" }),
  }

  try {
    const response = await fetch(
      "https://src.udiseplus.gov.in/NewReportCard/PdfReportSchId",
      options,
    )
    const reader = response.body.getReader()

    const base64StringPath = path.join(
      __dirname,
      "downloads",
      `${givenSchool.schoolName.replace(" ", "-")}`,
    )
    const pdfWriteStream = fs.createWriteStream(base64StringPath)

    const convertBase64 = async () => {
      const base64String = fs.readFileSync(base64StringPath, "utf-8")
      const pdfFilePath = path.join(
        __dirname,
        "downloads",
        `${givenSchool.schoolName}.pdf`,
      )

      await base64.base64Decode(base64String, pdfFilePath)
      fs.unlinkSync(base64StringPath)
    }

    const pump = async () => {
      const { done, value } = await reader.read()

      //base case
      if (done) {
        pdfWriteStream.end()
        await convertBase64()

        return
      }

      // function declaration
      pdfWriteStream.write(value, "binary")
      await pump()
    }

    // recursive call command
    pdfWriteStream.on("open", async () => {
      await pump()
    })
  } catch (error) {
    console.error(errorLogColour, `Error downloading pdf: ${error}`)
    throw error
  }
}

const runSchools = async givenBlock => {
  try {
    const runSingleSchool = async index => {
      const currentSchool = givenBlock.schoolList[index]

      // base case
      if (index >= givenBlock.schoolList.length) {
        console.log(
          fourthLogColour,
          `${givenBlock.eduBlockName} Block Processed`,
        )

        return
      }

      // function declaration
      try {
        console.groupCollapsed(
          fourthLogColour,
          `Downloading ${currentSchool.schoolName}`,
        )

        await schoolDownload(currentSchool)

        console.groupEnd()

        const result = await new Promise(resolve => {
          setTimeout(async () => {
            const trigger = await runSingleSchool(index + 1)
            resolve(trigger)
          }, delayInterval)
        })

        return result
      } catch (error) {
        console.error(errorLogColour, `Error running School: ${error}`)
        throw error
      }
    }

    // recursive call command
    return runSingleSchool(0)
  } catch (error) {
    console.error(errorLogColour, `Error running schools: ${error}`)
    throw error
  }
}

module.exports = { runSchools }
