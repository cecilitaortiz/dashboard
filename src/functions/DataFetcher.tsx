import { useEffect, useState } from 'react';
import type { OpenMeteoResponse } from '../types/DashboardTypes';

interface DataFetcherOutput {
    data: OpenMeteoResponse | null;
    loading: boolean;
    error: string | null;
}

interface DataFetcherProps {
  latitude: number;
  longitude: number;
}

interface CacheEntry {
  data: OpenMeteoResponse;
  timestamp: number;
  key: string;
}

export default function DataFetcher({ latitude, longitude }: DataFetcherProps): DataFetcherOutput {

    const [data, setData] = useState<OpenMeteoResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Configuración de cache
    const CACHE_DURATION_MINUTES = 10; // Vigencia de 10 minutos
    const CACHE_KEY_PREFIX = 'weather_cache_';
    const MAX_CACHE_ENTRIES = 10; // Máximo 10 ubicaciones en cache

    // Generar clave única basada en coordenadas
    const generateCacheKey = (lat: number, lon: number): string => {
        return `${CACHE_KEY_PREFIX}${lat.toFixed(2)}_${lon.toFixed(2)}`;
    };

    // Verificar si el cache es válido
    const isCacheValid = (timestamp: number): boolean => {
        const now = Date.now();
        const cacheAge = now - timestamp;
        const maxAge = CACHE_DURATION_MINUTES * 60 * 1000; // Convertir a milisegundos
        return cacheAge < maxAge;
    };

    // Obtener datos del cache
    const getFromCache = (key: string): OpenMeteoResponse | null => {
        try {
            const cached = localStorage.getItem(key);
            if (!cached) return null;

            const cacheEntry: CacheEntry = JSON.parse(cached);
            
            if (isCacheValid(cacheEntry.timestamp)) {
                console.log('📦 Datos obtenidos del cache:', key);
                return cacheEntry.data;
            } else {
                // Cache expirado, eliminarlo
                localStorage.removeItem(key);
                console.log('⏰ Cache expirado, eliminado:', key);
                return null;
            }
        } catch (error) {
            console.error('❌ Error al leer del cache:', error);
            localStorage.removeItem(key);
            return null;
        }
    };

    // Guardar datos en cache
    const saveToCache = (key: string, data: OpenMeteoResponse): void => {
        try {
            const cacheEntry: CacheEntry = {
                data,
                timestamp: Date.now(),
                key
            };

            // Limpiar cache antiguo si hay demasiadas entradas
            cleanupOldCache();

            localStorage.setItem(key, JSON.stringify(cacheEntry));
            console.log('💾 Datos guardados en cache:', key);
        } catch (error) {
            console.error('❌ Error al guardar en cache:', error);
            // Si hay error de espacio, limpiar cache y reintentar
            if (error instanceof Error && error.name === 'QuotaExceededError') {
                cleanupOldCache(true);
                try {
                    localStorage.setItem(key, JSON.stringify({
                        data,
                        timestamp: Date.now(),
                        key
                    }));
                } catch (retryError) {
                    console.error('❌ Error al guardar en cache después de limpieza:', retryError);
                }
            }
        }
    };

    // Limpiar cache antiguo
    const cleanupOldCache = (forceClean = false): void => {
        const cacheKeys = Object.keys(localStorage).filter(key => 
            key.startsWith(CACHE_KEY_PREFIX)
        );

        if (forceClean || cacheKeys.length >= MAX_CACHE_ENTRIES) {
            const cacheEntries: { key: string; timestamp: number }[] = [];

            cacheKeys.forEach(key => {
                try {
                    const cached = localStorage.getItem(key);
                    if (cached) {
                        const entry: CacheEntry = JSON.parse(cached);
                        cacheEntries.push({ key, timestamp: entry.timestamp });
                    }
                } catch (error) {
                    localStorage.removeItem(key);
                }
            });

            // Ordenar por timestamp y eliminar los más antiguos
            cacheEntries.sort((a, b) => a.timestamp - b.timestamp);
            const toDelete = forceClean ? cacheEntries : cacheEntries.slice(0, -MAX_CACHE_ENTRIES + 1);

            toDelete.forEach(entry => {
                localStorage.removeItem(entry.key);
                console.log('🗑️ Cache limpiado:', entry.key);
            });
        }
    };

    useEffect(() => {
        const cacheKey = generateCacheKey(latitude, longitude);
        
        // Intentar obtener datos del cache primero
        const cachedData = getFromCache(cacheKey);
        
        if (cachedData) {
            setData(cachedData);
            setError(null);
            setLoading(false);
            return;
        }

        // Si no hay cache válido, hacer petición a la API
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m&hourly=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m&timezone=America%2FChicago`;

        const fetchData = async () => {
            try {
                console.log('🌐 Fetching datos de la API...');
                const response = await fetch(url);

                if (!response.ok) {
                    throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
                }

                const result: OpenMeteoResponse = await response.json();
                
                // Guardar en cache
                saveToCache(cacheKey, result);
                
                setData(result);
                setError(null);

            } catch (err: any) {
                console.error('❌ Error en la petición:', err);
                
                // Estrategia de resiliencia: intentar usar cache expirado como fallback
                const fallbackData = getFallbackFromCache(cacheKey);
                
                if (fallbackData) {
                    console.log('🔄 Usando datos del cache como fallback');
                    setData(fallbackData);
                    setError('Usando datos anteriores (sin conexión)');
                } else {
                    if (err instanceof Error) {
                        setError(err.message);
                    } else {
                        setError("Ocurrió un error desconocido al obtener los datos.");
                    }
                }

            } finally {
                setLoading(false);
            }
        };

        fetchData();

    }, [latitude, longitude]);

    // Obtener datos del cache aunque estén expirados (para fallback)
    const getFallbackFromCache = (key: string): OpenMeteoResponse | null => {
        try {
            const cached = localStorage.getItem(key);
            if (!cached) return null;

            const cacheEntry: CacheEntry = JSON.parse(cached);
            return cacheEntry.data;
        } catch (error) {
            return null;
        }
    };

    return { data, loading, error };
}