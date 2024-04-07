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

    return <>
        <p> Course Input </p>
        
        <form onSubmit={onSubmit}>
            <input onChange={(e) => setCourseInput(e.target.value)} value={courseInput} name="courseInput"/>
        </form>

        {
            courses.map((courseName, idx) => 
            <Course courseName = {courseName} 
                    onDelete={() => setCourses((cl) => cl.filter((_, currIdx) => currIdx !== idx))}
            
            />)
        }
    </>

}