// WhatsApp integration utilities for Grupo Soares

export const WHATSAPP_NUMBER = "5511999887766"; // Replace with actual number

interface WhatsAppMessage {
  page?: string;
  item?: string;
  service?: string;
  context?: string;
}

export function openWhatsApp(message: WhatsAppMessage = {}) {
  const baseMessage = "Olá! Gostaria de mais informações";
  
  let contextMessage = baseMessage;
  
  if (message.item) {
    contextMessage = `Olá! Gostaria de solicitar orçamento para: ${message.item}`;
  } else if (message.service) {
    contextMessage = `Olá! Gostaria de agendar o serviço: ${message.service}`;
  } else if (message.context) {
    contextMessage = `Olá! ${message.context}`;
  } else if (message.page) {
    contextMessage = `${baseMessage} sobre ${message.page}`;
  }
  
  const encodedMessage = encodeURIComponent(contextMessage);
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
  
  window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
}

export function formatWhatsAppLink(message: WhatsAppMessage = {}) {
  const baseMessage = "Olá! Gostaria de mais informações";
  
  let contextMessage = baseMessage;
  
  if (message.item) {
    contextMessage = `Olá! Gostaria de solicitar orçamento para: ${message.item}`;
  } else if (message.service) {
    contextMessage = `Olá! Gostaria de agendar o serviço: ${message.service}`;
  } else if (message.context) {
    contextMessage = `Olá! ${message.context}`;
  } else if (message.page) {
    contextMessage = `${baseMessage} sobre ${message.page}`;
  }
  
  const encodedMessage = encodeURIComponent(contextMessage);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
}