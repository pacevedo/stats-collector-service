import axios  from 'axios';
import routes from './routes.js';


const bearerToken = 'eyJhbGciOiJSUzI1NiIsImtpZCI6ImQzOWE5MzlhZTQyZmFlMTM5NWJjODNmYjcwZjc1ZDc3IiwidHlwIjoiSldUIn0.eyJuYmYiOjE2OTk2MjU1MzcsImV4cCI6MTY5OTcxMTkzNywiaXNzIjoiaHR0cHM6Ly9pbnRyYWZlYi5mZWIuZXMvaWRlbnRpdHkuYXBpIiwiYXVkIjpbImh0dHBzOi8vaW50cmFmZWIuZmViLmVzL2lkZW50aXR5LmFwaS9yZXNvdXJjZXMiLCJsaXZlc3RhdHMuYXBpIl0sImNsaWVudF9pZCI6ImJhbG9uY2VzdG9lbnZpdm9hcHAiLCJpZGFtYml0byI6IjEiLCJyb2xlIjpbIk92ZXJWaWV3IiwiVGVhbVN0YXRzIiwiU2hvdENoYXJ0IiwiUmFua2luZyIsIktleUZhY3RzIiwiQm94U2NvcmUiXSwic2NvcGUiOlsibGl2ZXN0YXRzLmFwaSJdfQ.ls70GOuM9-OeCs5p8RoWHiGnXfmTLN3Z0BBrjaSljQtph1QgsmoFd6O6rmeKRpTXp-sejxDjKjqFInSTIkTVIcvzaCx2GiHb4qgl3enaCmrwXMufqnowGjq38dM_oAT56fpKiO5r1YWZaIx3z1phiqd14UyZqh8Y1brmqnS_2_UVD-X35n3Nl3JdR7xFEETz5yULO0iER5ixuPi8E1bTyERirw9ntvuzcqSJ6qYmnPIInlEtNcfVv2cd7WBhPiMYmpcDT6AzjNMWX3PGkVYXs6SWzySC5nIbOBAnIfrQTlw7cLtQb450JWxsz4Ce6piK10xW11EmXNDcEf85uSHo5w'

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