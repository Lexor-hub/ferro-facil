import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';

interface MapboxMapProps {
  className?: string;
}

const MapboxMap: React.FC<MapboxMapProps> = ({ className = '' }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState('');
  const [showTokenInput, setShowTokenInput] = useState(true);

  // Coordenadas de Mairinque - SP
  const longitude = -47.1728;
  const latitude = -23.5439;

  const initializeMap = (token: string) => {
    if (!mapContainer.current || map.current) return;

    mapboxgl.accessToken = token;
    
    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [longitude, latitude],
        zoom: 15,
      });

      // Add navigation controls
      map.current.addControl(
        new mapboxgl.NavigationControl(),
        'top-right'
      );

      // Add marker for the company location
      new mapboxgl.Marker({ color: 'hsl(var(--primary))' })
        .setLngLat([longitude, latitude])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 })
            .setHTML('<div style="padding: 8px; text-align: center;"><strong>Grupo Soares</strong><br/>R. Prof. Armando Lino Antunes, 251<br/>Mairinque - SP</div>')
        )
        .addTo(map.current);

      setShowTokenInput(false);
    } catch (error) {
      console.error('Erro ao inicializar o mapa:', error);
    }
  };

  const handleTokenSubmit = () => {
    if (mapboxToken.trim()) {
      initializeMap(mapboxToken.trim());
    }
  };

  useEffect(() => {
    return () => {
      map.current?.remove();
    };
  }, []);

  if (showTokenInput) {
    return (
      <div className={`aspect-video bg-secondary rounded-xl flex flex-col items-center justify-center p-6 ${className}`}>
        <MapPin className="w-12 h-12 text-primary mb-4" />
        <div className="text-center mb-4">
          <h3 className="font-semibold text-foreground mb-2">Configurar Mapa</h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            Para exibir o mapa, insira seu token público do Mapbox. 
            Você pode obter um em <a href="https://mapbox.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">mapbox.com</a>
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full max-w-md">
          <Input
            type="text"
            placeholder="Cole seu token do Mapbox aqui"
            value={mapboxToken}
            onChange={(e) => setMapboxToken(e.target.value)}
            className="flex-1"
          />
          <Button onClick={handleTokenSubmit} disabled={!mapboxToken.trim()}>
            Carregar Mapa
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`aspect-video rounded-xl overflow-hidden ${className}`}>
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
};

export default MapboxMap;