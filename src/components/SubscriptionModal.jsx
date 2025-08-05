import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoMdClose, IoMdCheckmarkCircle } from "react-icons/io";
import { FiCreditCard, FiDownload, FiCalendar } from "react-icons/fi";
import { useInvoice } from '../contexts/InvoiceContext';
import axios from 'axios'
import { CiCircleCheck } from "react-icons/ci";
import { CiCalendarDate } from "react-icons/ci";
import { MdOutlineCreditCard } from "react-icons/md";

const SubscriptionModal = () => {

  const { displaySubscriptionModal, setDisplaySubscriptionModal, activePlan, setActivePlan } = useInvoice();

  // State management
  
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [checked, setChecked] = useState(false)
  const [cancellationReason, setCancellationReason] = useState('');
  const [paymentMethods, setPaymentMethods] = useState([
    { id: 1, last4: '4242', brand: 'visa', expiry: '12/25' }
  ]);


  const user_mail_address = localStorage.getItem('userEmail')
  const user_id = localStorage.getItem('userId')
  console.log(user_mail_address)


  const proPlan = {
    name: "premium plan",
    price: 49,
    features: [
       {
        item: 'Unlimited invoices',
        checked: true
      },
      {
        item: 'Dashboard',
        checked: true
      },
      {
        item: 'Smart notifications',
        checked: true
      },
      {
        item: 'Client management',
        checked: true
      },
      {
        item: 'Email reminders',
        checked: true
      }
    ],
    user_email: user_mail_address
  };

  


  const freePlan = {
    name: "free plan",
    price: 0,
    features: [
      {
        item: '5 invoices/month',
        checked: true
      },
      {
        item: 'Dashboard',
        checked: true
      },
      {
        item: 'No notifications',
        checked: false
      },
      {
        item: 'No client management',
        checked: false
      },
      {
        item: 'No email reminders',
        checked: false
      }
    ],
       
    user_email: user_mail_address
  }

 
  const plan_data = {
    user_email: user_mail_address,
    plan_code: 'PLN_67bx618hnedo5d7',
    name: 'Premium Plan'
  }


  const handleFreePlan = () => {
    setActivePlan('free');
  };

  const handleUpgrade = async () => {
    // setActivePlan('pro')
    
        try {
        const res = await axios.post(`https://claukk-backend.onrender.com/api/users/subscribe/${user_id}`, plan_data);
        // Redirect user to Paystack payment page
       window.open(res.data.url, '_blank');
      } catch (error) {
        console.error(error);
        alert("Subscription failed");
      }
  };
  




  const handleCancelSubscription = () => {
    console.log('Cancellation reason:', cancellationReason);
    // API call to cancel subscription would go here
    setShowCancelConfirm(false);
    setActivePlan('free');
  };

  return (
    <AnimatePresence>
      {displaySubscriptionModal && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setDisplaySubscriptionModal(false)}
        >
          <motion.div 
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            className="relative bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-white z-10 p-6 border-b border-gray-100 flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-800">Manage Subscription</h1>
              <button 
                onClick={() => setDisplaySubscriptionModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <IoMdClose size={24} />
              </button>
            </div>

            <div className='flex justify-center gap-[50px] items-center py-[20px] px-[40px]'>
                <div className='w-[300px] h-[450px] px-[20px] py-[15px] border border-gray-200 rounded-lg cursor-pointer'>
                    <div className='flex justify-between items-center'>
                      <p className='font-bold text-gray-700 text-lg'>Free Plan</p>
                        {activePlan =='free' && 
                          <div className='bg-purple-50 py-[5px] px-[12px] rounded-full'>
                          <p className='text-purple-700 text-xs font-thin '>ACTIVE</p>
                          </div>
                        }
                    </div>

                    <div className='flex items-center justify-left mt-[10px]'>
                        <p className='font-bold text-2xl'>GHC0</p> <span className='font-thin text-gray-500 text-xs'>/mo</span>
                    </div>

                    <div className=' mt-[20px]'>
                      {
                        freePlan.features.map((i, key)=> (

                        
                        <div key={key} className='flex justify-left items-center gap-[12px] py-[10px]'>

                          <div>
                            {i.checked ? 
                              <CiCircleCheck className='bg-green-600 text-white rounded-full' />
                              :
                              <CiCircleCheck className='bg-gray-300 text-white rounded-full' />
                            }
                          </div>

                          <div>
                            <p className='text-gray-700 font-thin text-sm'>{i.item}</p>
                          </div>

                        </div>

                        
                        ))
                      }
                        
                    </div>

                    {activePlan=='free' ? 
                        <div className='bg-gray-500 py-[10px] px-[20px] rounded-lg cursor-pointer text-white text-center mt-[30px]'>
                            <button disabled >Subscribed</button>
                        </div>
                      
                          : 
                        <div className='bg-purple-700 py-[10px] px-[20px] rounded-lg cursor-pointer text-white text-center mt-[30px]'>
                            <button onClick={handleFreePlan}>Upgrade</button>
                        </div>
                          
                      }
                    
                </div>


                <div className='w-[300px] h-[450px] px-[20px] py-[15px] border border-gray-200 rounded-lg cursor-pointer'>
                    <div className='flex justify-between items-center'>
                      <p className='font-bold text-gray-700 text-lg'>Premium Plan</p>
                        {activePlan=='pro' && 
                          <div className='bg-purple-50 py-[5px] px-[12px] rounded-full'>
                          <p className='text-purple-700 text-xs font-thin '>ACTIVE</p>
                          </div>
                        }
                    </div>

                    <div className='flex items-center justify-left mt-[10px]'>
                        <p className='font-bold text-2xl'>GHC49</p> <span className='font-thin text-gray-500 text-xs'>/mo</span>
                    </div>

                    <div className=' mt-[20px]'>
                      {
                        proPlan.features.map((i, key)=> (

                        
                        <div key={key} className='flex justify-left items-center gap-[12px] py-[10px]'>

                          <div>
                            {i.checked ? 
                              <CiCircleCheck className='bg-green-600 text-white rounded-full' />
                              :
                              <CiCircleCheck className='bg-gray-300 text-white rounded-full' />
                            }
                          </div>

                          <div>
                            <p className='text-gray-700 font-thin text-sm'>{i.item}</p>
                          </div>

                        </div>

                        
                        ))
                      }
                        
                    </div>

                      {activePlan=='pro' ? 
                        <div className='bg-gray-500 py-[10px] px-[20px] rounded-lg cursor-pointer text-white text-center mt-[30px]'>
                            <button disabled >Subscribed</button>
                        </div>
                      
                          : 
                        <div className='bg-purple-700 py-[10px] px-[20px] rounded-lg cursor-pointer text-white text-center mt-[30px]'>
                            <button onClick={handleUpgrade}>Upgrade</button>
                        </div>
                          
                      }

                    
                </div>


            </div>

            <div className='px-6 py-[30px]'>
              <p className='font-bold text-xl'>Your Subscription</p>
              
              <div className='flex items-center justify-between'>

                  <div className='mt-[15px]'>
                      <p className='text-gray-400 text-sm font-thin mt-[8px]'>Current plan</p>
                      <p className='text-purple-600 capitalize font-bold mt-[8px]'>{activePlan} Plan (monthly)</p>
                      <div className='flex items-center justify-center gap-[7px] mt-[8px]'>
                        <CiCalendarDate />
                        <p className='font-sans text-gray-400'>Next Billing: 02/07/2025</p>
                      </div>
                  </div>

                  <div className='mt-[15px]'>
                      <p className='text-gray-400 text-sm font-thin mt-[8px]'>Payment Method</p>
                      <div className='flex items-center justify-center gap-[7px] mt-[8px]'>
                        <MdOutlineCreditCard />
                        <p className='font-sans text-gray-400'>Visa **** 4222 | Expires 12/25</p>
                      </div>
                        <p className='text-purple-600 font-thin mt-[8px] cursor-pointer'>Update Payment Method</p>
                  </div>

              </div>


              <div className='mt-[50px]'>
                <p className='font-bold text-xl'>Danger Zone</p>
                <button className='text-red-500 py-[10px] px-[15px] cursor-pointer border border-red-500 rounded-lg mt-[15px]'>Cancel Subscription</button>

              </div>

            </div>


           

              
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SubscriptionModal;