//click on class in ui to see professors
export const ProfessorFilterer = ({selectedCourseForFilter, courses, setCourses}) => {


    console.log("Im rendering the filterer")
    const toggleProfessor = (prof, isChecked) => {
        console.log("Toggling", prof)
        setCourses((oldCourses) => {
            let newCourses = {...oldCourses}
            newCourses[selectedCourseForFilter][prof] = isChecked

            return newCourses
        })
    }

    return <div>
        {
            courses[selectedCourseForFilter] ?
            Object.entries(courses[selectedCourseForFilter]).map(([professor, isProfessorToggled]) => {
                return <label>
                    <input 
                        type="checkbox" 
                        checked={isProfessorToggled} 
                        onChange={(e) => {toggleProfessor(e.target.value, e.target.checked)}} 
                        value={professor}
                    /> 
                        {professor} 
                </label>
                
            }) : <p> Click on a class to filter professors for it! </p>
        }
    </div>
}
