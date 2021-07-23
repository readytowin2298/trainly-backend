const { BadRequestError } = require("../expressError");

/**
 * Helper for making selective update queries.
 *
 * The calling function can use it to make the SET clause of an SQL UPDATE
 * statement.
 *
 * @param dataToUpdate {Object} {field1: newVal, field2: newVal, ...}
 * @param jsToSql {Object} maps js-style data fields to database column names,
 *   like { firstName: "first_name", age: "age" }
 *
 * @returns {Object} {sqlSetCols, dataToUpdate}
 *
 * @example {firstName: 'Aliya', age: 32} =>
 *   { setCols: '"first_name"=$1, "age"=$2',
 *     values: ['Aliya', 32] }
 */

// function sqlForPartialUpdate(dataToUpdate, jsToSql) {
//   const keys = Object.keys(dataToUpdate);
//   if (keys.length === 0) throw new BadRequestError("No data");

//   // {firstName: 'Aliya', age: 32} => ['"first_name"=$1', '"age"=$2']
//   const cols = keys.map((colName, idx) =>
//       `"${jsToSql[colName] || colName}"=$${idx + 1}`,
//   );

//   return {
//     setCols: cols.join(", "),
//     values: Object.values(dataToUpdate),
//   };
// }

function sqlForPartialUpdate(data, jsToSql){
  if (Object.keys(data).length === 0) throw new BadRequestError("No data");
  let newStr = "";
  let i=0;
  for(let col of Object.keys(data)){
    if(!data.col === undefined){
      newStr += `"${jsToSql[col] || col}"=$${i + 1}`;
      i++
    }
  }
  return newStr;
}

module.exports = { sqlForPartialUpdate };
