import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Bot = () => {
  const [isListening, setIsListening] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const speak = (text, callback) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";

      // When speaking ends, trigger callback
      utterance.onend = () => {
        if (callback) callback();
      };

      window.speechSynthesis.speak(utterance);
    } else {
      console.error("Speech synthesis is not supported in this browser.");
    }
  };

  const startListening = () => {
    const greeting = "Hi Scientist, Where do you want to navigate?";
    setMessage(greeting);
    setIsListening(false); // Ensure it's not listening while speaking

    // Speak the greeting, then start listening
    speak(greeting, () => {
      setIsListening(true);

      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;

      if (!SpeechRecognition) {
        const errorMsg = "Voice recognition is not supported in this browser.";
        setMessage(errorMsg);
        speak(errorMsg); // Speak the error message
        return;
      }

      const recognition = new SpeechRecognition();
      recognition.lang = "en-US";

      recognition.start();

      // Stop listening after 5 seconds
      setTimeout(() => {
        recognition.stop();
      }, 5000);

      // When speech is recognized
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        const feedback = `You said: "${transcript}"`;
        setMessage(feedback);
        speak(feedback); // Speak the recognized input

        // Navigate based on voice input
        if (transcript.includes("dashboard")) {
          speak("Navigating to Dashboard", () => navigate("/scientist/home"));
        } else if (transcript.includes("infographics")) {
          speak("Navigating to Infographics", () => navigate("/graphs"));
        } else if (transcript.includes("filter")) {
            speak("Navigating to Filter Page", () => navigate("/filter"));
        } else if (transcript.includes("dataset")) {
            speak("Navigating to Dataset Page", () => navigate("/scientist/datasets"));
        } else if (transcript.includes("datasets")) {
            speak("Navigating to Trends Page", () => navigate("/ScientistCharts"));
        } else if (transcript.includes("trends")) {
          speak("Navigating to Community Page", () => navigate("/scientist/community"));
        } else {
          const errorMsg = "Sorry, I did not understand. Please try again.";
          setMessage(errorMsg);
          speak(errorMsg); // Speak the error feedback
        }
      };

      // Handle errors
      recognition.onerror = () => {
        const errorMsg =
          "There was an error recognizing your speech. Please try again.";
        setMessage(errorMsg);
        speak(errorMsg); // Speak the error message
      };

      // Stop listening when recognition ends
      recognition.onend = () => {
        setIsListening(false);
      };
    });
  };

  return (
    <div>
      {/* Floating Bot Button */}
      <button
        className={`fixed bottom-4 right-4 ${
          isListening ? "bg-red-500 animate-pulse" : "bg-blue-500"
        } text-white p-4 rounded-full shadow-lg hover:bg-blue-600 transition z-50`}
        onClick={startListening}
      >
        {isListening ? "Listening..." : "Bot"}
      </button>

      {/* Message Display */}
      {message && (
        <div
          className="fixed bottom-20 right-4 bg-white p-4 rounded-lg shadow-lg w-64 border border-gray-200"
          style={{ zIndex: 40 }}
        >
          <p className="text-sm font-semibold text-gray-800 text-center">
            {message}
          </p>
        </div>
      )}
    </div>
  );
};

export default Bot;
