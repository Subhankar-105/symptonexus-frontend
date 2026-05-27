import { useState } from "react";
import axios from "axios";

type AIResponse = {
  type: string;
  possible_conditions: string;
  specialization: string;
  advice: {
    tip1: string;
    tip2: string;
  };
};

const SymptoChecker = () => {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AIResponse | null>(null);

  const handleSubmit = async () => {
    if (!input.trim()) return;

    try {
      setLoading(true);

      const res = await axios.post("http://localhost:4000/api/ai/chat", {
        message: input
      });

      console.log("FULL RESPONSE:", res.data);

      // ✅ FIXED DATA ACCESS
      setResult(res.data.data);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gradient-to-r from-slate-300 via-cyan-100 to-slate-300">

      <h2 className="text-3xl font-bold mb-6 text-cyan-700">
        SymptoChecker AI
      </h2>

      {/* INPUT BOX */}
      <div className="flex gap-3 mb-6">
        <input
          type="text"
          placeholder="Enter symptoms"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 px-4 py-2 border rounded-xl"
        />

        <button
          onClick={handleSubmit}
          className="px-6 py-2 bg-cyan-600 text-white rounded-xl"
        >
          Check
        </button>
      </div>

      {/* LOADING */}
      {loading && <p>Analyzing symptoms...</p>}

      {/* RESULT */}
      {result && result.type === "result" && (
        <div className="bg-white p-6 rounded-xl shadow-md">

          <h3 className="text-xl font-semibold mb-4 text-green-700">
            Possible Condition:
          </h3>
          <p className="mb-4">{result.possible_conditions}</p>

          <h3 className="text-xl font-semibold mb-4 text-blue-700">
            Recommended Doctor:
          </h3>
          <p className="mb-4 capitalize">{result.specialization}</p>

          <h3 className="text-xl font-semibold mb-4 text-orange-700">
            Advice:
          </h3>

          <ul className="list-disc pl-5">
            <li>{result.advice?.tip1}</li>
            <li>{result.advice?.tip2}</li>
          </ul>
        </div>
      )}

    </div>
  );
};

export default SymptoChecker;