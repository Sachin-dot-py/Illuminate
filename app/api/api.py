from flask import Flask, request
import json
from scraping import Scraper
from utils import generate_schedules
from capes import get_capes_data
from distance_api import calculate_distance_and_time, get_location_lat_lng

app = Flask(__name__)


@app.route('/get_schedule', methods=['POST'])
def get_schedule():
    # Get the user submitted data
    data = request.get_json()
    classes = data.get('classes')
    classes = [c.upper() for c in classes]
    sort_by = data.get('sortTimesBy')
    unavailability = data.get('unavailabilities')

    # Scrape the classes
    scraper = Scraper(classes)
    classes = scraper.get_classes()

    # Generate the schedules
    schedules = generate_schedules(classes, sort_by, unavailability)
    # Might be less than 3 schedules
    top3 = [schedules.get()[2] for _ in range(3) if not schedules.empty()]

    # Add the CAPE data
    for n, schedule in enumerate(top3):
        top3[n] = get_capes_data(schedule)

    # Add Distance between classes
    for schedule in top3:
        for day in schedule.schedule.values():
            if len(day) >= 2:
                for i in range(len(day) - 1):
                    from_lat, from_long = get_location_lat_lng(day[i]['location'].split(" ")[0])
                    to_lat, to_long = get_location_lat_lng(day[i + 1]['location'].split(" ")[0])
                    time_, distance = calculate_distance_and_time(from_lat, from_long, to_lat, to_long)
                    day[i+1]['walkingTime'] = time_

    return json.dumps([schedule.schedule for schedule in top3])

@app.route('/get_profs', methods=['POST'])
def get_profs():
    data = request.get_json()
    selected_class = data.get('class')
    scraper = Scraper([selected_class])
    classes = scraper.get_classes()

    professors = []
    for part in classes[selected_class]:
        if part[0]['professor'] not in professors:
            professors.append(part[0]['professor'])
        
    return json.dumps(professors)

if __name__ == "__main__":
    app.run()