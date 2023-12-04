const fs = require('fs');
const pdf = require('pdf-parse');

async function parseLocalPDF(pdfPath) {
    const dataBuffer = fs.readFileSync(pdfPath);
    // set page range as an option
    const options = {
        max: 1 // limit parsing to the first page only 
    };
    const data = await pdf(dataBuffer, options)

    processGeneralData(data.text);
}

const mapVariablesToColumns = {
    'State': 'state',
    'District': 'district',
    'Block': 'block',
    'Rural / Urban': 'urban',
    'Cluster': 'cluster',
    'Ward': 'ward',
    'Mohalla': 'mohalla',
    'Pincode': 'pincode',
    'Panchayat': 'panchayat',
    'City': 'city'
}

function processGeneralData(pdfText) {
    const allValues = pdfText.split('\n');
    const variablesArr = ['State', 'District', 'Block', 'Rural / Urban', 'Cluster', 'Ward', 'Pincode', 'Panchayat', 'City', 'Municipality', 'School Category', 'School Management', 'Medium 1', 'Medium 2', 'Medium 3', 'Medium 4', 'Year of Establishment', 'Is this a Shift School?', 'Anganwadi At Premises', 'Year of Recognition-Pri', 'Building Status', 'Anganwadi Boys', 'Year of Recognition-Upr.Pri', 'Boundary Wall', 'Anganwadi Girls', 'Year of Recognition-Sec', 'No.of Building Blocks', 'Anganwadi Worker', 'Year of Recognition-Higher Sec', 'Pucaa Building Blocks', 'Residential School', 'Is Special School for CWSN?', 'Residential Type', 'Availability of Ramps', 'Minority School', 'Availability of Hadnrails', 'Approachable By All Weather Road'];
    allValues.forEach((word, i) => {
        // identify the variables
        // check that the string in allValues matches a string in variablesArr - allValues concatenates some strings so it is possible that the string in variablesArr is a substring of a string in allValues
        if (variablesArr.some(variable => word.includes(variable))) {
            // identify values
            const value = allValues[i + 1]
            // Check that the value exists in allValues but not in variablesArr. This is looking for a variable followed by another variable (and therefore an empty value) 
            if (!variablesArr.some(valueisactuallyavariable => value.includes(valueisactuallyavariable))) {
                // Log variable : value pair
                const dataForInsertion = [];
                const columnName = mapVariablesToColumns[word]
                const dataObject = {};
                dataObject[columnName] = value;
                dataForInsertion.push(dataObject);
                console.log(dataForInsertion)
                // console.log(word, " : ", value)
            }
        }
    }
    )
}

const pdfPath = '/Users/eazzopardi/code/agency-scraper/sample report card (1).pdf';
parseLocalPDF(pdfPath);