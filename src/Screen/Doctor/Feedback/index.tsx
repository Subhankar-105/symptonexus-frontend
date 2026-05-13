import { useState } from "react";
import { submitFeedback } from "../../../services/feedbackApi";
import { toast } from "react-hot-toast";
import { IoWarningOutline } from "react-icons/io5";

const DoctorFeedback: React.FC = () => {

  const [rating, setRating] =
    useState<number>(0);

  const [consultExperience, setConsultExperience] =
    useState("");

  const [platformEase, setPlatformEase] =
    useState("");

  const [suggestions, setSuggestions] =
    useState("");

  const [recommend, setRecommend] =
    useState<"yes" | "no">("yes");



  /* Star click */
  const handleStarClick =
    (star: number) => {

      setRating(
        prev =>
          prev === star ? 0 : star
      );

  };

const handleSubmit = async () => {
  if (!rating || !consultExperience) {
    toast("Please fill required fields", {
      icon: <IoWarningOutline className="text-amber-600 text-xl"/>,
      className: "border-2 border-amber-500 bg-yellow-50 text-yellow-800 font-medium",
    });
    return;
  }

  // Combine all text into ONE experience string
  const combinedExperience = `
Consultation: ${consultExperience}
Platform: ${platformEase}
Suggestions: ${suggestions}
Recommendation: ${recommend}
  `;

  try {
    await submitFeedback({
      rating: Number(rating),
      experience: combinedExperience,
    });

    toast.success("Feedback submitted successfully!");

    // Reset form
    setRating(0);
    setConsultExperience("");
    setPlatformEase("");
    setSuggestions("");
    setRecommend("yes");

  } catch (error) {
    console.error(error);
    toast.error("Error submitting feedback");
  }
};



  return (

    <div className="
      min-h-screen
      bg-blue-50
      p-6
    ">

      <div className="
        bg-white
        w-full
        rounded-xl
        shadow-lg
        p-6
      ">

        {/* Header */}

        <h2 className="
          text-xl
          font-semibold
          mb-1
        ">
          Doctor Feedback
        </h2>


        <p className="
          text-sm
          text-gray-500
          mb-6
        ">
          Share your experience using SymptoNexus
        </p>



        {/* Rating */}

        <p className="
          font-medium
          mb-2
        ">
          Overall Experience
        </p>


        <div className="
          flex gap-2 mb-6
        ">

          {[1,2,3,4,5].map(star => {

            const active =
              rating >= star;

            return (

              <button
                key={star}
                onClick={() =>
                  handleStarClick(star)
                }
                className={`
                  w-10 h-10
                  rounded-full
                  text-xl
                  transition
                  ${
                    active
                    ? "bg-yellow-400 text-white"
                    : "bg-gray-200 text-gray-400"
                  }
                `}
              >
                ★
              </button>

            );

          })}

        </div>



        {/* Consultation Experience */}

        <label className="
          text-sm font-medium
        ">
          Consultation Experience
        </label>


        <textarea
          value={consultExperience}
          onChange={(e) =>
            setConsultExperience(
              e.target.value
            )
          }
          className="
            w-full
            mt-1 mb-4
            p-3
            border
            rounded-lg
            focus:outline-none
            focus:ring-2
            focus:ring-blue-400
          "
          placeholder="
            How was your consultation experience?
          "
        />



        {/* Platform Ease */}

        <label className="
          text-sm font-medium
        ">
          Ease of Using Platform
        </label>


        <textarea
          value={platformEase}
          onChange={(e) =>
            setPlatformEase(
              e.target.value
            )
          }
          className="
            w-full
            mt-1 mb-4
            p-3
            border
            rounded-lg
            focus:outline-none
            focus:ring-2
            focus:ring-blue-400
          "
          placeholder="
            Was the platform easy to use?
          "
        />



        {/* Suggestions */}

        <label className="
          text-sm font-medium
        ">
          Suggestions
        </label>


        <textarea
          value={suggestions}
          onChange={(e) =>
            setSuggestions(
              e.target.value
            )
          }
          className="
            w-full
            mt-1 mb-6
            p-3
            border
            rounded-lg
            focus:outline-none
            focus:ring-2
            focus:ring-blue-400
          "
          placeholder="
            Share your suggestions for improvement
          "
        />



        {/* Recommendation */}

        <p className="
          font-medium mb-2
        ">
          Would you recommend SymptoNexus?
        </p>


        <div className="
          flex gap-6 mb-6
        ">

          <label className="
            flex items-center gap-2
          ">

            <input
              type="radio"
              checked={
                recommend === "yes"
              }
              onChange={() =>
                setRecommend("yes")
              }
            />

            Yes

          </label>


          <label className="
            flex items-center gap-2
          ">

            <input
              type="radio"
              checked={
                recommend === "no"
              }
              onChange={() =>
                setRecommend("no")
              }
            />

            No

          </label>

        </div>



        {/* Submit */}

        <button
          onClick={handleSubmit}
          className="
            w-full
            bg-blue-500
            hover:bg-blue-600
            text-white
            py-3
            rounded-lg
            font-medium
            transition
          "
        >
          Submit Feedback
        </button>

      </div>

    </div>

  );

};

export default DoctorFeedback;
