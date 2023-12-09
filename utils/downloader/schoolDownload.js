const path = require("path")
const fs = require("fs")
const base64 = require("base64topdf")
const pdfParse = require("pdf-parse")

const requestCookie = process.env.COOKIE
const delayInterval = process.env.DELAY
const { errorLogColour, fifthLogColour } = require("../colours.js")

/**
 *
 * @param {*} givenSchool should be the full object of the school being currently processed
 * @param {*} currentYear should always be a number between 5 and 9 as it will be passed as a param in the fetch request
 * @returns a promise which will be fulfilled if the pdf targeted has been downloaded and successfuly parsed
 * @remarks this function will be called for each school and once per year code available from within runSchools.js
 */
const schoolDownload = async (givenSchool, currentYear) => {
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

  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(
        "https://src.udiseplus.gov.in/NewReportCard/PdfReportSchId",
        options,
      )
      const reader = response.body.getReader()

      const base64StringPath = path.join(
        __dirname,
        "downloads",
        `${yearValue[currentYear]}_${givenSchool.schoolName.replace(" ", "-")}`,
      )
      const pdfWriteStream = fs.createWriteStream(base64StringPath)

      // helper function
      /**
       * @returns this function will resolve the promise made at the top level of schoolDownload once a pdf file is successfully parsed
       * @remarks this function will be recalled if the download of the target pdf is not successful
       */
      const convertBase64 = async () => {
        const base64String = fs.readFileSync(base64StringPath, "utf-8")
        const pdfFilePath = path.join(
          __dirname,
          "downloads",
          `${yearValue[currentYear]}-${givenSchool.schoolName}.pdf`,
        )

        // helper function
        /**
         *
         * @param {*} pdfFile should be the path created for a pdf file to be written from the decoded base64 download returned from our fetch call
         * @returns a boolean conditional on whether the target pdf has a valid pdf structure
         */
        const validatePDF = async pdfFile => {
          try {
            const data = await pdfParse(pdfFile)
            return data && data.text && data.text.length > 0
          } catch (error) {
            return false
          }
        }

        base64.base64Decode(base64String, pdfFilePath)

        const isValidPDF = await validatePDF(pdfFilePath)
        if (isValidPDF) {
          fs.unlinkSync(base64StringPath)
          console.log(fifthLogColour, `${yearValue[currentYear]} Downloaded`)
          resolve()
        } else {
          setTimeout(() => {
            fs.unlinkSync(pdfFilePath)
            return convertBase64()
          }, delayInterval * 2)
        }
      }

      /**
       *
       * @returns base64 string to be decoded into a pdf
       * @remarks recursive function processing data stream from our fetch call
       */
      const pump = async () => {
        const { done, value } = await reader.read()

        // base case
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
