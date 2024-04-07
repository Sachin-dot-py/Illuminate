import { useEffect, useState } from "react"
import moment from "moment"
import { Calendar } from "react-big-calendar"
import { momentLocalizer } from "react-big-calendar"
import "./CustomCalendar.css"

export const CustomCalendar = ({schedules}) => {

  console.log(schedules)
  const [currentScheduleIndex, setCurrentScheduleIndex] = useState(schedules.length === 0 ? -1 : 0)
  const localizer = momentLocalizer(moment)

  const getNextSchedule = () => {
    if(currentScheduleIndex + 1 >= schedules.length){
      return
    }

    setCurrentScheduleIndex(currentScheduleIndex + 1)
  }

  const getPreviousSchedule = () => {
    if(currentScheduleIndex - 1 < 0){
      return
    }

    setCurrentScheduleIndex(currentScheduleIndex - 1)
  }

  const eventStyleGetter = (event, start, end, isSelected) => {
    console.log(event);
    let style = {
        backgroundColor: event.color,
        borderRadius: '0px',
        opacity: 0.8,
        color: 'black',
        border: '0px',
        display: 'block'
    };

    return {
        style: style
    };
  }

  useEffect(() => {
    if(schedules.length > 0){
      setCurrentScheduleIndex(0)
    }
  }, [schedules.length])

  return <>
    {
      !!schedules.length && 
      <div class="schedulescroller">
        <button onClick={getPreviousSchedule}> {"<"} </button>
        <p className={"scrollerstatus"}> {`Schedule ${currentScheduleIndex + 1} of ${schedules.length}`} </p>
        <button onClick={getNextSchedule}> {">"} </button>
      </div>
    }
    <Calendar 
        localizer={localizer} 
        events={currentScheduleIndex === -1 ? [] : schedules[currentScheduleIndex]} 
        startAccessor={"start"} 
        endAccessor={"end"} 
        style={{height: 1300, width: "100%"}}
        defaultView={'work_week'}
        views={["work_week"]}
        min={new Date(2020, 1, 0, 7, 0, 0)} 
        max={new Date(2020, 1, 0, 22, 0, 0)}
        eventPropGetter={(eventStyleGetter)}
        allDayMaxRows={0}
        components={{
          work_week: {
            header: ({date, localizer}) => <p> {moment(date).format("dddd")} </p>,
            toolbar: () => <div> {`Your Schedule(s)`} </div>,
            event: ({event}) => {
              const {code, location, section, type, professor, walkingTime, percentClass, studyHours, percentProf} = event
              return <div>
                <p className={"event-txt"}> <strong> {code} </strong> </p>
                <p className={"event-txt"}> <strong> {type} | {section} | {location} </strong> </p>
                <p className={"event-txt"}> <strong> {professor} </strong> </p>
                { walkingTime && <p className={"event-txt walking-warning"}> <strong>🚶Walking time from previous class: {walkingTime} </strong> </p> }
              </div>
            }
            // resourceHeader: () => <div>Hello there</div>
          }
        }}
        /> 
  </>
}