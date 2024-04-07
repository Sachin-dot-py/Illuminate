import moment from "moment"


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

function getClassEventStartAndEnd(isoDay, classInfo) {
    // Get the start of the current ISO week and add the ISO day offset
    const classStartDate = moment().startOf('isoWeek').add(isoDay - 1, 'days').add(1, "week");
    const classEndDate = moment().startOf('isoWeek').add(isoDay - 1 , 'days').add(1, "week")
    // Adjust the start time format to ensure it's always HHMM
    let startTime = classInfo.start;
    if (startTime.length === 3) {
        startTime = '0' + startTime; // Prefix with 0 if the start time is in HMM format
    }

    let endTime = classInfo.end
    if (endTime.length === 3) {
        endTime = '0' + startTime; // Prefix with 0 if the start time is in HMM format
    }

    // Extract hours and minutes from the start time
    const startTimeHours = parseInt(startTime.substring(0, 2), 10);
    const startTimeMinutes = parseInt(startTime.substring(2, 4), 10);

    const endTimeHours = parseInt(endTime.substring(0,2), 10)
    const endTimeMinutes = parseInt(endTime.substring(2,4), 10)

    // Set the time for the class start
    classStartDate.hours(startTimeHours).minutes(startTimeMinutes);
    classEndDate.hours(endTimeHours).minutes(endTimeMinutes)

    return [classStartDate.toDate(), classEndDate.toDate()];
}

//schedule CSE 12, start, end
export const parseScheduleUnit = (isoDay, scheduleUnit) => {

    const [startTime, endTime] = getClassEventStartAndEnd(isoDay, scheduleUnit)
    const {code, location, section, type, professor} = scheduleUnit

    const title = `${code}\n${professor}\n ${type} | ${section}\n${location}`

    return {
        id: Math.random() * 100,
        title: title,
        start: startTime,
        end: endTime,
    }
}

export const parseSchedule = (schedule) => {
    return Object
        .entries(schedule)
        .reduce((parsedSchedule, [isoDay, classArray]) => {
            classArray.forEach((classInfo) => {
                parsedSchedule.push(parseScheduleUnit(isoDay, classInfo))
            })

            return parsedSchedule
        }, [])
}