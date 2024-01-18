import { readFileSync } from "fs"
import path from "path"
import pdf from "pdf-parse/lib/pdf-parse.js"
import variables from "./variables.js"

const variablesArr = Object.keys(variables)
variablesArr.push("Visit of school for / by")

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

export const getPDFText = async pdfPath => {
  const parsedpdf = await parseDocument(pdfPath)
  const pdftext = parsedpdf.text
  const all = pdftext.split("\n")
  return all
}

export const getUdiseValue = data => {
  const regex = new RegExp(/UDISE CODE(.*?)School Name/g)
  const match = regex.exec(data[3])
  if (match && match[1]) {
    return match[1].trim()
  }
  return "*"
}

export const getNameValue = filePath => {
  console.log(filePath)
  const fileBaseTitle = path
    .basename(filePath)
    .replace(/[.pdf]/g, "")
    .replace(/(2018-19)|(2019-20)|(2020-21)|(2021-22)|(2022-23)_/g, "")
    .match(/_+(.+)/)
  const schoolName = fileBaseTitle[1].replace(/-/g, " ")
  return schoolName.trim()
}

export const getYearValue = filePath => {
  const yearRegex = /(2018-19)|(2019-20)|(2020-21)|(2021-22)|(2022-23)/
  const fileBaseTitle = path.basename(filePath)

  return fileBaseTitle.match(yearRegex)[0]
}

const updateSchoolDataArr = (word, value, array) => {
  const columns = variables[word]
  const dataObject = { [columns]: value }
  array.push(dataObject)
}

export const processGeneralData = async pdfPath => {
  const schoolDataArr = []
  const all = await getPDFText(pdfPath)

  for (let i = 0; i < all.length; i++) {
    const word = all[i]
    const value = all[i + 1]

    // DIGIBOARD
    if (
      word === "DigiBoard" &&
      variablesArr.some(variable => variable.includes(word))
    ) {
      updateSchoolDataArr(word, value, schoolDataArr)
    } else {
      // ALL OTHER VALUES
      const splitPoint = word.search(/[a-z][A-Z]/)
      let splitWord = word.replace(/[^a-zA-Z0-9\s-/?.()]/g, "")

      if (splitPoint !== -1) {
        splitWord = word.substring(splitPoint + 1)
      }

      if (
        variablesArr.some(variable => variable.includes(splitWord)) &&
        !variablesArr.includes(value)
      ) {
        updateSchoolDataArr(splitWord, value, schoolDataArr)
      }
    }
  }

  return schoolDataArr
}
