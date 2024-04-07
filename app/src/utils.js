//Thank you ChatGPT :)
export const timestampToMilitary = (ts) => {
    // Create a Date object from the timestamp
    const date = new Date(ts);
  
    // Convert the timestamp from UTC to PST
    const options = { timeZone: "America/Los_Angeles", hour12: false };
    const pstTimeString = date.toLocaleString("en-US", options);
  
    // Extract the time portion and convert it to military time format
    const [hours, minutes] = pstTimeString.split(" ")[1].split(":");
    const militaryTime = `${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}`;

    return militaryTime;
}

export const militaryToInt = (ts) => {
    return parseInt(ts.replace(":", ""))
}

export const parseTimestamp = (ts) => {
    return militaryToInt(timestampToMilitary(ts))
}

export const DEFAULT_TIMESTAMP = "2024-04-06T23:00:00.661Z"
export const DAYS = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"]


const EXAMPLE = {
    classes: ["MATH 20E", "ECON 1", "VIS 9"],
    sortTimesBy: "LATEST",
    unavailability: {
      monday : [["12:30", "13:30"], ["14:00", "15:00"]],
      tuesday : [["9:00", "10:00"]]
    }
  }

const DAY_MAPPING = {
    "MONDAY" : 1,
    "TUESDAY" : 2,
    "WEDNESDAY" : 3,
    "THURSDAY" : 4,
    "FRIDAY" : 5
}


export const formatStateForServer = (classes, timePreference, unavailabilities) => {

    //DO NOT DIRECTLY MODIFY UNAVAILABILITIES
    const temp_unavailabilities = {...unavailabilities}
    const formattedUnavailabilities = {}

    //Turn each of the timestamps into the right military time
    DAYS.forEach((day) => {
        temp_unavailabilities[day] = temp_unavailabilities[day].map(([startTime, endTime]) => {
            const newStartTime = parseTimestamp(startTime)
            const newEndTime = parseTimestamp(endTime)

            return [newStartTime, newEndTime]
        })
    })

    //Switch the keys to 1,2,3,4,5 for the days of the week.
    for(let [key,value] of Object.entries(temp_unavailabilities)){
        let newKey = DAY_MAPPING[key]
        formattedUnavailabilities[newKey] = value
    }

    return {
        classes,
        sortTimesBy: timePreference,
        unavailabilities: formattedUnavailabilities
    }
}