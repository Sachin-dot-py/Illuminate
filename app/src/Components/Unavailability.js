import TimeRange from "react-time-range"

export const Unavailability = ({startTime, endTime, onChange, onDelete}) => {
    return <div className="unavailabilityContainer">
        <TimeRange use24Hours = {true} startMoment={startTime} endMoment={endTime} onChange={onChange}/>
        <button onClick = {onDelete}> X </button>
    </div>
}