import { useState } from "react";
import { submitFeedback } from "../../../services/feedbackApi";
import { toast } from "react-hot-toast";
import { IoWarningOutline } from "react-icons/io5";

const features = [
  { id: "checker", label: "Symptom Checker", icon: "📋" },
  { id: "doctor", label: "Doctor Consultation", icon: "👨‍⚕️" },
  { id: "website", label: "Overall Website", icon: "💻" },
];

const Feedback: React.FC = () => {
  const [featuresUsed, setFeaturesUsed] = useState<string[]>([]);
  const [rating, setRating] = useState<number>(0);
  const [experience, setExperience] = useState<string>("");
  const [recommend, setRecommend] = useState<"yes" | "no">("yes");

  /* Toggle feature selection */
  const toggleFeature = (id: string) => {
    setFeaturesUsed((prev) =>
      prev.includes(id)
        ? prev.filter((f) => f !== id)
        : [...prev, id]
    );
  };

  /* Toggle star rating */
  const handleStarClick = (star: number) => {
    setRating((prev) => (prev === star ? 0 : star));
  };

  /* SUBMIT FUNCTION (CONNECTED TO BACKEND) */
  const handleSubmit = async () => {
    if (!rating || !experience) {
    toast("Please fill required fields", {
      icon: <IoWarningOutline className="text-amber-600 text-xl"/>,
      className: "border-2 border-amber-500 bg-yellow-50 text-yellow-800 font-medium",
    });
      return;
    }

    try {
      await submitFeedback({
        rating: Number(rating),
        experience,
      });

      alert("Feedback submitted successfully!");

      // Reset form
      setRating(0);
      setExperience("");
      setFeaturesUsed([]);
      setRecommend("yes");

    } catch (error) {
      console.error(error);
      alert("Error submitting feedback");
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 p-6">
      <div className="bg-white w-full rounded-xl shadow-lg p-6">
        {/* Header */}
        <h2 className="text-xl font-semibold mb-1"> Feedback</h2>
        <p className="text-sm text-gray-500 mb-6">
          Help us improve SymptoNexus.
        </p>

        {/* Feature Selection */}
        <p className="font-medium mb-3">Which feature did you use?</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {features.map((item) => {
            const selected = featuresUsed.includes(item.id);
            return (
              <button
                key={item.id}
                onClick={() => toggleFeature(item.id)}
                className={`border rounded-lg p-4 flex flex-col items-center gap-1 transition
                  ${
                    selected
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
              >
                <span className="text-2xl">{item.icon}</span>
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Star Rating */}
        <p className="font-medium mb-2">How was your experience?</p>
        <div className="flex gap-2 mb-6">
          {[1, 2, 3, 4, 5].map((star) => {
            const active = rating >= star;
            return (
              <button
                key={star}
                onClick={() => handleStarClick(star)}
                className={`w-10 h-10 rounded-full flex items-center justify-center text-xl transition
                  ${
                    active
                      ? "bg-yellow-400 text-white"
                      : "bg-gray-200 text-gray-400"
                  }`}
              >
                ★
              </button>
            );
          })}
        </div>

        {/* Experience (CONNECTED) */}
        <label className="text-sm font-medium">
          How was your experience with our website?
        </label>
        <textarea
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
          className="w-full mt-1 mb-4 p-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Tell us about usability, speed, or design."
        />

        {/* Other fields (UI only for now) */}
        <label className="text-sm font-medium">What went well?</label>
        <textarea
          className="w-full mt-1 mb-4 p-3 border rounded-lg text-sm"
          placeholder="I'd love to hear about what you found helpful or enjoyed."
        />

        <label className="text-sm font-medium">What could be improved?</label>
        <textarea
          className="w-full mt-1 mb-6 p-3 border rounded-lg text-sm"
          placeholder="Please let us know what we could do better."
        />

        {/* Recommendation */}
        <p className="font-medium mb-2">
          Would you recommend SymptoNexus?
        </p>
        <div className="flex gap-6 mb-6">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              checked={recommend === "yes"}
              onChange={() => setRecommend("yes")}
            />
            Yes
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              checked={recommend === "no"}
              onChange={() => setRecommend("no")}
            />
            No
          </label>
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-medium transition"
        >
          Submit Feedback
        </button>
      </div>
    </div>
  );
};

export default Feedback;