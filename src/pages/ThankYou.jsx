import React from 'react';
import { motion } from 'framer-motion';
import { IoChevronBackCircleOutline } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';



const ThankYouPage = () => {
    const navigate = useNavigate();

    const businessName = localStorage.getItem('business_name') || 'Friend';
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center p-4 ml-[-200px]">
        <IoChevronBackCircleOutline className="w-8 h-8 text-purple-500 text-xl cursor-pointer hover:scale-110 transition-all absolute top-4 left-4" onClick={() => navigate('https://claukkinvoice.netlify.app/dashboard')} />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl w-full mx-auto bg-white rounded-3xl shadow-xl overflow-hidden"
      >
        
        {/* Header with illustration */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-500 px-8 py-12 text-center relative overflow-hidden">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 260, damping: 20 }}
            className="inline-block mb-6"
          >
            <svg 
              className="w-20 h-20 text-white" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M5 13l4 4L19 7" 
              />
            </svg>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-4xl md:text-5xl font-bold text-white mb-4"
          >
            Thank You! <p> {businessName}</p>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="text-xl text-purple-100 max-w-lg mx-auto"
          >
            Your support helps us build better tools for your business and keep ClaukkInvoice free for everyone.
          </motion.p>
          
          {/* Animated background elements */}
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white bg-opacity-10 rounded-full"></div>
          <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-40 h-40 bg-white bg-opacity-5 rounded-full"></div>
        </div>

        {/* Content */}
        <div className="px-8 py-10">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="text-center mb-8"
          >
            <p className="text-gray-700 text-lg leading-relaxed mb-6">
              Your donation means the world to us. We're committed to building 
              the best invoice management experience for entrepreneurs, freelancers, and businesses 
              just like yours.
            </p>
            
            <div className="bg-gray-50 rounded-2xl p-6 mb-8 border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-3">Your Impact</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex flex-col items-center p-3 bg-white rounded-xl shadow-sm">
                  <span className="text-2xl font-bold text-indigo-600">1</span>
                  <span className="text-gray-600">Feature developed</span>
                </div>
                <div className="flex flex-col items-center p-3 bg-white rounded-xl shadow-sm">
                  <span className="text-2xl font-bold text-cyan-600">99%</span>
                  <span className="text-gray-600">Uptime guarantee</span>
                </div>
                <div className="flex flex-col items-center p-3 bg-white rounded-xl shadow-sm">
                  <span className="text-2xl font-bold text-emerald-600">∞</span>
                  <span className="text-gray-600">Positive change</span>
                </div>
              </div>
            </div>
          </motion.div>


          {/* Footer note */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.5 }}
            className="mt-8 text-center"
          >
            <p className="text-gray-500 text-sm">
              We'll send a receipt to your email shortly. 
              {/* <br className="sm:hidden" />
              Questions? <a href="mailto:support@yourinvoiceapp.com" className="text-indigo-600 hover:text-indigo-800 font-medium">Contact us</a> */}
            </p>
          </motion.div>
          
        </div>
      </motion.div>

      {/* Floating elements animation */}
      <motion.div
        animate={{ 
          y: [-10, 10, -10],
        }}
        transition={{ 
          duration: 4, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
        className="fixed bottom-8 left-8 text-indigo-200 opacity-60"
      >
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
        </svg>
      </motion.div>
      

      <motion.div
        animate={{ 
          y: [10, -10, 10],
        }}
        transition={{ 
          duration: 5, 
          repeat: Infinity, 
          ease: "easeInOut",
          delay: 1 
        }}
        className="fixed top-8 right-8 text-cyan-200 opacity-60"
      >
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      </motion.div>
    </div>
  );
};

export default ThankYouPage;