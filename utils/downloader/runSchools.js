import "dotenv/config"
import fs from "fs"
import path from "path"

import { errorLogColour, fourthLogColour } from "../colours.js"
import { schoolDownload } from "../downloader/schoolDownload.js"

// create downloads directory if none exists
const __dirname = new URL(".", import.meta.url).pathname
const downloadsDir = path.join(__dirname, "downloads")
if (!fs.existsSync(downloadsDir)) {
  fs.mkdirSync(downloadsDir)
}

/**
 *
 * @param {*} givenBlock should be the full object of the block currently being processed
 * @returns no value
 * @remarks this is a recursive function that allows us to process each school in a block in succession
 */
export const runSchools = async givenBlock => {
  try {
    for (let index = 0; index < givenBlock.schoolList.length; index++) {
      const currentSchool = givenBlock.schoolList[index]

      console.groupCollapsed(
        fourthLogColour,
        `Downloading ${currentSchool.schoolName} - ${index + 1}/${
          givenBlock.schoolList.length
        }`,
      )

      const yearValue = {
        5: "2018-19",
        6: "2019-20",
        7: "2020-21",
        8: "2021-22",
        9: "2022-23",
      }

      try {
        for (let i = 5; i <= 9; i++) {
          const currentYear = i

          const fileName = path.join(
            __dirname,
            "downloads",
            `${yearValue[currentYear]}_${currentSchool.schoolName.replace(
              /[/?<>\\:*|"\s]/g,
              "-",
            )}`,
          )

          if (fs.existsSync(fileName)) {
            await new Promise(conclude => {
              const message = console.log("Already Downloaded")
              conclude(message)
            })
          } else if (
            currentSchool[
              `isOperational${yearValue[currentYear].replace("-", "")}`
            ] === 0
          ) {
            await new Promise(async resolve => {
              const download = await schoolDownload(currentSchool, currentYear)
              resolve(download)
            })
          } else {
            await new Promise(fullfil => {
              const log = console.log(
                `Not operational in ${yearValue[currentYear]}`,
              )
              fullfil(log)
            })
          }
        }

        console.groupEnd()
      } catch (error) {
        console.error(errorLogColour, `Error running School: ${error}`)
        throw error
      }
    }
  } catch (error) {
    console.error(errorLogColour, `Error running schools: ${error}`)
    throw error
  }
}
