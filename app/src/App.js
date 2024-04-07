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
import 'bootstrap/dist/css/bootstrap.min.css';



const Grid = ({ children, gap = 'none', columnGap = 0, rowGap = 0 }) => (
  <div style={{
    display: 'grid',
    gap: gap !== 'none' ? gap : `${rowGap}px ${columnGap}px`,
    gridTemplateColumns: 'repeat(12, 1fr)',
  }}>
    {children}
  </div>
);

const Row = ({ children, css }) => (
  <div style={{ gridColumn: '1 / -1', ...css }}>
    {children}
  </div>
);

const Column = ({ children, span = 1, start, end, css }) => {
  let gridColumn = start && end ? `${start} / ${end}` : `span ${span}`;
  return (
    <div style={{ gridColumn, ...css }}>
      {children}
    </div>
  );
};


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
  const [schedules, setSchedules] = useState([])
  const backgroundImages = [
    'url("/images/1.jpg")',
    'url("/images/2.jpg")',
    'url("/images/3.jpg")'];
  const [backgroundImageIndex, setBackgroundImageIndex] = useState(0);
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
    const intervalId = setInterval(() => {
      setBackgroundImageIndex(prevIndex =>
        prevIndex === backgroundImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // Rotates images every 5000 milliseconds (5 seconds)
  
    // This function will be called when the component unmounts
    return () => clearInterval(intervalId);
    // fetchData()
  }, [])

  console.log(new Date())
  console.log(moment().startOf('isoWeek'))

  return (
    <div className="App" style={{ 
      backgroundImage: backgroundImages[backgroundImageIndex],
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      minHeight: '100vh'
    }}>
      <Grid gap="20px" columnGap={20} rowGap={20}>
        <Row>
          <Column span={12}> {/* Header spans all columns */}
            <section>
            <h2 style={{ backgroundColor: '#4CAF50', color: 'white', padding: '10px', borderRadius: '5px' }}>
    UCSD Course Auto-Scheduler
  </h2>
  <p style={{ color: 'white', fontSize: '18px' }}>
  Input at least two courses to generate a schedule!
</p>

            </section>
          </Column>
        </Row>
        <Row>
          <Column span={3}> {/* Inputs column */}
            <div className={"scheduleInfoContainer"}>
              <TimePreferenceSelector timePreference={timePreference} setTimePreference={setTimePreference} />
              <CourseCollector courses={courses} setCourses={setCourses}/>
              <UnavailabilityCollector unavailabilities={unavailabilities} setUnavailabilities={setUnavailabilities}/>
              <button onClick={() => fetchData()} disabled={courses.length < 2}>Generate Schedule</button>
            </div>
          </Column>
          <Column span={9}> {/* CustomCalendar spans more columns for larger display */}
            <CustomCalendar schedules={schedules} className="calendarContainer"/>
          </Column>
        </Row>
      </Grid>
    </div>
  );
}

export default App;
