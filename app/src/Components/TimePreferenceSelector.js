export const TimePreferenceSelector = ({timePreference, setTimePreference}) => {
    
    return <div className="timePreferenceContainer">
        <p>Schedule my classes</p>

        <div className="radioContainer">
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
                        LATER
                </label>
        </div>
  </div>
}