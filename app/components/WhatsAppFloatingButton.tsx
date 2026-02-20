"use client";

import React, { useState, useEffect } from "react";
import { MessageCircle } from "lucide-react";

const WhatsAppFloatingButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const updateButtonVisibility = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      
      // Show button when user is near bottom (within 250px of end)
      const nearBottom = windowHeight + scrollTop >= documentHeight - 250;
      setIsVisible(nearBottom);
    };

    const handleScroll = () => {
      requestAnimationFrame(updateButtonVisibility);
    };

    // Initial check
    updateButtonVisibility();

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', updateButtonVisibility, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', updateButtonVisibility);
    };
  }, []);

  return (
    <div 
      className="fixed bottom-0 right-0 p-6 pointer-events-none z-50"
      style={{
        transition: 'opacity 0.3s ease-out, transform 0.3s ease-out',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(10px)',
        pointerEvents: isVisible ? 'auto' : 'none'
      }}
    >
      <a
        href="https://wa.me/25767903000"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Open WhatsApp chat"
        className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500 text-white shadow-lg hover:bg-green-600 transition-all duration-200"
        style={{
          animation: isVisible ? 'gentleBounce 1.4s ease-in-out infinite' : 'none'
        }}
      >
        <MessageCircle size={24} />
      </a>
      
      <style jsx>{`
        @keyframes gentleBounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
      `}</style>
    </div>
  );
};

export default WhatsAppFloatingButton;

