"use client";

import { useState } from "react";
import jsPDF from "jspdf";

export default function OMRPage() {
  // Input Count
  const [inputCount, setInputCount] = useState("");

  // Final Question Count
  const [questionCount, setQuestionCount] = useState(0);

  // Answers State
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});

  // Generate Questions
  const questions = Array.from(
    { length: questionCount },
    (_, index) => ({
      id: index + 1,
      options: ["A", "B", "C", "D"],
    })
  );

  // Generate Questions Button
  const generateQuestions = () => {
    const total = Number(inputCount);

    if (!total || total <= 0) {
      alert("Enter valid question count");
      return;
    }

    setQuestionCount(total);
    setAnswers({});
  };

  // Select Answer
  const handleSelect = (questionId: number, option: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: option,
    }));
  };

  // PDF Download
  const handleSubmit = () => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(20);
    doc.text("OMR Answers Report", 65, 20);

    doc.setFontSize(12);
    doc.text(`Total Questions: ${questionCount}`, 20, 35);

    // Column Positions
    const columns = [20, 70, 120, 170];

    let y = 50;

    questions.forEach((q, index) => {
      const answer = answers[q.id] || "-";

      // Column
      const col = index % 4;

      // X Position
      const x = columns[col];

      // Text
      doc.text(`${q.id}: ${answer}`, x, y);

      // Next Row
      if (col === 3) {
        y += 10;
      }

      // New Page
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
    });

    // Save PDF
    doc.save(`omr-${questionCount}-questions.pdf`);
  };

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-lg p-8">

        {/* Title */}
        <h1 className="text-4xl font-bold text-center mb-10">
          OMR Sheet Application
        </h1>

        {/* Question Input */}
        <div className="flex flex-wrap gap-4 items-center mb-10">

          <input
            type="number"
            placeholder="Enter Question Count"
            value={inputCount}
            onChange={(e) => setInputCount(e.target.value)}
            className="border-2 border-black rounded-xl px-4 py-3 w-64 outline-none"
          />

          <button
            onClick={generateQuestions}
            className="bg-black text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-800 transition"
          >
            Generate Questions
          </button>

        </div>

        {/* Questions */}
        {questionCount > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">

              {questions.map((q) => (
                <div
                  key={q.id}
                  className="border rounded-xl p-4 bg-gray-50"
                >
                  {/* Question Number */}
                  <h2 className="font-bold mb-4 text-lg">
                    {q.id}.
                  </h2>

                  {/* Options */}
                  <div className="flex gap-3 flex-wrap">

                    {q.options.map((opt) => {
                      const selected = answers[q.id] === opt;

                      return (
                        <button
                          key={opt}
                          onClick={() =>
                            handleSelect(q.id, opt)
                          }
                          className={`w-12 h-12 rounded-full border-2 text-sm font-bold transition-all duration-200
                            ${
                              selected
                                ? "bg-black text-white border-black scale-110"
                                : "bg-white border-gray-300 hover:border-black"
                            }
                          `}
                        >
                          {opt}
                        </button>
                      );
                    })}

                  </div>
                </div>
              ))}

            </div>

            {/* Submit */}
            <button
              onClick={handleSubmit}
              className="w-full mt-10 bg-black text-white py-4 rounded-xl text-lg font-semibold hover:bg-gray-800 transition"
            >
              Submit & Download PDF
            </button>
          </>
        )}
      </div>
    </main>
  );
}