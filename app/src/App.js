import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react'
import { Course } from './Components/Course';
import { CourseCollector } from './Components/CourseCollector';
import { TimePreferenceSelector } from './Components/TimePreferenceSelector';


function App() {

  const URL = "http://localhost:3000/api/get_something"
  const [courses, setCourses] = useState([])
  const [timePreference, setTimePreference] = useState("LATEST")
  const [unavailability, setUnavailability] = useState({})


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

  useEffect(() => {
    const fetchData = async () => {
      console.log(URL, "EEEE")
      const res = await fetch(URL).then((res) => res.text())
      console.log(res)
    }

    fetchData()
  }, [])

  return (
    <div className="App">
      <TimePreferenceSelector timePreference={timePreference} setTimePreference={setTimePreference} />
      <CourseCollector courses={courses} setCourses={setCourses}/>
    </div>
  );
}

export default App;
