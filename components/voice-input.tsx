"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Mic, MicOff, Loader2, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  onListeningChange?: (listening: boolean) => void;
  language?: string;
  className?: string;
}

export function VoiceInput({
  onTranscript,
  onListeningChange,
  language = "ar-SA",
  className,
}: VoiceInputProps) {
  const [listening, setListening] = useState(false);
  const [supported, setSupported] = useState(false);
  const [interim, setInterim] = useState("");
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Check for browser support
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      setSupported(true);
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = language;

      recognitionRef.current.onresult = (event) => {
        let finalTranscript = "";
        let interimTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        setInterim(interimTranscript);

        if (finalTranscript) {
          onTranscript(finalTranscript);
          setInterim("");
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        if (event.error === "not-allowed") {
          toast.error("يرجى السماح بالوصول للميكروفون");
        }
        setListening(false);
      };

      recognitionRef.current.onend = () => {
        setListening(false);
        onListeningChange?.(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [language, onTranscript, onListeningChange]);

  const toggleListening = useCallback(() => {
    if (!recognitionRef.current) return;

    if (listening) {
      recognitionRef.current.stop();
      setListening(false);
      onListeningChange?.(false);
    } else {
      try {
        recognitionRef.current.start();
        setListening(true);
        onListeningChange?.(true);
      } catch (error) {
        console.error("Failed to start recognition:", error);
        toast.error("فشل تشغيل التسجيل الصوتي");
      }
    }
  }, [listening, onListeningChange]);

  if (!supported) {
    return null;
  }

  return (
    <div className={cn("relative", className)}>
      <Button
        className={cn(
          "relative",
          listening && "bg-red-500 hover:bg-red-600 animate-pulse"
        )}
        onClick={toggleListening}
        size="icon"
        type="button"
        variant={listening ? "default" : "ghost"}
      >
        {listening ? (
          <MicOff className="h-5 w-5" />
        ) : (
          <Mic className="h-5 w-5" />
        )}
      </Button>

      {/* Interim transcript preview */}
      {interim && (
        <div className="absolute bottom-full mb-2 left-0 right-0 p-2 rounded-lg bg-muted text-sm max-w-xs">
          {interim}
        </div>
      )}
    </div>
  );
}

// Text-to-Speech output
interface VoiceOutputProps {
  text: string;
  autoPlay?: boolean;
  language?: string;
}

export function VoiceOutput({
  text,
  autoPlay = false,
  language = "ar-SA",
}: VoiceOutputProps) {
  const [speaking, setSpeaking] = useState(false);
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    setSupported("speechSynthesis" in window);
  }, []);

  useEffect(() => {
    if (autoPlay && text && supported) {
      speak();
    }
  }, [text, autoPlay, supported]);

  const speak = () => {
    if (!supported || !text) return;

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language;
    utterance.rate = 0.9;
    utterance.pitch = 1;

    // Try to find an Arabic voice
    const voices = window.speechSynthesis.getVoices();
    const arabicVoice = voices.find(
      (v) => v.lang.startsWith("ar") || v.name.includes("Arabic")
    );
    if (arabicVoice) {
      utterance.voice = arabicVoice;
    }

    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const stop = () => {
    window.speechSynthesis.cancel();
    setSpeaking(false);
  };

  if (!supported) return null;

  return (
    <Button
      className={cn(speaking && "text-primary")}
      onClick={speaking ? stop : speak}
      size="icon"
      title={speaking ? "إيقاف القراءة" : "قراءة النص"}
      variant="ghost"
    >
      {speaking ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Volume2 className="h-4 w-4" />
      )}
    </Button>
  );
}

// Hook for voice input
export function useVoiceInput(
  onTranscript: (text: string) => void,
  language = "ar-SA"
) {
  const [listening, setListening] = useState(false);
  const [supported, setSupported] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      setSupported(true);
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = language;

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        onTranscript(transcript);
      };

      recognitionRef.current.onend = () => setListening(false);
    }
  }, [language, onTranscript]);

  const start = () => {
    if (recognitionRef.current && !listening) {
      recognitionRef.current.start();
      setListening(true);
    }
  };

  const stop = () => {
    if (recognitionRef.current && listening) {
      recognitionRef.current.stop();
      setListening(false);
    }
  };

  return { listening, supported, start, stop };
}

