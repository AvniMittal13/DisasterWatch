# DisasterWatch

## THEME CHOSEN:

Natural Disaster Prediction: Develop AI algorithms and models that utilize environmental data to predict and identify potential natural disasters, such as hurricanes, floods, wildfires, and earthquakes. The system should be able to provide early warnings and assist in disaster preparedness and response efforts.

## OBJECTIVE AND SOLUTION
![image](https://github.com/AvniMittal13/DisasterWatch/assets/75574159/8d91946c-5fc9-4f41-8d03-8d4c5d5b57b9)


- Design a user-friendly interface that allows users to interact with a map and select a location of interest.
- Integrate weather data APIs to fetch real-time weather information based on the selected location.
- Collect and curate historical weather data specific to the Indian subcontinent, along with labeled disaster occurrences.
- Utilize deep learning models trained on global parameters such as humidity, temperature, etc., to predict the chances of natural disasters for India.
- Implement the trained models into the web application to provide accurate predictions about the likelihood of disasters at the chosen location.
- Enable users to access timely and reliable information, empowering them to take proactive measures for disaster preparedness.
- Provide valuable insights for individuals, communities, and disaster response agencies to optimize resource allocation and mitigate the devastating impacts of natural disasters.

## FEATURES
![image](https://github.com/AvniMittal13/DisasterWatch/assets/75574159/8f981d6b-6315-4f7e-96dc-cef7c1ec32b9)

## Techstack
- Flask Application for backend, HTML, CSS, JavaScript for Frontend. 
- Python has most implementations of machine learning models, will make it easy to develop and deploy applications. 
- Tensorflow used to train disaster forecasting models
- Weather Data APIs: AccuWeather Api is used for getting real-time weather information.


## How to start

1. Make Virtual Environment
```
python -m venv venv
source venv/Scripts/activate
```

2. Pip install requirements.txt

```
pip install -r requirements.txt
```

3. Generate Api for AccuWeather Api and add the following to .env file

```
ACCU_WEATHER_API_KEY = "API_KEY"
```

4. Run the final command for execution 
```
flask run
```
or 
```
python app.py
```
![image](https://github.com/AvniMittal13/DisasterWatch/assets/75574159/b4753cba-480a-491e-afee-21c4754ff83d)

