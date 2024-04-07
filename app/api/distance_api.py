### given 2 locations the function will return the distance + time between them 
import requests

def get_location_lat_lng(location_name, map_id, api_key):
    search_url = "https://api.concept3d.com/search"
    params = {
        "map": map_id,
        "q": location_name,
        "ppage": 5,
        "key": api_key
    }
    response = requests.get(search_url, params=params)
    
    print(f"Request URL: {response.request.url}")
    print(f"Response Status Code: {response.status_code}")
    print("Response Body:", response.json() if response.status_code == 200 else response.text)
    if response.status_code == 200:
        data = response.json()
        if data["totalFound"] > 0:
            location_data = data["data"][0]
            return location_data["lat"], location_data["lng"]
    return None, None

def calculate_distance_and_time(from_lat, from_lng, to_lat, to_lng, map_id, api_key):
    wayfinding_url = "https://api.concept3d.com/wayfinding/"
    
    params = {
        "map": map_id,
        "v2": "true",
        "fromLat": from_lat,
        "fromLng": from_lng,
        "toLat": to_lat,
        "toLng": to_lng,
        "fromLevel": "0",  # Assuming level 0 as default
        "toLevel": "0",    
        "currentLevel": "0",  
        "stamp": "MCOWY3k2",  
        "key": api_key
    }
    response = requests.get(wayfinding_url, params=params)
    # Debugging prints
    print(f"Request URL: {response.request.url}")
    print(f"Response Status Code: {response.status_code}")
    print("Response Body:", response.json() if response.status_code == 200 else response.text)
    if response.status_code == 200:
        data = response.json()
        return data["formattedDuration"], data["distance"]
    return None, None


map_id = "1005"
api_key = "0001085cc708b9cef47080f064612ca5"
from_location = "WLH"
to_location = "PC"


from_lat, from_lng = get_location_lat_lng(from_location, map_id, api_key)
to_lat, to_lng = get_location_lat_lng(to_location, map_id, api_key)


if None not in (from_lat, from_lng, to_lat, to_lng):
    time, distance = calculate_distance_and_time(from_lat, from_lng, to_lat, to_lng, map_id, api_key)
    print(f"Time: {time}, Distance: {distance} meters")
else:
    print("Could not retrieve location information for one or both of the locations.")