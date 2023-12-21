import path from "path"
import fs from "fs"

import scraper from "./scraper.js"
import { bgLogColour, errorLogColour } from "./utils/colours.js"

const __dirname = new URL(".", import.meta.url).pathname
const targetFolder = path.resolve(__dirname, "./utils/converter/downloads")
const targetFiles = fs.readdirSync(targetFolder)

const pathsList = targetFiles.map(file => path.join(targetFolder, file))

const iterateScraper = async () => {
  if (pathsList.length === 0) {
    console.log(errorLogColour, "No files available to scrape")
    return
  }

  let totalProcessed = 0

  for (let index = 0; index < pathsList.length; index++) {
    try {
      await new Promise(async resolve => {
        const trigger = await scraper(pathsList[index])
        resolve(trigger)
      })
      totalProcessed++
    } catch (error) {
      console.error(
        errorLogColour,
        `Error scraping ${pathsList[index]}: ${error}`,
      )
      throw error
    }
  }

  console.log(bgLogColour, `${totalProcessed} files Scraped`)
}

iterateScraper()
