import { useState } from "react"
import { Course } from "./Course"

export const CourseCollector = ({courses, setCourses}) => {
    //COURSES IS A LIST
    const [courseInput, setCourseInput] = useState("")

    const clearCourseInput = () => setCourseInput("")

    const addCourse = (courseName) => {
        
        // TODO VERIFY COURSE EXISTS
        // console.log()
        setCourses((old) => [...old, courseName])
    }

    const onSubmit = (e) => {
        e.preventDefault()
        
        addCourse(courseInput)

        clearCourseInput()
    }

    return <div className="courseCollectorContainer">
        <p> Input desired courses one by one. </p>
        
        <form onSubmit={onSubmit}>
            <input onChange={(e) => setCourseInput(e.target.value)} value={courseInput} name="courseInput" placeholder="Course Title + Enter"/>
        </form>

        <div className="courselist">
            {
                courses.map((courseName, idx) => 
                <Course courseName = {courseName} 
                        onDelete={() => setCourses((cl) => cl.filter((_, currIdx) => currIdx !== idx))}
                
                />)
            }
        </div>
    </div>

}