import fs from "fs"
// eslint-disable-next-line import/no-extraneous-dependencies
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs"

function extractText(pdfUrl) {
  const loadingTask = getDocument(pdfUrl)
  loadingTask.promise
    .then(async pdf => {
      const countPromises = []
      countPromises.push(
        pdf.getPage(2).then(async page => {
          const textContent = await page.getTextContent()
          return textContent.items.map(item => ({
            text: item.str,
            x: item.transform[4], // x-coordinate
            y: item.transform[5]  // y-coordinate
          }))
        }),
      )

      const texts = await Promise.all(countPromises)
      return texts.flat()
    })
    .then(items => {
		// console.log(items)
		const format = items.map(item => `${item.text} (${item.x}, ${item.y})`).join('\n');
		console.log(format)
		fs.writeFileSync("output_with_coordinates.txt", format);
    })
    .catch(err => {
      console.error(`Error: ${err}`)
    })
}

extractText("/Users/eazzopardi/code/agency-scraper/sample report card (1).pdf")
