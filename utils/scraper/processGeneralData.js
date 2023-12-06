const fs = require("fs")
const pdf = require("pdf-parse")

const mapVariablesToColumns = require('./mapVariablesToColumns')

const processGeneralData = (pdfText) => {
  const allValues = pdfText.split("\n")
  const variablesArr = [
    "State",
    "District",
    "Block",
    "Rural / Urban",
    "Cluster",
    "Ward",
    "Mohalla",
    "Pincode",
    "Panchayat",
    "City",
    "Municipality",
    "School Category",
    "School Management",
    "Medium 1",
    "Medium 2",
    "Medium 3",
    "Medium 4",
    "Year of Establishment",
    "Is this a Shift School?",
    "Anganwadi At Premises",
    "Year of Recognition-Pri",
    "Building Status",
    "Anganwadi Boys",
    "Year of Recognition-Upr.Pri",
    "Boundary Wall",
    "Anganwadi Girls",
    "Year of Recognition-Sec",
    "No.of Building Blocks",
    "Anganwadi Worker",
    "Year of Recognition-Higher Sec",
    "Pucaa Building Blocks",
    "Residential School",
    "Is Special School for CWSN?",
    "Residential Type",
    "Availability of Ramps",
    "Minority School",
    "Availability of Handrails",
    "Approachable By All Weather Road",
  ]
  const schoolDataArr = []

  allValues.forEach((word, i) => {
    // Check for concatenated strings
    const splitPoint = word.search(/[a-z][A-Z]/)
    let splitWords = word

    if (splitPoint !== -1) {
      // Split the word at the point where lowercase is followed by uppercase
      splitWords = word.substring(splitPoint + 1)
    }
    // identify the variables by checking that the string in allValues matches a string in variablesArr
    if (variablesArr.some(variable => splitWords.includes(variable))) {
      // identify values
      const value = allValues[i + 1]
      // Check that value exists in allValues but not in variablesArr. This is looking for a variable followed by another variable (and therefore an empty value)
      if (!variablesArr.some(variable => value.includes(variable))) {
        const columns = mapVariablesToColumns[splitWords]
        const dataObject = {}
        dataObject[columns] = value
        schoolDataArr.push(dataObject)
      }
    }
  })
  return schoolDataArr
}

const parseLocalPDF = async (pdfPath) => {
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
