function parseData(lines: Array<string>) {
  const arrayOfNumbers: Array<Number> = [];
  let total = 0;
  lines.forEach((line) => {
    let characters = line.split('');
    characters = characters.filter((character) => !isNaN(Number(character)));
    if (characters?.length > 0) {
      const first = characters[0];
      const last = characters[characters.length - 1];
      const result = Number([first, last].join(''));
      arrayOfNumbers.push(result);
      total += result;
    }
  });
  console.log('arrayOfNumbers', arrayOfNumbers);
  console.log('Total: ' + total);
}
const lines = readFile('./data/1-1.txt');
// const lines = readFile('./data/1-1-test.txt');

parseData(lines);
