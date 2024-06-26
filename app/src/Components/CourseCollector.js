import { useState } from "react"
import { Course } from "./Course"
import { ProfessorFilterer } from "./ProfessorFilterer"

export const CourseCollector = ({courses, setCourses, setSelectedCourseForFilter, selectedCourseForFilter}) => {
    //COURSES IS A LIST
    const [courseInput, setCourseInput] = useState("")

    const clearCourseInput = () => setCourseInput("")

    const addCourse = (courseName) => {
        
        // TODO VERIFY COURSE EXISTS
        // console.log()
        setCourses((old) => ({...old, [courseName]: {}}))
    }

    const onSubmit = (e) => {
        e.preventDefault()
        
        addCourse(courseInput)

        clearCourseInput()
    }

    const deleteCourse = (course) => {
        setCourses((oldCourses) => {
            let newCourses = {...oldCourses}

            delete newCourses[course]

            return newCourses
        })

    }



    return <div className="courseCollectorContainer">
        <p> Input desired courses one by one. </p>
        
        <form onSubmit={onSubmit}>
            <input onChange={(e) => setCourseInput(e.target.value)} value={courseInput} name="courseInput" placeholder="Course Title + Enter"/>
        </form>

        <div className="courselist">
            {
                Object.entries(courses).map(([courseName, profs], idx) => 
                <Course courseName = {courseName} 
                        setCourses={setCourses}
                        courses={courses}
                        selectedCourseForFilter={selectedCourseForFilter}
                        onDelete={() => deleteCourse(courseName)}
                        setSelectedCourseForFilter = {setSelectedCourseForFilter}
                />)
            }
        </div>
    </div>

}