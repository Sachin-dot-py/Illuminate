import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react'
import { Course } from './Components/Course';
import { CourseCollector } from './Components/CourseCollector';
import { TimePreferenceSelector } from './Components/TimePreferenceSelector';
import TimeRange from "react-time-range"
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { UnavailabilityCollector } from './Components/UnavailabilityCollector';
import { formatStateForServer, parseSchedule} from './utils';
import { Calendar, Views, momentLocalizer } from 'react-big-calendar';
import { MOCK_EVENTS } from './events'
import moment from 'moment'
import "./CustomCalendar.css"

//MONDAY = 1
//TUESDAY = 2


function App() {

  const localizer = momentLocalizer(moment)
  const MOCK_UNAVAILABILITIES = {
    "MONDAY" : [],
    "TUESDAY" : [],
    "WEDNESDAY": [],
    "THURSDAY": [],
    "FRIDAY": []
  }


  const URL = "http://localhost:3000/api/get_schedule"
  const [courses, setCourses] = useState([])
  const [timePreference, setTimePreference] = useState("LATEST")
  const [unavailabilities, setUnavailabilities] = useState(MOCK_UNAVAILABILITIES)
  const [events, setEvents] = useState([])

  // Need a list of classes ["MATH 20E", "ECON 1", "VIS 9"]
  // Choose Earliest or latest (end early, start late)
  // Times not available - dont worry for now!
  const EXAMPLE = {
    classes: ["MATH 20E", "ECON 1", "VIS 9"],
    sortTimesBy: "LATEST",
    unavailability: {
      monday : [["12:30", "13:30"], ["14:00", "15:00"]],
      tuesday : [["9:00", "10:00"]]
    }
  }

  const onSendRequest = () => {
    console.log(formatStateForServer(courses,timePreference,unavailabilities))
  }
  
  const fetchData = async () => {
    console.log(URL, "EEEE")
    const res = await fetch(URL, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formatStateForServer(courses, timePreference, unavailabilities))
    }).then((res) => res.json())
    setEvents(parseSchedule(res[0]))
    console.log(events, "Network responded and parsed these events")
  }



  useEffect(() => {

    // fetchData()
  }, [])

  console.log(new Date())
  console.log(moment().startOf('isoWeek'))

  return (
    <div className="App">
      <p> {JSON.stringify(events)} </p>
      <TimePreferenceSelector timePreference={timePreference} setTimePreference={setTimePreference} />
      <CourseCollector courses={courses} setCourses={setCourses}/>
      <UnavailabilityCollector unavailabilities={unavailabilities} setUnavailabilities={setUnavailabilities}/>
      <Calendar 
      localizer={localizer} 
      events={events} 
      startAccessor={"start"} 
      endAccessor={"end"} 
      style={{height: 700, width: "100%"}}
      defaultView={'work_week'}
      views={["work_week"]}
      min={new Date(2020, 1, 0, 7, 0, 0)} 
      max={new Date(2020, 1, 0, 20, 0, 0)}
      allDayMaxRows={0}
      components={{
        work_week: {
          // header: ({date, localizer}) => <p> {moment(date).format("dddd")} </p>,
          // toolbar: () => <div> Your Schedule </div>,
          // resourceHeader: () => <div>Hello there</div>
        }
      }}
      />
      <button onClick={() => fetchData()}>Foo</button>
    </div>
  );
}

export default App;
