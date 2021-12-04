
export const csvToArray = (str: string, delimiter = ",") => {
  // slice from start of text to the first \n index
  // use split to create an array from string by delimiter
  const headers = str.slice(0, str.indexOf('\n')).split(delimiter);

  // slice from \n index + 1 to the end of the text
  // use split to create an array of each csv value row
  const rows = str.slice(str.indexOf('\n') + 1).split('\n');

  // Map the rows
  // split values from each row into an array
  // use headers.reduce to create an object
  // object properties derived from headers:values
  // the object passed as an element of the array
  const array = rows.map((row) => {
    const values = row.split(delimiter);
    const element = headers.reduce( (object: any, header, index) => {
      //eslint-disable-next-line
      object[header.replace(/\"/g, '')] = values[index].replace(/\"/g, '');
      return object;
    }, {});
    return element;
  });

  return array;
}