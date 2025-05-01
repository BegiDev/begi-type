'use client';

import { useEffect, useRef, useState, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { staticWords } from "@/lib/getWords";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const getRandomWords = (timeLimit: number) => {
  const wordCount = timeLimit === 15 ? 20 : timeLimit === 30 ? 25 : timeLimit === 60 ? 35 : 50;
  const shuffledWords = [...staticWords].sort(() => 0.5 - Math.random());
  return shuffledWords.slice(0, wordCount);
};

export default function TypingBox() {
  const [words, setWords] = useState<string[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [input, setInput] = useState("");
  const [startTime, setStartTime] = useState<number | null>(null);
  const [wpm, setWpm] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(15);
  const [initialTime, setInitialTime] = useState<number>(15);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
  const [isInputDisabled, setIsInputDisabled] = useState<boolean>(false);
  const [correctWords, setCorrectWords] = useState<number>(0);
  const [incorrectWords, setIncorrectWords] = useState<number>(0);
  const [totalWords, setTotalWords] = useState<number>(0);
  const [wpmHistory, setWpmHistory] = useState<number[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const inputRef = useRef<HTMLInputElement>(null);  
  const dingRef = useRef<HTMLAudioElement>(null);
  const buzzRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    setWords(getRandomWords(15));
    setTimeLeft(15);
  }, []);

  const endGame = useCallback(() => {
    if (timer) clearInterval(timer);
    setIsInputDisabled(true);
    setIsRunning(false);
    const duration = (Date.now() - startTime!) / 1000 / 60;
    const calculatedWpm = Math.round(currentWordIndex / duration);
    setWpm(calculatedWpm);
    setWpmHistory((prev) => [...prev, calculatedWpm]);
  }, [currentWordIndex, startTime, timer, setIsInputDisabled, setIsRunning, setWpm, setWpmHistory]);

  useEffect(() => {
    if (timeLeft === 0) {
      endGame();
    }
  }, [timeLeft, endGame]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isInputDisabled) return;

    const value = e.target.value;

    if (!startTime && !isRunning && value.trim() !== "") {
      setStartTime(Date.now());
      setIsRunning(true);
      startTimer();
    }

    setInput(value);

    if (value.endsWith(" ")) {
      if (value.trim() === words[currentWordIndex]) {
        setCurrentWordIndex((prev) => prev + 1);
        setCorrectWords((prev) => prev + 1);
        if (soundEnabled) dingRef.current?.play();
      } else {
        setIncorrectWords((prev) => prev + 1);
        if (soundEnabled) buzzRef.current?.play();
      }
      setInput("");
    }
  };

  const startTimer = () => {
    const interval = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);
    setTimer(interval);
  };

  const restart = (time = initialTime) => {
    setWords(getRandomWords(time));
    setCurrentWordIndex(0);
    setInput("");
    setStartTime(null);
    setWpm(null);
    setTimeLeft(time);
    setIsRunning(false);
    setIsInputDisabled(false);
    setCorrectWords(0);
    setIncorrectWords(0);
    setTotalWords(0);
    if (timer) clearInterval(timer);
    setTimer(null);
    inputRef.current?.focus();
  };

  const handleTimeChange = (value: string) => {
    const newTime = parseInt(value, 10);
    setInitialTime(newTime);
    restart(newTime);
  };

  const handleRestart = () => restart();


  const chartData = {
    labels: Array.from({ length: wpmHistory.length }, (_, i) => i + 1),
    datasets: [
      {
        label: 'Words Per Minute',
        data: wpmHistory,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
        fill: false,
      },
    ],
  };

  return (
    <Card className="p-6 md:max-w-6xl mx-auto mt-10 bg-white shadow-xl rounded-lg">
      <audio ref={dingRef} src="/sounds/ding.mp3" />
      <audio ref={buzzRef} src="/sounds/buzz.mp3" />

      <div className="mb-4 block md:flex items-center justify-between flex-wrap">
        <Select defaultValue={String(initialTime)} onValueChange={handleTimeChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select time" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="15">15 sec</SelectItem>
            <SelectItem value="30">30 sec</SelectItem>
            <SelectItem value="60">60 sec</SelectItem>
            <SelectItem value="100">100 sec</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="w-full md:mt-0 mt-2 sm:w-auto"
        >
          {soundEnabled ? "🔊 Sound: On" : "🔇 Sound: Off"}
        </Button>
      </div>

      <div className="flex flex-wrap justify-center gap-2 mb-4 text-xl font-semibold">
        {words.map((word, i) => (
          <span
            key={i}
            className={`${
              i === currentWordIndex
                ? "underline text-primary"
                : i < currentWordIndex
                ? "text-green-500"
                : "text-gray-600"
            }`}
          >
            {word}
          </span>
        ))}
      </div>

      <input
        ref={inputRef}
        value={input}
        onChange={handleChange}
        className="border-2 border-gray-300 rounded-md w-full px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-primary"
        placeholder="Start typing..."
        disabled={isInputDisabled}
      />

      {timeLeft > 0 && (
        <div className="text-xl font-bold">Time Left: {timeLeft}s</div>
      )}

      {timeLeft <= 0 && wpm !== null && (
        <div className="text-xl font-bold mt-4">Your WPM: {wpm}</div>
      )}

      <Button onClick={handleRestart} className="mt-4 bg-primary hover:bg-primary/80 text-white w-full sm:w-auto">
        Restart
      </Button>

      {timeLeft === 0 && wpm !== null && (
        <div className="mt-6">
          <div className="p-4 rounded-md mb-6 flex items-center justify-between">
            <h3 className="text-xl font-bold">Your Performance</h3>
            <p className="underline">Correct Words: {correctWords}</p>
            <p className="underline">Incorrect Words: {incorrectWords}</p>
            <p className="underline">Total Words Typed: {correctWords + incorrectWords}</p>
            <p className="underline">Words Per Minute: {wpm}</p>
          </div>
          <div className="mt-6">
            <h3 className="text-xl font-bold mb-4">WPM History</h3>
            <div className="bg-white shadow-lg rounded-lg p-6">
              <Line data={chartData} />
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
