import React, { useEffect, useState } from "react";
import Ajv from "ajv";


  const API_KEY = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJqYWNrc29uam9lc214MWFAZ21haWwuY29tIiwianRpIjoiMmE1Yzk4OWYtMDRhNC00NWQ4LWFhZjYtMWNhZGY3ZWFhNDI4IiwiaXNzIjoiQUVNRVQiLCJpYXQiOjE3NDIzMTU4MjcsInVzZXJJZCI6IjJhNWM5ODlmLTA0YTQtNDVkOC1hYWY2LTFjYWRmN2VhYTQyOCIsInJvbGUiOiIifQ.GQyW55JtZT8GFevId8eQbBEM4dSvtL0-3bOk7jLmLWA";
  const API_URL = `https://opendata.aemet.es/opendata/api/red/especial/radiacion/?api_key=${API_KEY}`;
  
// Definir el esquema JSON esperado
const weatherSchema = {
  type: "object",
  properties: {
    temperatura: { type: "number" },
    humedad: { type: "number" },
    descripcion: { type: "string" }
  },
  required: ["temperatura", "humedad", "descripcion"],
};

interface WeatherData {
  temperatura: number;
  humedad: number;
  descripcion: string;
}

const App: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch(API_URL);
        const data = await response.json();

        // Validación con JSON Schema
        const ajv = new Ajv();
        const validate = ajv.compile(weatherSchema);

        if (validate(data)) {
          setWeather({
            temperatura: data.temperatura - 273.15, // Convertir de Kelvin a Celsius
            humedad: data.humedad,
            descripcion: data.descripcion,
          });
        } else {
          setError("Datos inválidos recibidos de la API");
        }
      } catch (err) {
        setError("Error al obtener datos de la API");
      }
    };

    fetchWeather();
  }, []);

  return (
    <div className="App">
      <h1>Datos Meteorológicos</h1>
      {error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : weather ? (
        <div>
          <p>Temperatura: {weather.temperatura.toFixed(1)}°C</p>
          <p>Humedad: {weather.humedad}%</p>
          <p>Descripción: {weather.descripcion}</p>
        </div>
      ) : (
        <p>Cargando datos...</p>
      )}
    </div>
  );
};

export default App;