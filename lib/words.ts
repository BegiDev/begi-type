export const getWords = (count = 30): string[] => {
    const wordList = ["apple", "orange", "cat", "hello", "next", "monkey", "keyboard", "fast", "react", "type"];
    return Array.from({ length: count }, () => wordList[Math.floor(Math.random() * wordList.length)]);
  };
  