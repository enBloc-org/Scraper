import { readFileSync } from "fs"
import path from "path"
import pdf from "pdf-parse/lib/pdf-parse.js"
import variables from "./variables.js"

const variablesArr = Object.keys(variables)
variablesArr.push("Visit of school for / by")

export const parseDocument = async pdfPath => {
  const dataBuffer = readFileSync(pdfPath)
  const options = {
    max: 1,
  }
  try {
    const pdfdata = await pdf(dataBuffer, options)
    return pdfdata
  } catch (error) {
    console.error(error)
    console.log("some error with pdf parse library")
    throw error
  }
}

export const getPDFText = async pdfPath => {
  const parsedpdf = await parseDocument(pdfPath)
  return parsedpdf.text.split("\n")
}

export const getNameValue = filePath => {
  const fileBaseTitle = path
    .basename(filePath)
    .replace(/[.pdf]/g, "")
    .replace(/(2018-19)|(2019-20)|(2020-21)|(2021-22)|(2022-23)_/g, "")
    .match(/_+(.+)/)
  return fileBaseTitle[1].replace(/-/g, " ").trim()
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
  const words = await getPDFText(pdfPath)

  words.forEach((word, i) => {
    const value = words[i + 1]

    // DIGIBOARD
    if (
      word === "DigiBoard" &&
      variablesArr.some(variable => variable.includes(word))
    ) {
      updateSchoolDataArr(word, value, schoolDataArr)
    } else {
      // words OTHER VALUES
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
  })

  return schoolDataArr
}
