export const TimePreferenceSelector = ({timePreference, setTimePreference}) => {
    
    return <div>
        <p>Availability</p>
        <label>
        <input type='radio'
                value="EARLIEST"
                checked = {timePreference == "EARLIEST"}
                onChange = {(e) => setTimePreference(e.target.value)}
        />
        EARLIER
        </label>
        <label>
        <input type='radio'
                value="LATEST"
                checked = {timePreference == "LATEST"}
                onChange = {(e) => setTimePreference(e.target.value)}
        />
        LATEST
        </label>
  </div>
}