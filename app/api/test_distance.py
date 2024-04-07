map_id = "1005"
api_key = "0001085cc708b9cef47080f064612ca5"
from_location = "Warren Lecture Hall"
to_location = "Price Center"  # Replace "PCYNH" with an actual second location for accurate testing

# Retrieving latitude and longitude for both locations
from_lat, from_lng = get_location_lat_lng(from_location, map_id, api_key)
to_lat, to_lng = get_location_lat_lng(to_location, map_id, api_key)

# Calculating distance and time if both locations' coordinates were found
if None not in (from_lat, from_lng, to_lat, to_lng):
    time, distance = calculate_distance_and_time(from_lat, from_lng, to_lat, to_lng, map_id, api_key)
    print(f"Time: {time}, Distance: {distance} meters")
else:
    print("Could not retrieve location information for one or both of the locations.")