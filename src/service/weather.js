import request from './request'


export const getCityLngLat = async (city) => {
    const response = await request.get('/geo/v2/city/lookup', {
        params: { location: city },
    })
    return response
}

export const getWeather = async ([lng, lat]) => {
    const response = await request.get(`/weather/v1/current/${Number(lat).toFixed(2)}/${Number(lng).toFixed(2)}`, {
        // params: { latitude: lat, longitude: lng },
    })
    return response
}