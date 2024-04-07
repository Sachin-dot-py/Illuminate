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

const formatClassesForServer = (classes) => {
    return Object.entries(classes).reduce((formatted, [course, professorFilter]) => {
        formatted[course] = Object.entries(professorFilter).reduce((profList, [prof, isToggled]) => {
            if(isToggled){
                profList.push(prof)
            }

            return profList
        }, [])

        return formatted
    }, {})
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
        classes: formatClassesForServer(classes),
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

let classColorMapping = {};

//schedule CSE 12, start, end
export const parseScheduleUnit = (isoDay, scheduleUnit) => {

    const [startTime, endTime] = getClassEventStartAndEnd(isoDay, scheduleUnit)
    const {code, location, section, type, professor, walkingTime, percentClass, studyHours, percentProf, avgGrade} = scheduleUnit

    // const title = `${code}\n${professor}\n ${type} | ${section}\n ${location}\n${walkingTime ?? "N/A"}🚶`
    let title_text = ``
    if (percentClass == undefined) {
        title_text = `\nNo CAPEs data for this class and professor.`
    }
    else {
        title_text = `\n📚Percentage Recommended Class: ${percentClass}\n👍Percentage Recommended Professor: ${percentProf}\n🕒Study Hours per Week: ${studyHours}\n🎓Average Grade Received: ${avgGrade}`
    }
    const title = title_text

    const colors = ["#bde0fe", "#ffc8dd", "#a2d2ff", "#ffafcc", "#cdb4db", "#e9edc9"];

    let color_id = 0;

    if (Object.keys(classColorMapping).length === 0){
        color_id = 0;
        classColorMapping[code] = color_id;
    } else if (classColorMapping[code]){
        color_id = classColorMapping[code];
    } else {
        color_id = Math.max(...Object.values(classColorMapping)) + 1;
        classColorMapping[code] = color_id;
    }

    return {
        id: Math.random() * 100,
        title: title,
        start: startTime,
        end: endTime,
        color: colors[color_id],
        code,
        professor,
        type,
        section,
        location,
        walkingTime,
        percentClass,
        studyHours,
        percentProf
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

export const PROFESSOR_URL = "http://localhost:3000/api/get_profs"