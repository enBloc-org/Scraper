const fs = require("fs")
const pdf = require("pdf-parse")

async function parseLocalPDF(pdfPath) {
  const dataBuffer = fs.readFileSync(pdfPath)
  // set page range as an option
  const options = {
    max: 1, // limit parsing to the first page only
  }
  const pdfdata = await pdf(dataBuffer, options)

  const processedData = processGeneralData(pdfdata.text)
  return processedData
}
const mapVariablesToColumns = {
  State: "state",
  District: "district",
  Block: "block",
  "Rural / Urban": "urban",
  Cluster: "cluster",
  Ward: "ward",
  Mohalla: "mohalla",
  Pincode: "pincode",
  Panchayat: "panchayat",
  City: "city",
  Municipality: "municipality",
  "School Category": "category",
  "School Management": "management",
  "Medium 1": "medium1",
  "Medium 2": "medium2",
  "Medium 3": "medium3",
  "Medium 4": "medium4",
  "Year of Establishment": "year_est",
  "Is this a Shift School?": "shift",
  "Anganwadi At Premises": "aganwadi",
  "Year of Recognition-Pri.": "recog_pri",
  "Building Status": "building_stat",
  "Anganwadi Boys": "aganwadi_b",
  "Year of Recognition-Upr.Pri.": "recog_upr_pri",
  "Boundary Wall": "boundary",
  "Anganwadi Girls": "aganwadi_g",
  "Year of Recognition-Sec.": "recog_sec",
  "No.of Building Blocks": "no_blocks",
  "Anganwadi Worker": "aganwadi_worker",
  "Year of Recognition-Higher Sec.": "recog_highsec",
  "Pucca Building Blocks": "pucca_blocks",
  "Residential School": "residential",
  "Is Special School for CWSN?": "specialschool",
  "Residential Type": "resid_type",
  "Availability of Ramps": "ramps",
  "Minority School": "minorityschool",
  "Availability of Handrails": "handrails",
  "Approachable By All Weather Road": "road",
}

function processGeneralData(pdfText) {
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
        // Log variable : value pair
        // console.log(splitWords, " : ", value)

        // prepare the data for schoolDataArr
        const columns = mapVariablesToColumns[splitWords]
        const dataObject = {}
        dataObject[columns] = value
        schoolDataArr.push(dataObject)
      }
    }
  })
  return schoolDataArr
}

module.exports = parseLocalPDF
