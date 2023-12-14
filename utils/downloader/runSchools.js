require("dotenv").config()
const fs = require("fs")
const path = require("path")

const delayInterval = process.env.DELAY

const { errorLogColour, fourthLogColour } = require("../colours")
const { schoolDownload } = require("../downloader/schoolDownload.js")

// create downloads directory if none exists
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
const runSchools = async givenBlock => {
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

          if (
            currentSchool[
              `isOperational${yearValue[currentYear].replace("-", "")}`
            ] === 0
            // currentSchool.isOperational202122 === 0
          ) {
            await new Promise(resolve => {
              setTimeout(async () => {
                const download = await schoolDownload(
                  currentSchool,
                  currentYear,
                )
                resolve(download)
              }, delayInterval)
            })
          } else {
            await new Promise(fullfil => {
              setTimeout(async () => {
                const log = console.log(
                  `Not operational in ${yearValue[currentYear]}`,
                )
                fullfil(log)
              }, delayInterval / 4)
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

module.exports = { runSchools }
