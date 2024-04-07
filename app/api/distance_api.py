### given 2 locations the function will return the distance + time between them 
import requests
from constants import MAP_ID, API_KEY

def get_location_lat_lng(location_name):
    search_url = "https://api.concept3d.com/search"
    params = {
        "map": MAP_ID,
        "q": location_name,
        "ppage": 5,
        "key": API_KEY
    }
    response = requests.get(search_url, params=params)
    
    #print(f"Request URL: {response.request.url}")
    #print(f"Response Status Code: {response.status_code}")
    #print("Response Body:", response.json() if response.status_code == 200 else response.text)
    if response.status_code == 200:
        data = response.json()
        if data["totalFound"] > 0:
            location_data = data["data"][0]
            return location_data["lat"], location_data["lng"]
    return None, None

def calculate_distance_and_time(from_lat, from_lng, to_lat, to_lng):
    wayfinding_url = "https://api.concept3d.com/wayfinding/"
    
    params = {
        "map": MAP_ID,
        "v2": "true",
        "fromLat": from_lat,
        "fromLng": from_lng,
        "toLat": to_lat,
        "toLng": to_lng,
        "fromLevel": "0",  # Assuming level 0 as default
        "toLevel": "0",    
        "currentLevel": "0",  
        "stamp": "MCOWY3k2",  
        "key": API_KEY
    }
    response = requests.get(wayfinding_url, params=params)
    # Debugging prints
    #print(f"Request URL: {response.request.url}")
    #print(f"Response Status Code: {response.status_code}")
    #print("Response Body:", response.json() if response.status_code == 200 else response.text)
    if response.status_code == 200:
        data = response.json()
        return data["formattedDuration"], data["distance"]
    return None, None
