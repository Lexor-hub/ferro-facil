import { MessageCircle } from "lucide-react";
import { openWhatsApp } from "@/lib/whatsapp";

export default function WhatsAppFloat() {
  return (
    <button
      onClick={() => openWhatsApp({ context: "Gostaria de falar com um especialista" })}
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center shadow-float transition-all duration-300 hover:scale-110 focus-ring"
      aria-label="Falar no WhatsApp"
    >
      <MessageCircle className="w-7 h-7" />
    </button>
  );
}