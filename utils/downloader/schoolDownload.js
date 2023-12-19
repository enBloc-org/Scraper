import path from "path"
import fs from "fs"

import { errorLogColour, fifthLogColour } from "../colours.js"

const requestCookie = process.env.COOKIE
const __dirname = new URL(".", import.meta.url).pathname

/**
 *
 * @param {*} givenSchool should be the full object of the school being currently processed
 * @param {*} currentYear should always be a number between 5 and 9 as it will be passed as a param in the fetch request
 * @returns a promise which will be fulfilled if the fetch call is successful and a base64 file has been created
 */
export const schoolDownload = async (givenSchool, currentYear) => {
  const givenSchoolId = givenSchool.schoolId

  const yearValue = {
    5: "2018-19",
    6: "2019-20",
    7: "2020-21",
    8: "2021-22",
    9: "2022-23",
  }

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

  return new Promise(async (resolve, reject) => {
    const base64StringPath = path.join(
      __dirname,
      "downloads",
      `${yearValue[currentYear]}_${givenSchool.schoolName.replace(
        /[/?<>\\:*|"\s]/g,
        "-",
      )}`,
    )

    try {
      const response = await fetch(
        "https://src.udiseplus.gov.in/NewReportCard/PdfReportSchId",
        options,
      )
      const reader = response.body.getReader()

      const pdfWriteStream = fs.createWriteStream(base64StringPath)

      const writeBase64File = async () => {
        const { done, value } = await reader.read()

        // base case
        if (done) {
          pdfWriteStream.end()
          console.log(fifthLogColour, `${yearValue[currentYear]} Downloaded`)
          fs.unwatchFile(base64StringPath)
          resolve()
          return
        }

        // function declaration
        pdfWriteStream.write(value, "binary")
        await writeBase64File()
      }

      // recursive call command
      pdfWriteStream.on("open", async () => {
        await writeBase64File()
      })
    } catch (error) {
      console.error(errorLogColour, `Error downloading pdf: ${error}`)
      reject(error)
    }
  })
}
