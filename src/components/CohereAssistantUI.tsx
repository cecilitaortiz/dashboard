import React, { useState, useRef } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  TextField, 
  Button, 
  Box, 
  Typography, 
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Divider,
  Alert
} from '@mui/material';
import { Send, Psychology, Warning } from '@mui/icons-material';

interface CohereAssistantUIProps {
  weatherData: any;
  cityName: string;
  coordinates: { latitude: number; longitude: number };
}

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

const CohereAssistantUI: React.FC<CohereAssistantUIProps> = ({ 
  weatherData, 
  cityName, 
  coordinates 
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [rateLimitExceeded, setRateLimitExceeded] = useState(false);
  const [remainingRequests, setRemainingRequests] = useState(20);
  
  // Referencia para almacenar las marcas de tiempo de las llamadas
  const callTimestamps = useRef<number[]>([]);

  const checkRateLimit = (): boolean => {
    const now = Date.now();
    const oneMinuteAgo = now - 60000; // 60 segundos en milisegundos
    
    // Filtrar llamadas de los últimos 60 segundos
    callTimestamps.current = callTimestamps.current.filter(timestamp => timestamp > oneMinuteAgo);
    
    // Verificar si se ha excedido el límite
    if (callTimestamps.current.length >= 20) {
      setRateLimitExceeded(true);
      setRemainingRequests(0);
      return false;
    }
    
    // Agregar la marca de tiempo actual
    callTimestamps.current.push(now);
    setRemainingRequests(20 - callTimestamps.current.length);
    setRateLimitExceeded(false);
    return true;
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    // Verificar límite de llamadas
    if (!checkRateLimit()) {
      const errorMessage: Message = {
        id: Date.now(),
        text: 'Has excedido el límite de 20 consultas por minuto. Por favor, espera un momento antes de intentar nuevamente.',
        sender: 'assistant',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      return;
    }

    const userMessage: Message = {
      id: Date.now(),
      text: inputText.trim(),
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      // Aquí integrarías con la API de Cohere
      // Por ahora, simulamos una respuesta
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const assistantMessage: Message = {
        id: Date.now() + 1,
        text: `Basándome en los datos del clima de ${cityName}, te puedo ayudar con información sobre el tiempo. Los datos actuales muestran ${weatherData?.current?.temperature_2m || '--'}°C de temperatura.`,
        sender: 'assistant',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error al comunicarse con Cohere:', error);
      const errorMessage: Message = {
        id: Date.now() + 1,
        text: 'Lo siento, hubo un error al procesar tu consulta. Por favor, intenta nuevamente.',
        sender: 'assistant',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Card sx={{ height: '350px', display: 'flex', flexDirection: 'column' }}>
      <CardHeader
        title={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Psychology color="primary" fontSize="small" />
            <Typography variant="subtitle1">
              Asistente Cohere
            </Typography>
          </Box>
        }
        subheader={
          <Box>
            <Typography variant="body2" color="text.secondary">
              Pregunta sobre el clima en {cityName}
            </Typography>
            <Typography variant="caption" color={remainingRequests <= 5 ? 'error' : 'text.secondary'}>
              Consultas restantes: {remainingRequests}/20
            </Typography>
          </Box>
        }
        sx={{ pb: 1 }}
      />
      
      <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', p: 1, pt: 0 }}>
        {/* Alerta de límite excedido */}
        {rateLimitExceeded && (
          <Alert 
            severity="warning" 
            icon={<Warning fontSize="small" />}
            sx={{ mb: 1, py: 0.5 }}
          >
            <Typography variant="caption">
              Límite de consultas excedido. Espera 1 minuto.
            </Typography>
          </Alert>
        )}

        {/* Área de mensajes */}
        <Box 
          sx={{ 
            flex: 1, 
            overflowY: 'auto', 
            mb: 1,
            border: '1px solid #e0e0e0',
            borderRadius: 1,
            p: 1,
            minHeight: '200px'
          }}
        >
          {messages.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 1, fontSize: '0.8rem' }}>
              ¡Hola! Pregúntame sobre el clima en {cityName}.
            </Typography>
          ) : (
            <List sx={{ p: 0 }}>
              {messages.map((message, index) => (
                <React.Fragment key={message.id}>
                  <ListItem sx={{ 
                    justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
                    py: 0.5
                  }}>
                    <Box sx={{
                      maxWidth: '85%',
                      bgcolor: message.sender === 'user' ? 'primary.main' : 'grey.100',
                      color: message.sender === 'user' ? 'white' : 'text.primary',
                      borderRadius: 2,
                      px: 1.5,
                      py: 0.5
                    }}>
                      <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
                        {message.text}
                      </Typography>
                      <Typography variant="caption" sx={{ 
                        opacity: 0.7,
                        fontSize: '0.6rem'
                      }}>
                        {message.timestamp.toLocaleTimeString()}
                      </Typography>
                    </Box>
                  </ListItem>
                  {index < messages.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          )}
          
          {isLoading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
              <CircularProgress size={16} />
              <Typography variant="body2" sx={{ ml: 1, fontSize: '0.8rem' }}>
                Pensando...
              </Typography>
            </Box>
          )}
        </Box>

        {/* Área de entrada */}
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Pregunta sobre el clima..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading || rateLimitExceeded}
            sx={{ '& .MuiInputBase-input': { fontSize: '0.8rem' } }}
          />
          <Button
            variant="contained"
            onClick={handleSendMessage}
            disabled={!inputText.trim() || isLoading || rateLimitExceeded}
            size="small"
            sx={{ minWidth: 'auto', px: 1.5 }}
          >
            <Send fontSize="small" />
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CohereAssistantUI;