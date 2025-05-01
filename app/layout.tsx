import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ChildProps } from "@/types";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Typing Test",
  themeColor: "#000000",
  description: "A typing test application to improve your typing speed and accuracy.",
  keywords: [
    "typing test",
    "typing speed",
    "typing accuracy",
    "typing practice",
    "typing game",
    "improve typing",
    "typing challenge",
    "learn to type",
    "typing skills",
    "keyboard typing",
    "typing exercises",
    "typing trainer",
    "typing practice online",
    "typing test app",
    "typing test game",
    "typing test free",
    "typing test for kids",
    "typing test for adults",
    "typing test for beginners",
    "typing test for advanced",
    "typing test for professionals",
    "typing test for students",
    "typing test for teachers",
    "typing test for everyone",
    "typing test for fun",
    "typing test for learning",
    "typing test for practice",
    "typing test for improvement",
    "typing test for speed",
    "typing test for accuracy",
    "typing test for skills",
    "typing test for training",
    "typing test for exercises",
    "typing test for challenges",
    "typing test for games",
    "typing test for competitions",
    "typing test for assessments",
    "typing test for evaluations",
    "typing test for quizzes",
    "typing test for tests",
    "typing test for exams",
    "typing test for certifications",
    "typing test for courses",
    "typing test for programs",
    "typing test for workshops",
    "typing test for seminars",
    "typing test for webinars",
    "typing test for tutorials",
    "typing test for lessons",
    "typing test for classes",
    "typing test for sessions",
    "typing test for activities",
    "typing test for exercises",
    "typing test for drills",
    "typing test for practices",
    "typing test for routines",
    "typing test for habits",
    "typing test for techniques",
    "typing test for methods",  
    "typing test for strategies",]
};  

export default function RootLayout({ children }: ChildProps) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
