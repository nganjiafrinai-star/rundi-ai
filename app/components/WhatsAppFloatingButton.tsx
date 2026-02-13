"use client";

import React from "react";
import { MessageCircle } from "lucide-react";

const WhatsAppFloatingButton = () => {
  return (
    <a
      href="https://wa.me/25767903000"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Open WhatsApp chat"
      className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-green-500 text-white shadow-lg hover:bg-green-600 transition"
    >
      <MessageCircle size={24} />
    </a>
  );
};

export default WhatsAppFloatingButton;

