import React from 'react'
import { IoIosClose } from "react-icons/io";
import {claukkInvoiceTemplates} from '../assets/data'
import claukkImg from '../assets/Claukk_CIT_0001.PNG'
import { useInvoice } from '../contexts/InvoiceContext';
import { useNavigate } from 'react-router-dom'
import {motion} from 'framer-motion'

const TemplatesModal = () => {

    const {setDisplayTemplatesModal} = useInvoice();

    const navigate = useNavigate();

    const userId = localStorage.getItem('userId');

    const handleCloseModal = ()=> {
        setDisplayTemplatesModal(false)
    }

    const handleInvoiceTemplateRedirect = (url)=> {
        navigate(`/dashboard${url}`)
        setDisplayTemplatesModal(false)
    }

  return (
    <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
           
        >
    
                <motion.div 
                             initial={{ scale: 0.95 }}
                               animate={{ scale: 1 }}
                              
                               className="relative bg-white rounded-xl shadow-2xl w-[720px] max-w-4xl lg:h-[600px] md:h-[400px] overflow-auto p-[25px] scrollbar-hide::-webkit-scrollbar scrollbar-hide"
                           >

                    <IoIosClose className='absolute right-[10px] top-[10px] text-lg cursor-pointer' onClick={handleCloseModal} />
                    <h1 className='font-semibold text-xl text-center'>Choose Your Preferred Template</h1>
                    <div className='mt-[30px]'>
                            <div className='flex items-center justify-center gap-[35px] flex-wrap'>
                                {claukkInvoiceTemplates?.map(item=> (
                                    
                                    <div key={item.id} className='w-[180px] h-[240px] shadow-lg border  hover:scale-110 rounded-lg transition-all cursor-pointer ' onClick={()=> handleInvoiceTemplateRedirect(item.url)} >
                                        <img src={item.img} alt="" className='w-[170px] h-[200px]  mx-auto' />
                                        <p className=' mt-[10px] text-center text-sm font-thin text-purple-500 tracking-wider'>{item.name}</p>
                                    </div>

                                ))}



                            </div>
                    </div>
                </motion.div>
        </motion.div>
  )
}

export default TemplatesModal