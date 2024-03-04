import axios  from 'axios';
import routes from './routes.js';


const bearerToken = 'eyJhbGciOiJSUzI1NiIsImtpZCI6ImQzOWE5MzlhZTQyZmFlMTM5NWJjODNmYjcwZjc1ZDc3IiwidHlwIjoiSldUIn0.eyJuYmYiOjE3MDk1NTQ1MDQsImV4cCI6MTcwOTY0MDkwNCwiaXNzIjoiaHR0cHM6Ly9pbnRyYWZlYi5mZWIuZXMvaWRlbnRpdHkuYXBpIiwiYXVkIjpbImh0dHBzOi8vaW50cmFmZWIuZmViLmVzL2lkZW50aXR5LmFwaS9yZXNvdXJjZXMiLCJsaXZlc3RhdHMuYXBpIl0sImNsaWVudF9pZCI6ImJhbG9uY2VzdG9lbnZpdm9hcHAiLCJpZGFtYml0byI6IjEiLCJyb2xlIjpbIk92ZXJWaWV3IiwiVGVhbVN0YXRzIiwiU2hvdENoYXJ0IiwiUmFua2luZyIsIktleUZhY3RzIiwiQm94U2NvcmUiXSwic2NvcGUiOlsibGl2ZXN0YXRzLmFwaSJdfQ.fOBxBJ0bFnNBx8GRvl0Gbr2patOvNlodrWe8zIK1Zgrz3pfCQAAc8qWQ67bJhBwgjHTMEQHuAa8WL47ZVGCuqyK6NWvZYAGfwlxP57FO7rZfODMJRhKhKkuXEMGbc5wdg45HkywXQUjDEvwyh7-lueEaJqrCHl7N6LKO8AI5WF0qEmilbmXHq_MQNybdH81RINsNnA-uckqcztUmwhQ5_Xci7S_8RBY9GJw2RFGLktjN9F51U57F6wOzCo16yz4a6gmHZpWUq9cRTbiQ-AQfcL3Ta4WMnP-8x1ajbC8NSbo46g-vdAdKJk82h_FIOFsH3pHfZFl96A_YIN81iEICIg'

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