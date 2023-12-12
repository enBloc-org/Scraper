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
        `Donwloading ${currentSchool.schoolName} - ${index + 1}/${
          givenBlock.schoolList.length
        }`,
      )

      try {
        for (let i = 5; i <= 9; i++) {
          const currentYear = i
          await new Promise(resolve => {
            setTimeout(async () => {
              const download = await schoolDownload(currentSchool, currentYear)
              resolve(download)
            }, delayInterval)
          })
        }

        console.groupEnd()
      } catch (error) {
        console.error(errorLogColour, `Error running School: ${error}`)
        throw error
      }

      console.log(fourthLogColour, `${givenBlock.eduBlockName} Block processed`)
    }
  } catch (error) {
    console.error(errorLogColour, `Error running schools: ${error}`)
    throw error
  }
}

module.exports = { runSchools }
