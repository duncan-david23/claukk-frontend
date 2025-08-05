import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoMdClose, IoMdCheckmarkCircle } from "react-icons/io";
import { FiCreditCard, FiDownload, FiCalendar } from "react-icons/fi";
import { useInvoice } from '../contexts/InvoiceContext';
import axios from 'axios'
import { CiCircleCheck } from "react-icons/ci";
import { CiCalendarDate } from "react-icons/ci";
import { MdOutlineCreditCard } from "react-icons/md";
import {PaystackButton} from 'react-paystack';
import { useNavigate } from 'react-router-dom';
import ThankYouPage from '../pages/ThankYou';
import toast from 'react-hot-toast';
import { supabase } from './supabase';


const ConfirmDeleteClientModal = () => {
  const { displayConfirmModal, setDisplayConfirmModal, confirmStatus, setConfirmStatus, targetDeleteId, displayConfirmClientDeleteModal, setDisplayConfirmClientDeleteModal, } = useInvoice()
  const [msg, setMsg] = useState('');


   const handleCloseDisplayModal = ()=> {
        setDisplayConfirmClientDeleteModal(false)
   }

  
   const handleConfirmDelete = async () => {
        console.log(targetDeleteId)

        if(!targetDeleteId){
            return;
        }

        try {
            const { data: { session } } = await supabase.auth.getSession();
            const accessToken = session?.access_token;

            const response = await axios.delete(`https://claukk-backend.onrender.com/api/users/delete-client/${targetDeleteId}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            });

            console.log(response);
            toast.success('Invoice deleted successfully');
        } catch (error) {
            console.error('Error deleting invoice:', error);
            toast.error('Failed to delete invoice');
        } finally {
            setDisplayConfirmClientDeleteModal(false)
            window.location.reload()
        }
}


  return (
    <AnimatePresence>
      {displayConfirmClientDeleteModal && (
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
              <h1 className="text-2xl font-bold text-gray-800 text-center">Are You Sure Want To Delete This Client</h1>
              <button 
                onClick={() => setConfirmStatus(true)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <IoMdClose size={24} onClick={handleCloseDisplayModal} />
              </button>
            </div>

           
           

            <div className="mt-[50px] m-auto flex flex-col items-center gap-4">
                 <button onClick={handleConfirmDelete} className='py-2 px-4 bg-red-500 text-white rounded-md hover:bg-red-600 transition-all mb-[20px] w-[300px] text-center m-auto'> Confirm </button>
            </div>
            


           

              
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmDeleteClientModal;