import { mapOverObj } from "fp-rosetree"
import prettyFormat from 'pretty-format';

function isFunction(obj) {
  return typeof obj === 'function'
}

function isPOJO(obj) {
  const proto = Object.prototype;
  const gpo = Object.getPrototypeOf;

  if (obj === null || typeof obj !== "object") {
    return false;
  }
  return gpo(obj) === proto;
}

export function formatResult(result) {
  if (Array.isArray(result)) {
    return result.map(formatResult)
  }
  if (!isPOJO(result)) {
    return result
  }
  else {
    return mapOverObj({
        key: x => x,
        leafValue: prop => isFunction(prop)
          ? (prop.name || prop.displayName || 'anonymous')
          : Array.isArray(prop)
            ? prop.map(formatResult)
            : prop
      },
      result)
  }
}

export function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

export function multiplySequences(arrInputs) {
  if (arrInputs.length === 0) return []

  return arrInputs.reduce((acc, arrInput) => {
    return [].concat(acc.map(inputSeq => arrInput.map(lastInput => ([].concat(inputSeq).concat([lastInput]))))).flat()
  }, [[]])
}

function formatValue(obj) {
  const formattedString = prettyFormat(obj)
  return formattedString.length > 10
    ? prettyFormat(obj).substr(0, 10) + "..."
    : formattedString
}

export function formatInputSeq(inputSeq) {
  return inputSeq.map(input => {
    if (isPOJO(input)) {
      return `${Object.keys(input)[0]}: ${formatValue(Object.values(input)[0])}`
    }
    else return JSON.stringify(input)
  }).join(' --> ')
}
