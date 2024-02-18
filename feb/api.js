import axios  from 'axios';
import routes from './routes.js';


const bearerToken = 'eyJhbGciOiJSUzI1NiIsImtpZCI6ImQzOWE5MzlhZTQyZmFlMTM5NWJjODNmYjcwZjc1ZDc3IiwidHlwIjoiSldUIn0.eyJuYmYiOjE3MDgyODcyNzQsImV4cCI6MTcwODM3MzY3NCwiaXNzIjoiaHR0cHM6Ly9pbnRyYWZlYi5mZWIuZXMvaWRlbnRpdHkuYXBpIiwiYXVkIjpbImh0dHBzOi8vaW50cmFmZWIuZmViLmVzL2lkZW50aXR5LmFwaS9yZXNvdXJjZXMiLCJsaXZlc3RhdHMuYXBpIl0sImNsaWVudF9pZCI6ImJhbG9uY2VzdG9lbnZpdm9hcHAiLCJpZGFtYml0byI6IjEiLCJyb2xlIjpbIk92ZXJWaWV3IiwiVGVhbVN0YXRzIiwiU2hvdENoYXJ0IiwiUmFua2luZyIsIktleUZhY3RzIiwiQm94U2NvcmUiXSwic2NvcGUiOlsibGl2ZXN0YXRzLmFwaSJdfQ.T_WsjLsBV5lcK2TpJgOjnvj3S994XDM41PnuyYVwB-nUsBjfI3ugvAoCJ5nZLKivQaBnCVIX9WRgmT_MqjZ-filZle5oJ5lMMy8DoU92Fh8h_nxEgz0lucipEXS6mmCiIippSBidZkRVHWux7zpUo992UM5iHaTd1zOPqHh78TaYE9JWODM2XyYP74YDomJ1SLm66z9LBjpvPXREYJsEIjHa2sLVXiWZzi3QDPOxe8WZsX_55yTUuXKte3gAl8aLA_a51hgAPcuYRYFvvv52JHUS0ZNSZpXgBZUHvGEe3t8fttktOHxu-AAQVmv3LAeZHHoz8MTjqbs8wRbYA2c3Vw'

export const getAPIBoxscore = async (gamecode) => {
  try {
    const url = routes.boxScore+gamecode
    return await axios.get(url,{
        headers: {
            'Authorization': 'Bearer '+bearerToken       }
    })
  } catch (error) {
    console.error(error)
  }
}

export const getAPIPlayByPlay = async (gamecode) => {
  try {
    const url = routes.playByPlay+gamecode
    return await axios.get(url,{
        headers: {
            'Authorization': 'Bearer '+bearerToken       }
    })
  } catch (error) {
    console.error(error)
  }
}

export const getAPIShots = async (gamecode) => {
  try {
    const url = routes.shotChart+gamecode
    return await axios.get(url,{
        headers: {
            'Authorization': 'Bearer '+bearerToken       }
    })
  } catch (error) {
    console.error(error)
  }
}