import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs"
import enrolment_and_minority from "./coordinates.js"

const parseDocument = pdf => {
  return pdf.getPage(2).then(page => page.getTextContent())
}

const processColumn = (item, gradeData, grade, row) => {
  for (const col in gradeData) {
    if (gradeData.hasOwnProperty(col)) {
      const { xmin, xmax } = gradeData[col]
      if (item.x >= xmin && item.x <= xmax) {
        return { key: `${row}_${grade}_${col}`, value: item.text }
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

const createObject = textContent => {
  const items = textContent.items.map(item => ({
    text: item.str,
    x: item.transform[4], // x-coordinate
    y: item.transform[5], // y-coordinate
  }))

  const results = items.flatMap(item =>
    processItem(item, enrolment_and_minority),
  )

  // Now create the final object
  const tableData = results.reduce((acc, { key, value }) => {
    acc[key] = value
    return acc
  }, {})

  return tableData
}

const processTableData = async pdf => {
  try {
    const loadingTask = getDocument(pdf)
    const pdfDocument = await loadingTask.promise
    const parsedDocument = await parseDocument(pdfDocument)
    const tableData = createObject(parsedDocument)
    return tableData
  } catch (err) {
    console.error(`Error: ${err}`)
  }
}

export default processTableData
