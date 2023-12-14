import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs"
import enrolment_and_minority from "./coordinates.mjs"

const processDocument = (pdf) => {
  return pdf.getPage(2).then(page => page.getTextContent());
}

const processColumn = (item, gradeData, grade, y) => {
  for (const col in gradeData) {
    if (gradeData.hasOwnProperty(col)) {
      const { xmin, xmax } = gradeData[col];
      if (item.x >= xmin && item.x <= xmax && Math.abs(item.y - y) <= 1) {
        console.log(`${grade}_${col}: ${item.text}`);
      }
    }
  }
}


const processGrade = (item, grades, y) => {
  for (const grade in grades) {
    if (grades.hasOwnProperty(grade)) {
      const gradeData = grades[grade];
      processColumn(item, gradeData, grade, y);
    }
  }
}

const processItem = (item, obj) => {
  for (const row in obj) {
    if (row !== 'grade' && obj.hasOwnProperty(row)) {
      const y = obj[row];
      processGrade(item, obj.grade, y);
    }
  }
}

const filterItems = (textContent) => {
  const items = textContent.items.map(item => ({
    text: item.str,
    x: item.transform[4], // x-coordinate
    y: item.transform[5]  // y-coordinate
  }));



  items.forEach(item => {
    processItem(item, enrolment_and_minority);
  });
}



const extractText = (url) => {
  const loadingTask = getDocument(url);
  loadingTask.promise
    .then(processDocument)
    .then(filterItems)
    .catch(err => {
      console.error(`Error: ${err}`);
    });
}


extractText("/Users/eazzopardi/code/agency-scraper/sample report card (1).pdf")
