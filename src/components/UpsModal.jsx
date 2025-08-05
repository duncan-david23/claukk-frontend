import React from 'react'
import { IoMdCloseCircle } from "react-icons/io";
import { useInvoice } from '../contexts/InvoiceContext'

const UpsModal = () => {

    const { displayBpsModal, setDisplayBpsModal, displayPsModal, setDisplayPsModal} = useInvoice();



  return (
    <div >

            <div className='absolute  top-[17.5%] left-[16.8%]  w-[1050px] h-fit p-[20px]  shadow-lg rounded-lg z-60'>
                <form className='relative'>
                    <h1 className='font-bold text-xl text-purple-700'>PROFILE SETTINGS</h1>

                    <div>
                        <button type="submit" className='bg-violet-600 text-white py-[8px] px-[10px] w-[250px] text-center mt-[25px] hover:bg-violet-700 rounded-lg'>Save</button>
                    </div>
                    
                </form>
            </div>
    </div>
  )
}

export default UpsModal