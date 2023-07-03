from flask import Flask, render_template, request
from dotenv import load_dotenv
load_dotenv()
import os
import requests
import json 
from utils import forest_fire_prediction
# from flask import SQLAlchemy 

app = Flask(__name__)

if __name__ == "__main__":
    app.run(debug=True)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/weather')
def weather():
    return render_template('weather.html')

@app.route('/current_weather', methods = ['POST', 'GET'])
def currentWeather():
    # extract lat long information
    print("request get weather: ", request.get_json())
    data = request.get_json()
    latLong = (str)(data['latitude'])+','+(str)(data['longitude'])

    # get location id 
    locId = call_location_id_api(latLong)
    print(locId)

    # get current weather information
    return call_currentWeatherInfo_api(locId)

@app.route('/forest-fire', methods = ['POST', 'GET'])
def forest_fire():
    data = request.get_json()
    print(data)
    return forest_fire_prediction(data)

@app.route('/get_location', methods = ['POST', 'GET'])
def get_location_info():
    data = request.get_json()
    latLong = (str)(data['latitude'])+','+(str)(data['longitude'])

    # get location id 
    return call_get_location_api(latLong)

@app.route('/weather_forecast', methods = ['POST', 'GET'])
def weatherForecast():
    # extract lat long information
    data = request.get_json()
    latLong = (str)(data['latitude'])+','+(str)(data['longitude'])

    # get location id 
    locId = call_location_id_api(latLong)
    # get current weather information
    return call_12hrForecast_api(locId)

# API CALLS
weather_api_key = os.getenv('ACCU_WEATHER_API_KEY')

def call_get_location_api(latLong):
    base_url = 'http://dataservice.accuweather.com/locations/v1/cities/geoposition/search'
    query_params = {
        'apikey': weather_api_key,
        'q':latLong
    }
    response = requests.get(base_url, params=query_params)
    location_info = json.loads(response.content)
    
    return location_info

def call_location_id_api(latLong):
    base_url = 'http://dataservice.accuweather.com/locations/v1/cities/geoposition/search'
    query_params = {
        'apikey': weather_api_key,
        'q':latLong
    }
    response = requests.get(base_url, params=query_params)
    if response.status_code == 200:
        location_info = json.loads(response.content)
        location_id = location_info['Key']
        return location_id
    else:
        return '2764029'
    
def call_currentWeatherInfo_api(location_id):
    base_url = 'http://dataservice.accuweather.com/currentconditions/v1/'+location_id
    query_params = {
        'apikey': weather_api_key,
        'details': True
    }
    response = requests.get(base_url, params=query_params)
    if response.status_code == 200:
        weather_info = json.loads(response.content)
        return weather_info
    else:
        return None

def call_12hrForecast_api(location_id):
    base_url =  'http://dataservice.accuweather.com/forecasts/v1/hourly/12hour/'+location_id
    query_params = {
        'apikey': weather_api_key,
    }
    response = requests.get(base_url, params=query_params)
    if response.status_code == 200:
        weather_info = json.loads(response.content)
        return weather_info
    else:
        return None