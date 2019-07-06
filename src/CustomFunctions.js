
function pad(string) {
  return ('0' + string).slice(-2);
}

export function formatToText(seconds) {
  const date = new Date(seconds * 1000);
  const hh = date.getUTCHours();
  const mm = date.getUTCMinutes();
  const ss = pad(date.getUTCSeconds());
  if (hh) {
    return `${hh}${pad(mm)}${ss}`;
  }
  return `${mm}${ss}`;
}

function convertArrayToObject(array) {
  const objectArray = {};
  array.forEach((res) => {
    const convert = res.replace(/\t+|\n+|\r+/g, '|')
      .replace(/^\d*\|\|/gm, '')
      .replace(/ --> .*\d/g, '')
      .replace(/,\d{3}/g, '')
      .replace(/\|\|/g, ' ')
      .replace(/\s/, '|')
      .split('|');
    objectArray[+(convert[0].replace(/:/g, ''))] = convert[1];
  });
  return objectArray;
}

export function getTextFromInputFile(text) {
  return new Promise((resolve) => {
    const result = text.split(/\s+[1-9]/g);
    resolve(convertArrayToObject(result));
  });
}

export function getTextFromFile(fileName) {
  return new Promise((resolve, reject) => {
    fetch(fileName)
      .then(res => res.text())
      .then((text) => {
        const result = text.split(/\s+[1-9]/g);
        resolve(convertArrayToObject(result));
      })
      .catch(err => reject(err));
  });
}

export function getCurrentSubtitleFromArray(second, arrayText) {
  const intSecond = parseInt(second, 10);
  const respuesta = typeof arrayText[`${intSecond}`] !== 'undefined'
    ? arrayText[`${intSecond}`] : false;
  return respuesta;
}
