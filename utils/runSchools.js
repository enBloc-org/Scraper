const { errorLogColour, fourthLogColour } = require("./colours")

require("dotenv").config()

const delayInterval = process.env.DELAY
const requestCookie = process.env.COOKIE

const schoolDownload = async givenSchool => {
  const givenSchoolId = givenSchool.schoolId
  const yearId = 7 // NEEDS TO ITERATE 5,6,7,8

  const options = {
    method: 'POST',
    headers: {
      cookie: requestCookie,
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': 'insomnia/8.4.0'
    },
    body: new URLSearchParams({schoolId: givenSchoolId, yearId: '7'})
  };
  
  fetch('https://src.udiseplus.gov.in/NewReportCard/PdfReportSchId', options)
    .then(response => response.json())
    .then(response => console.log(response))
    .catch(err => console.error(err));
}

const runSchools = async givenBlock => {
  try{
    const runSingleSchool = async index => {
      const currentSchool = givenBlock.schoolList[index]
      
      // base case
      if(index >= givenBlock.schoolList.length){
        console.log(
          fourthLogColour,
          `${givenBlock.eduBlockName} Block Processed`
        )

        return
      }

      // function declaration
      try{
        console.groupCollapsed(
          fourthLogColour,
          `Downloading ${currentSchool.schoolName}`
        )

        await schoolDownload(currentSchool)

        console.groupEnd()

        const result = await new Promise(resolve => {
          setTimeout(async () => {
            const trigger = await runSingleSchool(index + 1)
            resolve(trigger)
          }, delayInterval)
        })

        return result
      }catch(error){
        console.error(
          errorLogColour,
          `Error running School: ${error}`
        )
        throw error
      }
    }

    // recursive call command
    return runSingleSchool(0)
  }catch(error){
    console.error(
      errorLogColour,
      `Error running schools: ${error}`
    )
    throw error
  }
}

module.exports = {runSchools}