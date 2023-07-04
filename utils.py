import tensorflow as tf
import numpy as np
from joblib import load

forest_fire_scalar = load('models/forest_fires/forest_fire_scalar.bin')
hurricane_scaler =  load('models/hurricane/hurricane_scalar.bin')

def forest_fire_prediction(input_data):
    input_data['rain'] = np.log(input_data['rain'] + 1)
    print(input_data)
    input_arr =  np.array([[input_data['temperature'], input_data['humidity'], input_data['wind'], input_data['rain']]])

    input_arr = forest_fire_scalar.transform(input_arr)
    print(input_arr)
    sum = 0
    for idx in range(1,6):
        # temp(Celcius), humidity(%), wind(km/h), rain(mm/m2)
        model = tf.keras.models.load_model('models/forest_fires/forest_fire_'+ str(idx) +'.h5')
        prediction = model.predict(input_arr)
        sum = sum + prediction

    sum_val = sum[0][0]
    ans = sum_val/5
    if ans-0.4>0 :
        ans = ans - 0.4
    return {'value': ans}

def hurricane_prediction(input_data):
    input_data['wind'] = np.log(input_data['wind'] + 1)
    input_data['pressure'] = np.log(input_data['pressure'] + 1)

    print(input_data)
    input_arr =  np.array([[input_data['wind'], input_data['pressure']]])

    input_arr = hurricane_scaler.transform(input_arr)
    print(input_arr)
    sum = 0
    for idx in range(1,6):
        model = tf.keras.models.load_model('models/forest_fires/forest_fire_'+ str(idx) +'.h5')
        prediction = model.predict(input_arr)
        print("model ", idx,  " : ", prediction)
        print(np.argmax(prediction))

        sum = sum + np.argmax(prediction)

    sum_val = sum[0][0]
    ans = sum_val/4
    pred = "no hurricane"
    if ans>5 :
        pred = "hurricane can occur"
    
    return {'value': pred}
