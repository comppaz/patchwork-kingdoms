const fs = require("fs");
const { Parser } = require("json2csv");

/**
 * exports data into a csv for debugging context
 * @param {*} headers
 * @param {*} data
 */
function exportToCSV(headers, data) {
  console.log(headers);
  const csv = new Parser({ headers });

  fs.writeFile("data.csv", csv.parse(data), function (err) {
    if (err) {
      console.error(err);
      throw err;
    }
    console.log("file saved");
  });
}

module.exports = {
  exportToCSV,
};
