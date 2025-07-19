interface CohereCallProps {
  message: string;
  weatherData: any;
  cityName: string;
}

interface CohereResponse {
  success: boolean;
  response?: string;
  error?: string;
}

export async function callCohere({ message, weatherData, cityName }: CohereCallProps): Promise<CohereResponse> {
  try {
    console.log('CallCohere iniciado:', { message, cityName, weatherData }); // Debug log
    
    // Por ahora, simularemos una respuesta basada en los datos del clima
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simular delay de API
    
    // Generar respuesta contextual basada en los datos del clima
    let response = '';
    
    if (weatherData?.current) {
      console.log('Datos del clima encontrados:', weatherData.current); // Debug log
      
      const temp = weatherData.current.temperature_2m;
      const humidity = weatherData.current.relative_humidity_2m;
      const windSpeed = weatherData.current.wind_speed_10m;
      const apparentTemp = weatherData.current.apparent_temperature;
      
      // Analizar el mensaje del usuario para dar respuestas más específicas
      const lowerMessage = message.toLowerCase();
      
      if (lowerMessage.includes('temperatura') || lowerMessage.includes('calor') || lowerMessage.includes('frío')) {
        response = `En ${cityName}, la temperatura actual es de ${temp}°C, con una sensación térmica de ${apparentTemp}°C. `;
        if (temp > 25) {
          response += 'Hace bastante calor, te recomiendo ropa ligera y mantenerte hidratado.';
        } else if (temp < 15) {
          response += 'Hace frío, te recomiendo abrigarte bien.';
        } else {
          response += 'La temperatura es agradable.';
        }
      } else if (lowerMessage.includes('humedad')) {
        response = `La humedad relativa en ${cityName} es del ${humidity}%. `;
        if (humidity > 70) {
          response += 'Hay bastante humedad en el ambiente.';
        } else if (humidity < 40) {
          response += 'El ambiente está bastante seco.';
        } else {
          response += 'Los niveles de humedad son normales.';
        }
      } else if (lowerMessage.includes('viento')) {
        response = `La velocidad del viento en ${cityName} es de ${windSpeed} km/h. `;
        if (windSpeed > 20) {
          response += 'Hay viento fuerte, ten cuidado si sales.';
        } else if (windSpeed < 5) {
          response += 'Hay muy poco viento.';
        } else {
          response += 'El viento es moderado.';
        }
      } else if (lowerMessage.includes('lluvia') || lowerMessage.includes('llover')) {
        response = `No tengo datos específicos sobre precipitación en tiempo real para ${cityName}, pero basándome en las condiciones actuales con ${humidity}% de humedad, `;
        if (humidity > 80) {
          response += 'existe una posibilidad de lluvia.';
        } else {
          response += 'es menos probable que llueva en las próximas horas.';
        }
      } else if (lowerMessage.includes('ropa') || lowerMessage.includes('vestir')) {
        response = `Basándome en el clima de ${cityName} (${temp}°C, sensación térmica ${apparentTemp}°C), te recomiendo: `;
        if (temp > 25) {
          response += 'ropa ligera, camiseta y pantalón corto.';
        } else if (temp < 15) {
          response += 'ropa abrigada, chaqueta o suéter.';
        } else {
          response += 'ropa cómoda, ni muy ligera ni muy abrigada.';
        }
      } else {
        // Respuesta general con todos los datos
        response = `En ${cityName} tenemos:\n`;
        response += `🌡️ Temperatura: ${temp}°C (sensación térmica: ${apparentTemp}°C)\n`;
        response += `💧 Humedad: ${humidity}%\n`;
        response += `💨 Viento: ${windSpeed} km/h\n\n`;
        response += `¿Te gustaría saber algo específico sobre estos datos del clima?`;
      }
    } else {
      response = `No tengo datos del clima disponibles para ${cityName} en este momento. Por favor, intenta más tarde.`;
    }
    
    
    console.log('Respuesta generada:', response); // Debug log
    
    return {
      success: true,
      response: response
    };
    
  } catch (error) {
    console.error('Error en callCohere:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido'
    };
  }
}