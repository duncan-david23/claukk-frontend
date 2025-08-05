import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoMdClose, IoMdCheckmarkCircle } from "react-icons/io";
import { FiCreditCard, FiDownload, FiCalendar } from "react-icons/fi";
import { useInvoice } from '../contexts/InvoiceContext';


const ContactClaukkModal = () => {
  const {displayContactUsModal, setDisplayContactUsModal,} = useInvoice()
  const [msg, setMsg] = useState('');


   const handleCloseDisplayModal = ()=> {
       setDisplayContactUsModal(false)
   }

  

  return (
    <AnimatePresence>
      {displayContactUsModal && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          
        >
          <motion.div 
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            className="relative bg-white rounded-xl shadow-xl w-[600px] max-w-[600px] max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-white z-10 p-6 border-b border-gray-100 flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-800 text-center">Contact Our Support Team On </h1>
                <p className='text-purple-700'>info@claukk.com</p>
              <button 
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <IoMdClose size={24} onClick={handleCloseDisplayModal} />
              </button>
            </div>

           
           

            
            


           

              
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ContactClaukkModal;