export const timeToSeconds = time => {
  let seconds = 0
  if (time !== "DNP") {
    const aux = time.trim().split(":")
    if (aux.length === 2) {
      seconds = aux[0] * 60 + aux[1] * 1
    } else {
      throw "timeToSeconds - Parsing error. Length = " + aux.length + " time: " + time
    }
  }
  return seconds
}

export const parseDate = (date, time) => {
  const auxDate = date.trim().split("/")
  const auxTime = time.trim().split(":")
  if (auxDate.length === 3){
    const [day, month, year] = auxDate
    if (auxTime.length === 2) {
      const [hour, minutes] = auxTime
      return new Date(parseInt(year), parseInt(month)-1, parseInt(day), parseInt(hour), parseInt(minutes), 0)
    } else {
      console.error("parseDate - Parsing error. Length = " + auxTime.length + " time: " + time)
    }
  } else {
    console.error("parseDate - Parsing error. Length = " + auxDate.length + " date: " + date)
  }
  return null
}

export const parsePlayerCode = playercode => {
  let code = playercode
  if (playercode.length > 3 && playercode[0] === 'P') {
    code = playercode.slice(1)
  }
  return code
}