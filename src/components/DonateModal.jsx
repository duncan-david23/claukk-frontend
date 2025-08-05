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


const DonateModal = () => {
  const { displayDonateModal, setDisplayDonateModal, activePlan, setActivePlan, donationAmount, setDonationAmount } = useInvoice()
  const [msg, setMsg] = useState('');



  const navigate = useNavigate();

  const paystackPublicKey = 'pk_test_ef70c446ab3906e0e703c6c031384ec39a4b1003'
   const notify = () => toast.error('Transaction was not completed, please try again.');

  const componentProps = {
    email: localStorage.getItem('userEmail'),
    amount: donationAmount * 100, // Paystack expects amount in kobo
    publicKey: paystackPublicKey,
    metaData: {
      business_name: localStorage.getItem('businessName'),
    },
    currency: 'GHS',
    text: 'Donate Now',
    onSuccess: () => {
      setDisplayDonateModal(false);
      navigate('https://claukkinvoice.netlify.app/dashboard/thankyou');
      setDonationAmount(0); // Reset donation amount after successful transaction

    },
    onClose: () => {
      notify();
      setDisplayDonateModal(false);
      setDonationAmount(0); // Reset donation amount if transaction is closed
    }

}


  // State management
  const handleDonation = (amount) => {
    setDonationAmount(amount);
  };

  const userEmail = localStorage.getItem('userEmail')
  const userId = localStorage.getItem('userId')
  

  const handleDonate = async () => {
    if (donationAmount < 10) {
      alert("Please enter a valid donation amount.");
      return;
    }
    alert("Donation amount: " + donationAmount);
    console.log(userEmail);
  }


  return (
    <AnimatePresence>
      {displayDonateModal && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setDisplayDonateModal(false)}
        >
          <motion.div 
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            className="relative bg-white rounded-xl shadow-xl w-[600px] lg:max-w-[600px] lg:max-h-[90vh] md:max-w-[500px] md:max-h-[70vh]  overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-white z-10 p-6 border-b border-gray-100 flex justify-between items-center">
              <h1 className="lg:text-2xl md:text-xl font-bold text-gray-800 text-center">Help keep ClaukkInvoice Free</h1>
              <button 
                onClick={() => setDisplayDonateModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <IoMdClose size={24} />
              </button>
            </div>

            <div className='flex justify-between items-center p-6 border-b border-gray-100'>
              <p className='font-thin text-gray-500'>Monthly Target: </p>
              <p className='font-bold text-purple-800  lg:text-lg'>GHC 4,290.00</p>
            </div>

            <div className='mt-[10px] lg:text-sm md:text-xs p-6'>
                <h1>We rely on community support to maintain and improve this app. Your donation helps cover server costs and supports continuous development. If we reach our monthly target, the app stays free for everyone! Thank you for your support!</h1>
            </div>

            {/* Donation Options */}
            <div className='flex justify-center items-center gap-[10px] mt-[20px]'>
              <p onClick={() => handleDonation(10)} className={`p-[10px] text-sm cursor-pointer hover:bg-gray-200 transition-all rounded-lg font-thin text-purple-500 bg-gray-100 ${donationAmount===10 ? 'bg-purple-100 ring-1 ring-purple-500' : ''}`}>GHC 10</p>
              <p onClick={() => handleDonation(20)} className={`p-[10px] text-sm cursor-pointer hover:bg-gray-200 transition-all rounded-lg font-thin text-purple-500 bg-gray-100 ${donationAmount===20 ? 'bg-purple-100 ring-1 ring-purple-500' : ''}`}>GHC 20</p>
              <p onClick={() => handleDonation(30)} className={`p-[10px] text-sm cursor-pointer hover:bg-gray-200 transition-all rounded-lg font-thin text-purple-500 bg-gray-100 ${donationAmount===30 ? 'bg-purple-100 ring-1 ring-purple-500' : ''}`}>GHC 30</p>
              <p onClick={() => handleDonation(50)} className={`p-[10px] text-sm cursor-pointer hover:bg-gray-200 transition-all rounded-lg font-thin text-purple-500 bg-gray-100 ${donationAmount===50 ? 'bg-purple-100 ring-1 ring-purple-500' : ''}`}>GHC 50</p>
            </div>

            <div>
              <p className='text-center text-gray-500 mt-[20px]'>Or enter a custom amount:</p>
              <div className='flex justify-center items-center gap-[10px] mt-[10px]'>
                <input 
                  type="number" 
                  placeholder="Enter amount" 
                  required="required"
                  min="10"
                  value={donationAmount} 
                  onChange={(e) => setDonationAmount(e.target.value)} 
                  className='border border-gray-300 rounded-lg p-2 w-[200px]'
                />
              </div>
            </div>

            <div className="mt-[50px] m-auto flex flex-col items-center gap-4">
                 <PaystackButton onClick={handleDonate} {...componentProps} className='py-2 px-4 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-all mb-[20px] w-[300px] text-center m-auto'/>
            </div>
            


           

              
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DonateModal;