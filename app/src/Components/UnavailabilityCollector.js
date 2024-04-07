import { useState } from "react"
import TimeRange from "react-time-range"
import { DEFAULT_TIMESTAMP } from "../utils"
import { DAYS } from "../utils"

export const UnavailabilityCollector = ({unavailabilities, setUnavailabilities}) => {
    
    
    const [currentDay, setCurrentDay] = useState(DAYS[0])

    console.log(unavailabilities)

    const addUnavailabilityToDay = (day) => {
        setUnavailabilities((oldAvailabilities) => {
            return {
                ...oldAvailabilities,
                [day]: [...oldAvailabilities[day], [DEFAULT_TIMESTAMP, DEFAULT_TIMESTAMP]]
            }
        })
    }

    const editTimeRange = (day, newStartTime, newEndTime, idx) => {
        setUnavailabilities((oldAvailabilities) => {
            let newAvailabilities = {...oldAvailabilities}
            newAvailabilities[day][idx] = [newStartTime, newEndTime]            
            return newAvailabilities
        })
    }

    return <div>

        <select value={currentDay} onChange={(e) => setCurrentDay(e.target.value)}>
            {DAYS.map((day) => {
                return <option value={day}> {day} </option>
            })}
        </select>
        
        <button onClick={() => addUnavailabilityToDay(currentDay)}> Add 2Unavailability </button>

        {unavailabilities[currentDay].map(([startTime, endTime], idx) => {
            console.log("Rendering timerange with", startTime, endTime, "on day", currentDay, "in index", idx)
            return <TimeRange use24Hours={true} startMoment={startTime} endMoment={endTime} onChange = {({startTime, endTime}) => {console.log(startTime, endTime); editTimeRange(currentDay, startTime, endTime, idx)}}/>
        })}
    </div>
}