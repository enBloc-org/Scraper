import { readFileSync } from "fs"
import pdf from "pdf-parse"

import variables from "./variables.js"

const variablesArr = Object.keys(variables)
variablesArr.push("Visit of school for / by")

const parseDocument = async pdfPath => {
  const dataBuffer = readFileSync(pdfPath);
  const options = {
    max: 1,
  };

  try {
    const pdfdata = await pdf(dataBuffer, options)
    return pdfdata
  } catch (error) {
    console.error(error)
    throw error
  }
};

const processUdiseCode = (data) => {
  const regex = /UDISE CODE(.*?)School Name/g;
  const match = regex.exec(data[3]);
  if (match && match[1]) {
    const udise_code = { udise_code : match[1].trim() } // Trim any leading/trailing spaces
    return udise_code;
  }
  else return null
}


const processGeneralData = async pdfPath => {
  const schoolDataArr = []

  const parsedpdf = await parseDocument(pdfPath)
  const pdftext = parsedpdf.text

  const allValues = pdftext.split("\n")
  
  const udise_code = processUdiseCode(allValues)
  schoolDataArr.push(udise_code)

  // udise_code and schoolname are not split by \n so need an alternative process
  
  allValues.forEach((word, i) => {
    const splitPoint = word.search(/[a-z][A-Z]/)

    let splitWord = word

    if (splitPoint !== -1) {
      splitWord = word.substring(splitPoint + 1)
    }

    if (variablesArr.some(variable => variable.includes(splitWord))) {
      const value = allValues[i + 1]

      if (!variablesArr.includes(value)) {
        const columns = variables[splitWord]
        const dataObject = { [columns]: value }
        schoolDataArr.push(dataObject)
      }
    }
  })
  return schoolDataArr
}


export default processGeneralData
