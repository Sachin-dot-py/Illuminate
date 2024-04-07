import "./Course.css"

export const Course = ({courseName, onDelete}) => {


    return <div className="course">
        <p className="course-title"> {courseName} </p>
        <button onClick={onDelete}> X </button>
    </div>
}