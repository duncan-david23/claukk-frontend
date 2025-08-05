import React, {useState, useEffect} from 'react'
import { useInvoice } from '../contexts/InvoiceContext'
import { IoIosClose } from "react-icons/io";
import axios from 'axios'
import toast, { Toaster } from 'react-hot-toast';
import { supabase } from './supabase';
import { motion } from 'framer-motion';

const UpdateClientDataModal = () => {

    const [existingValue, setExistingValue ] = useState('')
    const [inputValue, setInputValue ] = useState('')

const {setDisplayUpdateClientDataModal, clientId, setClientId} = useInvoice();





const handleCloseModal = ()=> {
    setDisplayUpdateClientDataModal(false)
}

const [formValues, setFormValues] = useState({
    cName: '',
    cEmail: '',
    cAddress: '',
    cPhone: '',
    user_id: ''
})

const handleFormChange = (e)=> {
    setFormValues({
        ...formValues,
        [e.target.name]: e.target.value,
        user_id:existingValue ? existingValue.user_id : ''
    }
    )

}

const notify = () => toast.success('Client Data Updated Successfully.');

const handleUpdateData = async (e)=> {
    const { data: { session } } = await supabase.auth.getSession()
      const accessToken = session?.access_token
    e.preventDefault();
    console.log(formValues)
    try {
        const result = await axios.put(`https://claukk-backend.onrender.com/api/users/update-client-profile-data/${clientId}`, formValues, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        const response = result.data
        setFormValues('')

    } catch (error) {
        console.error('an error occurred while updating or creating profile');
    }
    setDisplayUpdateClientDataModal(false)
    notify()
}


useEffect(()=> {
    
    const fetchClientProfileData = async ()=> {
        const { data: { session } } = await supabase.auth.getSession()
      const accessToken = session?.access_token
        try {
            const result = await axios.get(`https://claukk-backend.onrender.com/api/users/client-profile-data/${clientId}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
            const response = result.data; 
            setExistingValue(response)
            

    
        } catch (error) {
            console.error("an error occurred while fetching client profile data", error);
        }
     }
     fetchClientProfileData();
}, [])

  return (
    <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
     className='fixed  top-0 right-0 left-0 bottom-0 w-[100%] h-[100%] z-50' style={{background: 'rgba(0,0,0,0.5)'}}>

            <div className='absolute  lg:top-[25%] lg:left-[40%] md:top-[15%] md:left-[30%] w-[500px] h-fit p-[20px] bg-white rounded-lg z-60'>
                <form onSubmit={handleUpdateData} className='relative'>
                <IoIosClose onClick={handleCloseModal} className='absolute top-[-15px] right-[-15px] text-lg cursor-pointer' />
                  <div className='flex gap-[15px] justify-between'>
                        <div> 
                            <div className='flex flex-col gap-[5px] my-[10px]'>
                                <label htmlFor="cName" className='font-thin text-gray-800 tracking-tight '>Client Name</label>
                                <input type="text" name='cName' placeholder={existingValue ? existingValue.name : ''} value={formValues.cName} onChange={handleFormChange}  className='border border-gray-400 w-[100%] px-[10px] py-[5px] focus:outline-none focus:ring-2 focus:ring-violet-600 rounded-xl'/>
                            </div>
                            <div className='flex flex-col gap-[5px] my-[10px]'>
                                <label htmlFor="cEmail" className='font-thin text-gray-800 tracking-tight '>Client Email</label>
                                <input type="text" name='cEmail' placeholder={existingValue ? existingValue.email : ''} value={formValues.cEmail}  onChange={handleFormChange} className='border border-gray-400 w-[100%] px-[10px] py-[5px] focus:outline-none focus:ring-2 focus:ring-violet-600 rounded-xl'/>
                            </div>

                        </div>
                    
                        <div>
                            <div className='flex flex-col gap-[5px] my-[10px]'>
                                <label htmlFor="cPhone" className='font-thin text-gray-800 tracking-tight '>Client Phone</label>
                                <input type="text" name='cPhone' placeholder={existingValue ? existingValue.phone : ''} value={formValues.cPhone} onChange={handleFormChange} className='border border-gray-400 w-[100%] px-[10px] py-[5px] focus:outline-none focus:ring-2 focus:ring-violet-600 rounded-xl'/>
                            </div>
                            <div className='flex flex-col gap-[5px] my-[10px]'>
                                <label htmlFor="cAddress" className='font-thin text-gray-800 tracking-tight '>Client Address</label>
                                <input type="text" name='cAddress' placeholder={existingValue ? existingValue.address : ''} value={formValues.cAddress} onChange={handleFormChange} className='border border-gray-400 w-[100%] px-[10px] py-[5px] focus:outline-none focus:ring-2 focus:ring-violet-600 rounded-xl'/>
                            </div>
                        </div>

                    

                  </div>

                    <div className='flex justify-center'>
                        <button type="submit" className='bg-violet-600 text-white py-[8px] px-[10px] w-[250px] text-center mt-[25px] hover:bg-violet-700 rounded-lg'>Confirm Update</button>
                    </div>
                    
                </form>
            </div>
    </motion.div>
  )
}

export default UpdateClientDataModal