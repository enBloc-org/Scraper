const path = require("path")
const fs = require("fs")
const base64 = require("base64topdf")

const requestCookie = process.env.COOKIE

const { errorLogColour } = require("../colours.js")

const schoolDownload = async (givenSchool, currentYear) => {
  return new Promise(async (resolve, reject) => {
    const givenSchoolId = givenSchool.schoolId

    const options = {
      method: "POST",
      headers: {
        cookie: requestCookie,
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "insomnia/8.4.0",
      },
      body: new URLSearchParams({
        schoolId: givenSchoolId,
        yearId: currentYear,
      }),
    }

    const yearValue = {
      5: "2018-19",
      6: "2019-20",
      7: "2020-21",
      8: "2021-22",
      9: "2022-23",
    }

    try {
      const response = await fetch(
        "https://src.udiseplus.gov.in/NewReportCard/PdfReportSchId",
        options,
      )
      const reader = await response.body.getReader()
      const base64StringPath = path.join(
        __dirname,
        "downloads",
        `${yearValue[currentYear]}-${givenSchool.schoolName.replace(" ", "-")}`,
      )
      const pdfWriteStream = fs.createWriteStream(base64StringPath)

      const convertBase64 = async () => {
        const base64String = fs.readFileSync(base64StringPath, "utf-8")
        const pdfFilePath = path.join(
          __dirname,
          "downloads",
          `${yearValue[currentYear]}-${givenSchool.schoolName}.pdf`,
        )

        base64.base64Decode(base64String, pdfFilePath)
        fs.unlinkSync(base64StringPath)
        console.log(`${yearValue[currentYear]} Downloaded`)
        resolve()
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
      reject(error)
    }
  })
}

module.exports = { schoolDownload }
