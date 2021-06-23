const request = require('request')

const geocode = (address,callback) => {
    const urlGeo = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?proximity=-74.70850,40.78375&access_token=pk.eyJ1IjoiYnJ5YW5qb2VoIiwiYSI6ImNrcTZudG5jMDBuYTcyb2x4d3g3NXNnOGwifQ.ABL6TBIPxrOGmF1QhpHJDg&limit=1`;
    
    request({url:urlGeo, json:true}, (error,{body} = {}) => {
        if (error){
            callback('error',undefined);
        } else if (body.message) {
            callback(`Error: ${body.message}`,undefined)
        } else if (body.features.length === 0){
            callback('Location not found. Try again with a valid location',undefined)
        } else {
            const {place_name: nameOfPlace, center} = body.features[0];
            callback(undefined,{
                nameOfPlace,
                longitude : center[0],
                latitude :  center[1],
            })
        }
    })
}


const weatherUpdate = (latitude,longitude,callback) => {
    const url = `http://api.weatherstack.com/current?access_key=e9890cc9d0f24ce1ad79b1bddf01199a&query=${latitude},${longitude}`;
    // 37.8267, -122.4233 

    request( {url, json:true }, (error,{body} = {}) => {
        if (error) {
            callback('Cannot connect to WeatherStack API. There may be a network error.',undefined)
        } else if (body.error) {
            callback(`Code: ${body.error.code}, ${body.error.info}`,undefined)
        } else {
            const {weather_descriptions: weatherDescript, temperature:currentTemp, feelslike: feelsLikeTemp } = body.current;
            const {name: nameOfPlace, region, country} = body.location;
            let emoji = '';
            if (feelsLikeTemp >= 30) {
                emoji = `🥵🔥🥵`
            } else if (feelsLikeTemp < 30 && feelsLikeTemp >= 15){
                emoji = '😎🆒😎'
            } else  {
                emoji = '🥶🧊🥶'
            }

            callback(undefined, {
                location: `${nameOfPlace}, ${region} ${country}`,
                forecast: `${weatherDescript[0]}. The temperature for today is ${currentTemp}°C and it feels like ${feelsLikeTemp}°C ${emoji}`
            });
        }
    })
}


module.exports = {
    geocode,
    weatherUpdate
}