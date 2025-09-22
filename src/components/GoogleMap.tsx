import React, { useEffect, useRef } from 'react';
import { MapPin } from 'lucide-react';

interface LeafletMapProps {
  className?: string;
}

const LeafletMap: React.FC<LeafletMapProps> = ({ className = '' }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  
  // Coordenadas de Mairinque - SP (mesmas do MapboxMap)
  const longitude = -47.1728;
  const latitude = -23.5439;

  useEffect(() => {
    // Função para carregar o mapa usando Google Maps
    const loadMap = () => {
      if (!mapRef.current) return;
      
      // Criar um iframe com o Google Maps
      const iframe = document.createElement('iframe');
      iframe.style.border = 'none';
      iframe.style.width = '100%';
      iframe.style.height = '100%';
      iframe.style.borderRadius = 'inherit';
      
      // URL do Google Maps com as coordenadas da empresa
      iframe.src = `https://maps.google.com/maps?q=${latitude},${longitude}&z=15&output=embed`;
      
      // Limpar o container e adicionar o iframe
      if (mapRef.current.firstChild) {
        mapRef.current.removeChild(mapRef.current.firstChild);
      }
      mapRef.current.appendChild(iframe);
    };
    
    loadMap();
    
    return () => {
      // Limpeza ao desmontar o componente
      if (mapRef.current && mapRef.current.firstChild) {
        mapRef.current.removeChild(mapRef.current.firstChild);
      }
    };
  }, []);

  return (
    <div className={`aspect-video rounded-xl overflow-hidden ${className}`}>
      <div ref={mapRef} className="w-full h-full" />
    </div>
  );
};

export default LeafletMap;