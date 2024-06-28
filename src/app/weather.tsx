interface WeatherProps {
  city: string;
  unit: string;
}
export async function Weather({ city, unit }: WeatherProps) {
  const data: { temperature: number; unit: string; description: string } =
    await fetch(
      `https://api.example.com/weather?city=${city}&unit=${unit}`
    ).then((response) => response.json());

  return (
    <div>
      <div>{data.temperature}</div>
      <div>{data.unit}</div>
      <div>{data.description}</div>
    </div>
  );
}
