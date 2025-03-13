import { useState } from 'react';
import { FaAngleDown } from 'react-icons/fa6';

const FAQItem = ({ question, answer, isOpen, onClick }) => {
  return (
    <div className="mb-4">
      <button
        className="w-full text-left py-2 px-4 flex justify-between items-center cursor-pointer rounded-lg bg-transparent focus:outline-none"
        onClick={onClick}
        aria-expanded={isOpen}
      >
        <span className="text-lg font-medium text-[#51282b]">{question}</span>
        <span className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
          <FaAngleDown size={24} className={`${isOpen?"bg-[#51282b] text-[#fdb716]":"text-[#51282b] bg-white"} rounded-full p-1`} />
        </span>
      </button>
      
      <div 
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="text-2xl px-4 py-3 text-[#51282b]">
          <p>{answer}</p>
        </div>
      </div>
      
       <div className="border-b border-[#51282b] mt-4"></div>
    </div>
  );
};

const FAQSection = () => {
  const [openItems, setOpenItems] = useState({});
  
  const faqData = [
    {
      question: "Are HIPPEAS® Non-GMO Project verified?",
      answer: "Yes! All of HIPPEAS Snacks are Non-GMO Project verified. Learn more at nongmoproject.org!"
    },
    {
      question: "Are HIPPEAS® Glyphosate free?",
      answer: "At Hippeas, our farmers do not use glyphosate during planting, growing, or harvest. It is possible for trace amounts of glyphosate to migrate from neighboring soil plots or in an airborne manner from neighboring fields."
    },
    {
      question: "Are HIPPEAS® baked?",
      answer: "HIPPEAS Puffs are baked. HIPPEAS Tortilla Chips & Veggie Straws are fried."
    },
    {
      question: "Are HIPPEAS® Tortilla Chips made with Whole Grain corn?",
      answer: "Yes! We use Whole Grain Yellow and Whole Grain White Corn Flour in our Tortilla Chips."
    }
  ];
  
  const handleToggle = (index) => {
    setOpenItems(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };
  
  return (
    <div className="w-full max-w-4xl mx-auto py-16 px-4">
      <div className="text-center mb-8">
        <h2 style={{fontFamily:"City Tour"}} className="text-6xl font-medium text-[#51282b]">FAQS</h2>
        <p className="text-2xl text-[#51282b] mt-2">We've got answers.</p>
      </div>
      
      <div className="bg-[#fdb716] rounded-3xl p-8">
        {faqData.map((faq, index) => (
          <FAQItem
            key={index}
            question={faq.question}
            answer={faq.answer}
            isOpen={!!openItems[index]}
            onClick={() => handleToggle(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default FAQSection;