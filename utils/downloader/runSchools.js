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
          `Downloading ${currentSchool.schoolName} - ${index + 1}/${
            givenBlock.schoolList.length
          }`,
        )

        for (let i = 5; i <= 9; i++) {
          const currentYear = i
          const schoolLoop = await new Promise(resolve => {
            setTimeout(async () => {
              const trigger = await schoolDownload(currentSchool, currentYear)
              resolve(trigger)
            }, delayInterval)
          })
          await schoolLoop
        }
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
