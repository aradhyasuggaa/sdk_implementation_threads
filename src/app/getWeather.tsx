import axios from 'axios';
export async function getWeatherReport(location: string): Promise<any> {
  const apiKey = process.env.OPENAI_API_KEY;
  const response = await axios.get(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${location}`);
  console.log("weather function used");
  return response.data as JSON;
}
