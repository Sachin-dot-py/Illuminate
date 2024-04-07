import "./Course.css"
import { PROFESSOR_URL } from "../utils"
import { useState, useEffect } from "react"

export const Course = ({courseName, onDelete, setCourses, setSelectedCourseForFilter}) => {

    const [areProfessorsLoading, setAreProfessorsLoading] = useState(false)
    const [areProfessorsFetched, setAreProfessorsFetched] = useState(false)
    const [professors, setProfessors] = useState([])

    const addProfessorsToCourse = (courseName, professors) => {
        console.log("Appending new professors")
        console.log(professors)

        setCourses((oldCourses) => {
            let newCourses = {...oldCourses}
            const profFilter = professors.reduce((profFilter, currProf) => {
                profFilter[currProf] = true
                return profFilter
            }, {})

            newCourses[courseName] = profFilter

            console.log()
            return newCourses
        })
    }


    const fetchProfessors = async () => {
        setAreProfessorsLoading(true)
        const body = JSON.stringify({class: courseName})
        const res = await fetch(PROFESSOR_URL, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body
        }).then((res) => res.json())

        setProfessors(res)
        addProfessorsToCourse(courseName, res)
        setAreProfessorsLoading(false)
        return res
    }

    const onClick = () => {
        setSelectedCourseForFilter(courseName)
    }

    useEffect(() => {
        console.log("Fetching Professors! Might need an if here")
        if(!areProfessorsFetched){
            fetchProfessors()
            setAreProfessorsFetched(true)
        }
    }, [])

    return <div className="course">
        <p className="course-title" onClick={onClick}> {courseName} </p>
        <button onClick={onDelete}> X </button>
    </div>
}