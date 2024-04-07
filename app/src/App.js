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
import { CustomCalendar } from './Components/CustomCalendar';
import { ProfessorFilterer } from './Components/ProfessorFilterer';

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
  const [courses, setCourses] = useState({})
  const [timePreference, setTimePreference] = useState("LATEST")
  const [unavailabilities, setUnavailabilities] = useState(MOCK_UNAVAILABILITIES)
  const [schedules, setSchedules] = useState([])
  const [selectedCourseForFilter, setSelectedCourseForFilter] = useState(undefined)

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
    setSchedules(res.map(parseSchedule))
    console.log(schedules, "Network responded and parsed these events")
  }



  useEffect(() => {
    // fetchData()
  }, [])

  useEffect(() => {
    if(!courses[selectedCourseForFilter]){
      setSelectedCourseForFilter(undefined)
    }
  }, [courses])

  console.log(new Date())
  console.log(moment().startOf('isoWeek'))

  return (
    <div className="App">
      <p> {JSON.stringify(courses)} </p>
      <p> {`Selected course ${selectedCourseForFilter}`}</p>

      <section>
        <h2>
          UCSD couse auto-scheduler
        </h2>
        <p>
          Input at least two courses to generate a schedule!
        </p>
      </section>
      <div className={"scheduleInfoContainer"}>
        <TimePreferenceSelector timePreference={timePreference} setTimePreference={setTimePreference} />
        <CourseCollector courses={courses} setCourses={setCourses} setSelectedCourseForFilter={setSelectedCourseForFilter}/>
        <button onClick={() => fetchData()} disabled={courses.length < 2}>Generate Schedule</button>
      </div>
        <UnavailabilityCollector unavailabilities={unavailabilities} setUnavailabilities={setUnavailabilities}/>
        <ProfessorFilterer selectedCourseForFilter={selectedCourseForFilter} courses={courses} setCourses={setCourses} />
      <CustomCalendar schedules={schedules}/>
    </div>
  );
}

export default App;
