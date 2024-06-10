

import React, { useState } from "react";
import OpenAi from "openai";
import { Button} from "@nextui-org/react";
import QuizCard from "./components/QuizCard";
import './styles.css'; // Correct import for the CSS file
const openai = new OpenAi({
  apiKey: import.meta.env.VITE_OPEN_API_KEY,
  dangerouslyAllowBrowser: true,
});

interface QuizQuestion {
  question: string;
  options: string[];
  correct_answer: number;
}

const QuizApp = () => {
  const [topic, setTopic] = useState("");
  const [quiz, setQuiz] = useState<QuizQuestion[]>([]);
  const [countCorrects, setCountCorrect] = useState(0);
  const [countIncorrect, setCountIncorrect] = useState(0);
  const [questionNumber, setQuestionNumber] = useState(0);
  const [loading, setLoading] = useState(false);

  const topics = [
    "Finance",
    "Financial Literacy",
    "Stocks",
    "Budget Planning",
    "Systematic Investment Plans (SIPs)",
    "Mutual Funds",
    "Personal Finance",
    "Investment Strategies",
    "Retirement Planning",
    "Credit Scores",
    "Debt Management",
    "Savings Accounts",
    "Emergency Funds",
    "Tax Planning",
    "Insurance",
    "Real Estate Investment",
    "Cryptocurrency",
    "Financial Goals Setting",
    "Wealth Management",
    "Estate Planning",
    "Inflation",
    "Interest Rates",
    "Financial Markets",
    "Risk Management",
    "Asset Allocation",
    "Financial Independence",
    "Stock Market Analysis",
    "Dividends",
    "Bonds",
    "Exchange-Traded Funds (ETFs)",
    "Corporate Finance",
    "Behavioral Finance",
    "Financial Statements",
    "Cash Flow Management",
    "Cost of Capital",
    "Capital Budgeting",
    "Derivatives",
    "Hedge Funds",
    "Private Equity",
    "Venture Capital",
    "Financial Regulations",
    "Macroeconomics",
    "Microeconomics",
    "International Finance",
    "Fintech",
    "Sustainable Investing",
    "Impact Investing",
    "Financial Fraud Awareness",
    "Economic Indicators",
    "Market Cycles",
    "Pension Plans",
    "Annuities"
  ];
  

  const generateQuiz = async () => {
    setQuiz([]);
    setCountCorrect(0);
    setLoading(true);
    try {
      const prompt = `Generate a JSON array of 10 multiple-choice questions with 4 options and 1 correct answer based on the following topic: ${topic} use this format 
        [
          {
            "question": "",
            "options": [
              "",
              "",
              "",
              ""
            ],
            "correct_answer": 0 // index of the correct answer option
          }
        ]
      `;

      const response = await openai.completions.create({
        model: "gpt-3.5-turbo-instruct",
        prompt,
        max_tokens: 2048,
        n: 1,
        stop: null,
        temperature: 0.7,
      });
      console.log(response);
      const data: QuizQuestion[] = JSON.parse(response.choices[0].text);
      setQuiz(data);
    } catch (error) {
      console.error("Error generating quiz:", error);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    generateQuiz();
  };

  const checkAnswer = (id: number, answer: number) => {
    // check
    if (quiz.length > 0 && quiz[id].correct_answer === answer) {
      setCountCorrect(countCorrects + 1);
    } else {
      setCountIncorrect(countIncorrect + 1);
    }
  };

  
  return (
    <div style={{backgroundImage: "url('path_to_your_image.jpg')"}}>
      <h1 className="text-3xl font-bold text-center mb-3 cursive">FinQuiz</h1>
      <h2 className="text-2xl text-center mb-4">Let's test you</h2>
      {quiz.length === 0 && (
        <form onSubmit={handleSubmit} className="px-10">
          <p className="mb-4 text-center">Choose your favorite topic from dropdown</p>
          <div className="flex justify-center items-center w-full">
            <select
              disabled={loading}
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              required
              className="mr-2 max-w-xl p-2 border rounded"
            >
              <option value="" disabled>Select a topic</option>
              {topics.map((topic) => (
                <option key={topic} value={topic}>
                  {topic}
                </option>
              ))}
            </select>
            <Button
              disabled={loading}
              isLoading={loading}
              isIconOnly
              color="primary"
              type="submit"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className={`${loading === true ? "invisible" : ""} w-6 h-6`}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m8.25 4.5 7.5 7.5-7.5 7.5"
                />
              </svg>
            </Button>
          </div>
          <p className="text-center mt-3">
            Built with ❤️ by{" "}
            
              AMEXLearn
        
          </p>
        </form>
      )}
      {quiz.length > 0 && (
        <p className="text-center mb-3 cursive">
          Total Questions: {quiz.length}, 
          <span className="correct-answer"> Correct Answers: {countCorrects},</span>
          <span className="incorrect-answer"> Incorrect Answers: {countIncorrect}</span>
        </p>
      )}
      <div className="flex flex-col items-center justify-center">
        {quiz.length > 0 && (
          <>
            <QuizCard
              question={quiz[questionNumber].question}
              correct_answer={quiz[questionNumber].correct_answer}
              id={questionNumber}
              options={quiz[questionNumber].options}
              checkAnswer={checkAnswer}
            />
            <div className={`${questionNumber === 9 ? "invisible" : ""} flex justify-end mt-5`}>
              <Button onClick={() => setQuestionNumber(questionNumber + 1)} className="bg-green-500 text-white cursive px-4 py-2 rounded-full">
                Next
              </Button>
            </div>
            {questionNumber === 9 && (
              <div className="mt-5">
                <Button onClick={() => document.location.reload()} className="bg-green-500 text-white cursive px-4 py-2 rounded-full">
                  Try Another
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}  
export default QuizApp;
