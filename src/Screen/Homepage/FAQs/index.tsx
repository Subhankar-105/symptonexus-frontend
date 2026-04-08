import { useState } from "react";
import { faqData } from "../../../Environment";
import { useNavigate } from "react-router-dom";

const FAQ: React.FC = () => {
    const navigate = useNavigate();


    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const handleClick = () => {
        navigate("/contact")
    }
    const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
    };

  return (
    <div className="max-w-screen bg-cyan-100 dark:bg-cyan-950 ">
    <div className="  max-w-3xl bg-cyan-100 dark:bg-cyan-950 mx-auto p-6">
      <h2 className="inline-block bg-linear-to-r from-cyan-800 via-cyan-700 to-cyan-800 bg-clip-text text-transparent dark:from-gray-300 dark:via-gray-400 dark:to-gray-300 text-4xl font-bold mb-6 pb-2">Frequently Asked Questions</h2>

      <div className="space-y-4">
        {faqData.map((item, index) => (
          <div
            key={index}
            className=" border-1 border-cyan-300 dark:border-cyan-950 rounded-lg bg-linear-to-r from-cyan-200 via-cyan-50 to-cyan-200 dark:from-cyan-900 dark:via-sky-900 dark:to-cyan-900 cursor-pointer"
            onClick={() => toggleFAQ(index)}
          >
            {/* Question */}
            <div className="flex justify-between items-center px-4 py-3">
              <p className="text-black dark:text-gray-100 text-lg font-medium">{item.question}</p>
              <span className="text-2xl font-bold text-black dark:text-gray-100">
                {openIndex === index ? "−" : "+"}
              </span>
            </div>

            {/* Answer */}
            {openIndex === index && (
              <div className="px-4 pb-4 text-gray-700 dark:text-gray-300">
                {item.answer}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="w-full bg-cyan-100 mt-10 dark:bg-cyan-950 py-20 flex justify-center rounded-lg ">
      <div className="text-center max-w-2xl rounded-lg px-4">
        {/* Heading */}
        <h2 className="text-3xl md:text-4xl font-semibold bg-linear-to-r from-cyan-900 via-cyan-700 to-cyan-800 bg-clip-text text-transparent dark:from-gray-300 dark:via-gray-400 dark:to-gray-300 mb-4">
          Need more help?
        </h2>

        {/* Subtitle */}
        <p className="text-gray-600 dark:text-gray-300 text-lg mb-8">
          Send us a message with more details about your specific needs.
        </p>

        {/* Button */}
        <button 
            onClick={() => handleClick()}
            className="bg-linear-to-r from-cyan-700 to-cyan-500 dark:from-cyan-800 dark:to-cyan-600 hover:from-cyan-950 hover:to-cyan-700 dark:hover:from-cyan-700 dark:hover:to-cyan-500 text-white dark:text-gray-200 px-8 py-3 rounded-lg font-semibold shadow-md hover:shadow-lg transition">
          SUBMIT A REQUEST
        </button>
      </div>
    </div>
    </div>
    </div>
  );
};

export default FAQ;