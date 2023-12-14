import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs"
import enrolment_and_minority from "./coordinates.mjs"

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
            x: item.transform[4], // x-coord
            y: item.transform[5], // y-coord
          }))
        }),
      )

      const texts = await Promise.all(countPromises)
      return texts.flat()
    })
    .then(items => {
      for (const row in enrolment_and_minority) {
        if (row !== 'grade' && enrolment_and_minority.hasOwnProperty(row)) {
          const y = enrolment_and_minority[row];
          for (const grade in enrolment_and_minority.grade) {
            if (enrolment_and_minority.grade.hasOwnProperty(grade)) {
              const gradeData = enrolment_and_minority.grade[grade];
              for (const col in gradeData) {
                if (gradeData.hasOwnProperty(col)) {
                  const { xmin, xmax } = gradeData[col];
                  items.forEach(item => {
                    if (item.x >= xmin && item.x <= xmax && Math.abs(item.y - y) <= 1) {
                      console.log(`${row}_${grade}_${col.toLowerCase()}: ${item.text}`);
                    }
                  });
                }
              }
            }
          }
        }
	}
})
    .catch(err => {
      console.error(`Error: ${err}`)
    })
}

extractText("/Users/eazzopardi/code/agency-scraper/sample report card (1).pdf")
