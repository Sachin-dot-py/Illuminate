import { useState } from "react"
import TimeRange from "react-time-range"
import { DEFAULT_TIMESTAMP } from "../utils"
import { DAYS } from "../utils"
import { Unavailability } from "./Unavailability"

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

    return <div className="unavailabilityCollectorContainer">

        <div className="unavailabilitySelectorsContainer">
            <select value={currentDay} onChange={(e) => setCurrentDay(e.target.value)}>
                {DAYS.map((day) => {
                    return <option key={day} value={day}> {day} </option>
                })}
            </select>
            <button onClick={() => addUnavailabilityToDay(currentDay)}> Add Unavailability </button>
        </div>
        <p style={{ color: 'black', fontSize: '18px' }}>{`You are unavailable at these times on ${currentDay}`}</p>
       
        <div className={"unavailabilitiesList"}>
            {unavailabilities[currentDay].length ? unavailabilities[currentDay].map(([startTime, endTime], idx) => {
                // console.log("Rendering timerange with", startTime, endTime, "on day", currentDay, "in index", idx)
                const onChange = ({startTime, endTime}) => {editTimeRange(currentDay, startTime, endTime, idx)}

                const deleteUnavailability = () => {
                    setUnavailabilities((oldUnavailabilities) => {
                        let newUnavailabilities = {...oldUnavailabilities}

                        newUnavailabilities[currentDay] = newUnavailabilities[currentDay].filter((_, currIdx) => currIdx !== idx)

                        return newUnavailabilities
                    })
                }

                // return <TimeRange use24Hours={true} startMoment={startTime} endMoment={endTime} onChange = {onChange}/>
                return <Unavailability startTime={startTime} endTime={endTime} onChange={onChange} onDelete={deleteUnavailability} />
            }) : <p className="noUnavailabilitiesText" style={{ color: 'white', fontSize: '18px' }}>
            {}
          </p>
          }
        </div>
    </div>
}