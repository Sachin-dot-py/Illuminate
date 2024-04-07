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
import 'bootstrap/dist/css/bootstrap.min.css';
import { MagnifyingGlass } from 'react-loader-spinner';
//MONDAY = 1
//TUESDAY = 2
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
  const [scheduleCombinations, setScheduleCombinations] = useState(undefined)
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
    document.querySelector(".loadingAnimation").style.visibility = "visible";
    console.log(URL, "EEEE")
    const res = await fetch(URL, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formatStateForServer(courses, timePreference, unavailabilities))
    }).then((res) => res.json())
    //return json.dumps({'numCombs': num_combs, 'schedules': [schedule.schedule for schedule in top3]})
    console.log(res)
    // Set numCombinationsContainer to res['numCombs']
    document.querySelector(".numCombinationsContainer").innerText = res['numCombs']
    // Set visibility of text container to true
    document.querySelector(".numCombinationsTextContainer").style.visibility = "visible"

    setSchedules(res['schedules'].map(parseSchedule))
    setScheduleCombinations(res['numCombs'])
    console.log(schedules, "Network responded and parsed these events")
    document.querySelector(".loadingAnimation").style.visibility = "hidden";
  }



  useEffect(() => {
    // fetchData()
    const intervalId = setInterval(() => {
      setBackgroundImageIndex(prevIndex =>
        prevIndex === backgroundImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // Rotates images every 5000 milliseconds (5 seconds)
  
    // This function will be called when the component unmounts
    return () => clearInterval(intervalId);
  }, [])

  useEffect(() => {
    if(!courses[selectedCourseForFilter]){
      setSelectedCourseForFilter(undefined)
    }
  }, [courses])

  console.log(new Date())
  console.log(moment().startOf('isoWeek'))

  return (
    <div className="App" style={{ 
      backgroundImage: 'url("/images/2.jpg")', // Directly setting image 2 as the background
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      minHeight: '100vh'
    }}>
      
      <section>
        <h2 style={{ backgroundColor: '#4CAF50', color: 'white', padding: '10px', borderRadius: '5px' }}>
          UCSD Course Auto-Scheduler
        </h2>
        <p style={{ color: 'white', fontSize: '18px' }}>
          Input at least two courses to generate a schedule!
        </p>
      </section>
      <div className={"scheduleInfoContainer"}>
        <TimePreferenceSelector timePreference={timePreference} setTimePreference={setTimePreference} />
        <CourseCollector courses={courses} setCourses={setCourses} setSelectedCourseForFilter={setSelectedCourseForFilter} selectedCourseForFilter={selectedCourseForFilter}/>
        <button onClick={() => fetchData()} disabled={courses.length < 2}>Generate Schedule</button>
        <div className={"loadingAnimation"} style={{"visibility": "hidden"}}>
          <MagnifyingGlass
            visible={true}
            height="80"
            width="80"
            ariaLabel="magnifying-glass-loading"
            wrapperStyle={{}}
            wrapperClass="magnifying-glass-wrapper"
            glassColor="#c0efff"
            color="#e15b64"
          />
        </div>
      </div>
      <UnavailabilityCollector unavailabilities={unavailabilities} setUnavailabilities={setUnavailabilities}/>
      <div className={"numCombinationsTextContainer"} style={{ visibility: "hidden", color: "black", fontSize: "20px" }}>
  From <b><span className={"numCombinationsContainer"}>xxx</span></b> possible combinations, we picked these ones for you:
</div>

      
      <CustomCalendar schedules={schedules}/>
    </div>
  );
}

export default App;