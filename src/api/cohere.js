const { CohereClientV2 } = require('cohere-ai');

const cohere = new CohereClientV2({
  // Asegúrate de configurar tu API key en las variables de entorno
  apiKey: process.env.COHERE_API_KEY
});

export async function POST(request) {
  try {
    const { message, weatherData, cityName } = await request.json();

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

    return Response.json({
      success: true,
      response: response.message.content[0].text
    });

  } catch (error) {
    console.error('Error al comunicarse con Cohere:', error);
    return Response.json(
      { 
        success: false, 
        error: 'Error al procesar la consulta' 
      }, 
      { status: 500 }
    );
  }
}