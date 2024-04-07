import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react'
import { Course } from './Components/Course';
import { CourseCollector } from './Components/CourseCollector';
import { TimePreferenceSelector } from './Components/TimePreferenceSelector';
import TimeRange from "react-time-range"
import { UnavailabilityCollector } from './Components/UnavailabilityCollector';
import { formatStateForServer, parseTimestamp, timestampToMilitary } from './utils';
import 'bootstrap/dist/css/bootstrap.min.css';

//MONDAY = 1
//TUESDAY = 2


function App() {

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
  const [backgroundImageIndex, setBackgroundImageIndex] = useState(0);
  const backgroundImages = [
    'url("/images/1.jpg")',
    'url("/images/2.jpg")',
    'url("/images/3.jpg")'];
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
    console.log(res)
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




  return (
    <div className="App" style={{ backgroundImage: backgroundImages[backgroundImageIndex], backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="content-box position-absolute top-0 start-50 translate-middle-x">
        <div className="container">
          
          <div className="row justify-content-center">
            <div className="col-md-8">
              <div className="bg-dark text-white p-4 rounded-3 mb-3">
                <TimePreferenceSelector timePreference={timePreference} setTimePreference={setTimePreference} />
              </div>
            </div>
          </div>
          
          <div className="row justify-content-center">
            <div className="col-md-8">
              <div className="bg-dark text-white p-4 rounded-3 mb-3">
                <CourseCollector courses={courses} setCourses={setCourses}/>
              </div>
            </div>
          </div>
          
          <div className="row justify-content-center">
            <div className="col-md-8">
              <div className="bg-dark text-white p-4 rounded-3 mb-3">
                <UnavailabilityCollector unavailabilities={unavailabilities} setUnavailabilities={setUnavailabilities}/>
              </div>
            </div>
          </div>
          
          <div className="row justify-content-center">
            <div className="col-md-8">
              <button onClick={() => fetchData()} className="btn btn-primary mb-3">Foo</button>
            </div>
          </div>
  
        </div>
      </div>
    </div>
  );
  
    
}

export default App;
