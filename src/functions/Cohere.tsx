import { CohereClientV2 } from 'cohere-ai';

const cohere = new CohereClientV2({
  apiKey: process.env.COHERE_API_KEY || 'tu_api_key_aqui'
});

export interface CohereRequest {
  message: string;
  weatherData: any;
  cityName: string;
}

export interface CohereResponse {
  success: boolean;
  response?: string;
  error?: string;
}

export async function callCohere({ message, weatherData, cityName }: CohereRequest): Promise<CohereResponse> {
  try {
    // Crear contexto con los datos del clima
    const weatherContext = `
      Información del clima actual en ${cityName}:
      - Temperatura: ${weatherData?.current?.temperature_2m || 'N/A'}°C
      - Humedad: ${weatherData?.current?.relative_humidity_2m || 'N/A'}%
      - Velocidad del viento: ${weatherData?.current?.wind_speed_10m || 'N/A'} km/h
      - Código del tiempo: ${weatherData?.current?.weather_code || 'N/A'}
    `;

    const response = await cohere.chat({
      model: 'command-a-03-2025',
      messages: [
        {
          role: 'system',
          content: `Eres un asistente experto en clima. Responde preguntas sobre el tiempo en ${cityName} usando los datos proporcionados. Sé conciso y útil.`
        },
        {
          role: 'user',
          content: `${weatherContext}\n\nPregunta del usuario: ${message}`
        }
      ],
    });

    return {
      success: true,
      response: response.message.content[0].text
    };

  } catch (error) {
    console.error('Error al comunicarse con Cohere:', error);
    return {
      success: false,
      error: 'Error al procesar la consulta'
    };
  }
}