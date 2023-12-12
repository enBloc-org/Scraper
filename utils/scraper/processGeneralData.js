const fs = require("fs")
const pdf = require("pdf-parse")

const mapVariablesToColumns = require("./mapVariablesToColumns")
const variablesArr = Object.keys(mapVariablesToColumns)
variablesArr.push("Visit of school for / by")

const processGeneralData = async pdfText => {
  const allValues = pdfText.split("\n")
  // udise_code and schoolname are not split by \n so need an alternative process
  const schoolDataArr = []
  allValues.forEach((word, i) => {
    const splitPoint = word.search(/[a-z][A-Z]/)

    let splitWord = word

    if (splitPoint !== -1) {
      splitWord = word.substring(splitPoint + 1)
    }

    if (variablesArr.some(variable => variable.includes(splitWord))) {
      const value = allValues[i + 1]

      if (!variablesArr.includes(value)) {
        const columns = mapVariablesToColumns[splitWord]
        const dataObject = { [columns]: value }
        schoolDataArr.push(dataObject)
      }
    }
  })

  return schoolDataArr
}

const parseLocalPDF = async pdfPath => {
  const dataBuffer = fs.readFileSync(pdfPath)
  // temporarily limit parsing to the first page only
  const options = {
    max: 1,
  }
  const pdfdata = await pdf(dataBuffer, options)
  const processedData = processGeneralData(pdfdata.text)
  return processedData
}

module.exports = parseLocalPDF
