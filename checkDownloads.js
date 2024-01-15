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
  console.log("Checking Downloads")

  const yearValue = {
    5: "2018-19",
    6: "2019-20",
    7: "2020-21",
    8: "2021-22",
    9: "2022-23",
  }

  let filesChecked = 0

  for (const state of states) {
    for (const district of state.districts) {
      for (const block of district.blocks) {
        for (const school of block.schoolList) {
          for (let i = 5; i <= 9; i++) {
            const currentYear = i

            // only action endpoints where a download is expected to be available
            if (
              school[
                `isOperational${yearValue[currentYear].replace("-", "")}`
              ] === 0
            ) {
              const oldFileName = path.join(
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

              if (fs.existsSync(oldFileName)) {
                const content = fs
                  .readFileSync(oldFileName, "utf-8")
                  .substring(0, 9)

                const isValidContent = content === "JVBERi0xL"

                // retry downloading if the file is corrupted
                if (!isValidContent) {
                  console.groupCollapsed("Retrying")

                  await new Promise(async resolve => {
                    fs.unlinkSync(oldFileName)
                    const trigger = await schoolDownload(
                      school,
                      currentYear,
                      oldFileName,
                    )
                    resolve(trigger)
                  })

                  console.groupEnd()
                }

                // rename the file after checking
                fs.renameSync(oldFileName, newFileName)

                filesChecked++
              } else if (fs.existsSync(newFileName)) {
                // check file under new name if it exists
                const content = fs
                  .readFileSync(newFileName, "utf-8")
                  .substring(0, 9)

                const isValidContent = content === "JVBERi0xL"

                // retry downloading if the file is corrupted
                if (!isValidContent) {
                  console.groupCollapsed("Retrying")

                  await new Promise(async resolve => {
                    fs.unlinkSync(newFileName)
                    const trigger = await schoolDownload(
                      school,
                      currentYear,
                      newFileName,
                    )
                    resolve(trigger)
                  })

                  console.groupEnd()
                }

                filesChecked++
              }
            }
          }
        }
      }
    }
  }

  console.log(`${filesChecked} files checked`)
}

iterateChecker()
