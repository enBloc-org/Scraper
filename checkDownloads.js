import path from "path"
import fs from "fs"
import { errorLogColour } from "./utils/colours.js"
import { selectLatest } from "./model/states.js"
import { schoolDownload } from "./utils/downloader/schoolDownload.js"

const __dirname = new URL(".", import.meta.url).pathname
const downloadsDir = path.resolve(__dirname, "utils/downloader/downloads")

const statesJson = selectLatest()
const states = JSON.parse(statesJson.states_file)

const iterateChecker = async () => {
  if (!fs.existsSync(downloadsDir)) {
    console.log(errorLogColour, "No files downloaded")
    return
  }

  const yearValue = {
    5: "2018-19",
    6: "2019-20",
    7: "2020-21",
    8: "2021-22",
    9: "2022-23",
  }

  for (const state of states) {
    for (const district of state.districts) {
      for (const block of district.blocks) {
        for (const school of block.schoolList) {
          for (let i = 5; i <= 9; i++) {
            const currentYear = i

            const currentFileName = path.join(
              downloadsDir,
              `${school.districtId}-${school.blockId}_${
                yearValue[currentYear]
              }_${school.schoolName.replace(/[/?<>\\:*|"\s]/g, "-")}`,
            )

            const newFileName = path.join(
              downloadsDir,
              `${school.schoolId}_${
                yearValue[currentYear]
              }_${school.schoolName.replace(/[/?<>\\:*|"\s]/g, "-")}`,
            )

            if (fs.existsSync(currentFileName)) {
              const content = fs.readFileSync(currentFileName)
              if (content.length === 0) {
                await new Promise(async resolve => {
                  fs.unlinkSync(currentFileName)
                  console.groupCollapsed(path.basename(currentFileName))
                  const trigger = await schoolDownload(
                    school,
                    currentYear,
                    currentFileName,
                  )
                  console.groupEnd()
                  resolve(trigger)
                })
              }

              fs.renameSync(currentFileName, newFileName)
            } else {
              console.groupCollapsed(newFileName)
              schoolDownload(school, currentYear, newFileName)
              console.groupEnd()
            }
          }
        }
      }
    }
  }
}

iterateChecker()
