import { readFileSync } from "fs"
import pdf from "pdf-parse"
import variables from "./variables.js"

const variablesArr = Object.keys(variables)
variablesArr.push("Visit of school for / by")

const fuzzyMatch = (matchObj, array) => {

  // create regex string from matchObj.input
  const regexString = matchObj.input
    .split("")
    .map(char => `[${char}]`)
    .join(".*?")

  // look through each character of the regex string, allowing for extra characters
  const regex = new RegExp(regexString, "i") // 'i' flag for case-insensitive match
  
  // filter through variablesArr to see if item matches regex created from the matchObj input
  const filteredVariables = array.filter(item => regex.test(item))
  const filterArr = []

  // add each match to filterArr
  filteredVariables.forEach(filteredItem => {
    filterArr.push(filteredItem);
  });
  
  console.log(filterArr)
  
  return filteredVariables
}

const parseDocument = async pdfPath => {
  const dataBuffer = readFileSync(pdfPath)
  const options = {
    max: 1,
  }
  try {
    const pdfdata = await pdf(dataBuffer, options)
    return pdfdata
  } catch (error) {
    console.error(error)
    throw error
  }
}

const extractValue = (data, regexPattern) => {
  const regex = new RegExp(regexPattern)
  const match = regex.exec(data[3])
  if (match && match[1]) {
    return match[1].trim() // Trim any leading/trailing spaces
  } else {
    return "*"
  }
}

const processGeneralData = async pdfPath => {
  const schoolDataArr = []
  const parsedpdf = await parseDocument(pdfPath)
  const pdftext = parsedpdf.text

  const all = pdftext.split("\n")

  const udiseRegex = /UDISE CODE(.*?)School Name/g
  const schoolRegex = /School Name(.*?)$/

  const udise_code = { udise_code: extractValue(all, udiseRegex) }
  const schoolname = { schoolname: extractValue(all, schoolRegex) }

  schoolDataArr.push(udise_code, schoolname)

  for (let i = 0; i < all.length; i++) {
    const word = all[i]
    const value = all[i + 1]

    // DIGIBOARD
    if (
      word === "DigiBoard" &&
      variablesArr.some(variable => variable.includes(word))
    ) {
      const columns = variables[word]
      const dataObject = { [columns]: value }
      schoolDataArr.push(dataObject)
    } else {
      
      // ALL OTHER VALUES
      const splitPoint = word.search(/[a-z][A-Z]/)
      let splitWord = word
      
      if (splitPoint !== -1) {
        splitWord = word.substring(splitPoint + 1)
      }

      if (
        variablesArr.some(variable => variable.includes(splitWord)) &&
        !variablesArr.includes(value)
      ) {
        const columns = variables[splitWord]
        const dataObject = { [columns]: value }
        schoolDataArr.push(dataObject)
      }
      // TYPOS

      const matchObj = {input: splitWord, value}
      const matchingVariables = fuzzyMatch(matchObj, variablesArr)

      // check if key value pairs are already in schoolDataArr
      // add in any previously missed values

      }

  }

  return schoolDataArr
}

export default processGeneralData
