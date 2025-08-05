import { useState } from 'react';
import { useInvoice } from '../contexts/InvoiceContext';

const FAQSection = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const {displayContactUsModal, setDisplayContactUsModal} = useInvoice()

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };



  const handleDisplayContactModal = ()=> {
    setDisplayContactUsModal(true)
  }

  const faqs = [
  {
    question: "Is ClaukkInvoice really free to use?",
    answer: "Yes! ClaukkInvoice is 100% free to use. You can create unlimited invoices, manage your clients, and access your dashboard without paying a dime. We rely on donations from our amazing users to keep the platform running."
  },
  {
    question: "Why is it free? What's the catch?",
    answer: "There’s no catch. Our goal is to support freelancers, small businesses, and startups by providing a reliable invoicing tool for free. If you find value in it, you can choose to donate and help us keep it that way."
  },
  {
    question: "Can I donate to support ClaukkInvoice?",
    answer: "Absolutely! We encourage users who love the platform to support us with any amount they’re comfortable with. Your donation helps cover server costs and future improvements. You can donate anytime via the 'Fuel The Mission' button in the app."
  },
  {
    question: "Will ClaukkInvoice stay free forever?",
    answer: "We hope so! As long as we receive enough community support to cover operating costs, we’ll keep the app free. If things change in the future, we’ll be transparent and notify all users well in advance."
  },
  {
    question: "Will there be a mobile app?",
    answer: "Yes! A mobile version of ClaukkInvoice is currently in development. It will make managing invoices on the go easier and more efficient for everyone."
  },
  {
    question: "How secure is my invoicing data?",
    answer: "Very secure. We use industry-standard encryption and cloud backups to protect your data. Your information is private and never shared with third parties."
  }
];


  return (
    <section className="faq-section py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Frequently Asked Questions (FAQs)</h2>
        
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className="border border-gray-200 rounded-lg overflow-hidden transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <button
                className={`w-full px-6 py-4 text-left flex justify-between items-center ${activeIndex === index ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                onClick={() => toggleFAQ(index)}
                aria-expanded={activeIndex === index}
                aria-controls={`faq-content-${index}`}
              >
                <span className="font-medium text-gray-800 text-lg">{faq.question}</span>
                <svg
                  className={`w-5 h-5 text-purple-600 transition-transform duration-200 ${activeIndex === index ? 'transform rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              <div 
                id={`faq-content-${index}`}
                className={`px-6 overflow-hidden transition-all duration-300 ${activeIndex === index ? 'max-h-96 pb-6' : 'max-h-0'}`}
              >
                <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">Still have questions?</p>
          <button onClick={handleDisplayContactModal} className="bg-purple-600 hover:bg-purple-700 text-white py-3 px-6 rounded-lg transition-colors duration-200">
            Contact Our Support Team
          </button>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;