import fs from 'fs'
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs"
import { enrolment_and_minority, rte, ews } from "./coordinates.js"

const parsePage1 = async pdf => {
  return pdf.getPage(1).then(page => page.getTextContent())
}

const parsePage2 = async pdf => {
  return pdf.getPage(2).then(page => page.getTextContent())
}

const processColumn = (item, gradeData, grade, row) => {
  for (const col in gradeData) {
    if (gradeData.hasOwnProperty(col)) {
      const { xmin, xmax } = gradeData[col]

      if (item.x >= xmin && item.x <= xmax) {
        return {
          key: `${row}_${grade}_${col}`,
          value: `${item.text}`,
          x: `${item.x}`,
          y: `${item.y}`,
        }
      }
    }
  }
  return null
}

const processGrade = (item, grades, row) => {
  const results = []
  for (const grade in grades) {
    if (grades.hasOwnProperty(grade)) {
      const gradeData = grades[grade]
      const result = processColumn(item, gradeData, grade, row)
      if (result) {
        results.push(result)
      }
    }
  }
  return results
}

const processItem = (item, obj) => {
  const results = []
  for (const row in obj) {
    if (row !== "grade" && obj.hasOwnProperty(row)) {
      const { ymin, ymax } = obj[row]
      if (item.y >= ymin && item.y <= ymax) {
        const rowData = processGrade(item, obj.grade, row)
        results.push(...rowData)
      }
    }
  }
  return results
}

const createObject = (page1, page2) => {
  const items1 = page1.items.map(item => ({
    text: item.str,
    x: item.transform[4], // x-coordinate
    y: item.transform[5], // y-coordinate
  }))

  const rte_results = items1.flatMap(item => processItem(item, rte))

  const ews_results = items1.flatMap(item => processItem(item, ews))
  console.log(ews_results)

//   let listitems = '';
// ews_results.forEach(item => {
//   if (item) {
//     listitems += `Text: ${item.value}, Key: ${item.key}, X: ${item.x}, Y: ${item.y}\n`; // Append each item to listitems
//   }
// });
// fs.writeFileSync('ews_results.txt', listitems);


  const items2 = page2.items.map(item => ({
    text: item.str,
    x: item.transform[4], // x-coordinate
    y: item.transform[5], // y-coordinate
  }))

  const en_min_results = items2.flatMap(item =>
    processItem(item, enrolment_and_minority),
  )

  const results = [...en_min_results, ...rte_results]

  const allTableData = results.reduce((acc, { key, value }) => {
    acc[key] = value
    return acc
  }, {})

  return allTableData
}

const processTableData = async pdf => {
  try {
    const loadingTask = getDocument(pdf)
    const pdfDocument = await loadingTask.promise

    const parsedPage1 = await parsePage1(pdfDocument)
    const parsedPage2 = await parsePage2(pdfDocument)

    const allTableData = createObject(parsedPage1, parsedPage2)

    return allTableData
  } catch (err) {
    console.error(`Error: ${err}`)
  }
}

processTableData("/Users/eazzopardi/code/agency-scraper/sample report card (1).pdf")

export default processTableData
