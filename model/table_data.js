const db = require("../database/school_data_db")

const insertTableData = async tableData => {
    const columns = tableData
    .map(obj =>
        console.log(Object.entries(obj)))


}

module.exports = insertTableData