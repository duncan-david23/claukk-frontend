import React, {useState, useEffect} from 'react'
import { useInvoice } from '../contexts/InvoiceContext'
import { IoIosClose } from "react-icons/io";
import axios from 'axios'
import claukInv from '../assets/Claukk_Invoice_logo.png' 
import toast, { Toaster } from 'react-hot-toast';
import { supabase } from './supabase';

import { motion } from 'framer-motion';

const SendReminderModal = () => {

    const [clientEmail, setClientEmail ] = useState('')
    const [clientName, setClientName ] = useState('')

const {setDisplayUpdateClientDataModal, clientId, setClientId, displayReminderModal, setDisplayReminderModal} = useInvoice();





const handleCloseModal = ()=> {
    setDisplayReminderModal(false)
}


// const notifySuccess = () => toast.success('Reminder Sent Successfully.');
// const notify = () => toast.error('An Error occurred, try again later.');

const [formValues, setFormValues] = useState({
    subject: `Invoice Reminder`,
    message: `Hi, [client]
This is to remind you of your overdue invoice number JER2345

Thank You`,
    clientEmail: "",
    clientName: ""
    
})

const handleFormChange = (e)=> {
    setFormValues({
        ...formValues,
        [e.target.name]: e.target.value,
    });

}


// Sending invoice reminder message

const handleSendReminder = async (e)=> {

    e.preventDefault();
    try {
        const { data: { session } } = await supabase.auth.getSession()
        const accessToken = session?.access_token
        
        setDisplayReminderModal(false)
        console.log(formValues)
        const result = await axios.post(`https://claukk-backend.onrender.com/api/users/send-reminder/${clientId}`, formValues, 
            {
                    headers: {
                    Authorization: `Bearer ${accessToken}`, // add token to request
                    },
                }
        );
        const response = result.data;
        console.log("Reminder sent:", response);
        

    } catch (error) {
        console.error('an error occurred while sending reminder');
    }

    
    
}

useEffect(()=> {
    const fetchClientProfileData = async ()=> {
        const { data: { session } } = await supabase.auth.getSession()
        const accessToken = session?.access_token
        try {
            const result = await axios.get(`https://claukk-backend.onrender.com/api/users/client-profile-data/${clientId}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            const response = result.data;
            setClientEmail(response?.email)
            setClientName(response?.name)
            
             // Update formValues with client email and name
        setFormValues((prev) => ({
            ...prev,
            clientEmail: response?.email || "",
            clientName: response?.name || "",
          }));
    
        } catch (error) {
            console.error("an error occurred while fetching client profile data", error);
        }
     }
     fetchClientProfileData();
}, [clientId])




  return (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
     className='fixed  top-0 right-0 left-0 bottom-0 w-[100%] h-[100%] z-50' style={{background: 'rgba(0,0,0,0.5)'}}>

            <div className='absolute  lg:top-[25%] lg:left-[40%] md:top-[15%] md:left-[30%]  w-[500px] h-fit p-[20px] bg-white rounded-lg z-60'>
                <form onSubmit={handleSendReminder} className='relative'>
                <IoIosClose onClick={handleCloseModal} className='absolute top-[-15px] right-[-15px] text-lg cursor-pointer' />
                  <div className='flex flex-col gap-[15px] justify-between'>
                        {/* <div> 
                            
                            <div className='flex flex-col gap-[5px] my-[10px]'>
                                <label htmlFor="subject" className='font-thin text-gray-500'  >Subject:</label>
                                <input type="text" name='subject' value={formValues.subject} onChange={handleFormChange} className='border border-gray-400 w-[100%] p-[10px] focus:outline-none focus:ring-2 focus:ring-violet-600 rounded-xl'/>
                            </div>

                        </div> */}
                    
                        <div>
                            
                            <div className='flex flex-col gap-[5px] my-[10px]'>
                                <label htmlFor="message" className='font-thin text-gray-500' >Message:</label>
                                <textarea
                                    className="w-full h-40 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-600 resize-none"
                                    name='message' value={formValues.message} onChange={handleFormChange} >
                                </textarea>
                            </div>
                        </div>

                    

                  </div>

                    <div className='flex justify-center'>
                        <button type="submit" className='bg-violet-600 text-white py-[8px] px-[10px] w-[250px] text-center mt-[25px] hover:bg-violet-700 rounded-lg'>Proceed</button>
                    </div>
                    
                </form>
            </div>
    </motion.div>
  )
}

export default SendReminderModal