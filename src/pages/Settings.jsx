import React, { useEffect, useState } from 'react'
import { useInvoice } from '../contexts/InvoiceContext'
import BpsModal from '../components/BpsModal'
import PsModal from '../components/PsModal'
import UpsModal from '../components/UpsModal'
import Sidebar from '../components/Sidebar'
import { HiOfficeBuilding, HiUserCircle, HiCurrencyDollar } from 'react-icons/hi'

const Settings = () => {
    const { displayBpsModal, setDisplayBpsModal, displayPsModal, setDisplayPsModal, displayUpsModal, setDisplayUpsModal} = useInvoice();
    const [initialLoad, setInitialLoad] = useState(true);

    const handleBpsDisplayModal = ()=> {
        setDisplayBpsModal(true)
        setDisplayPsModal(false)
        setDisplayUpsModal(false)
    }

    const handlePsDisplayModal = ()=> {
        setDisplayPsModal(true)
        setDisplayBpsModal(false)
        setDisplayUpsModal(false)
    }

    const handleUpsDisplayModal = ()=> {
        setDisplayUpsModal(true)
        setDisplayPsModal(false)
        setDisplayBpsModal(false)
    }

    

    return (
        <>
            <Sidebar/>
            <div>
                {displayBpsModal &&
                    <BpsModal onClose={() => setDisplayBpsModal(false)}/>
                }

                {displayPsModal &&
                    <PsModal onClose={() => setDisplayPsModal(false)}/>
                }
                
                {displayUpsModal &&
                    <UpsModal onClose={() => setDisplayUpsModal(false)}/>
                }


                
                <div className='mt-[50px] ml-[45px] gap-[10px] flex justify-center items-center h-[80vh]'>
                    <div 
                        onClick={handleBpsDisplayModal} 
                        className={`w-[250px] flex justify-between items-center font-thin border border-gray-200 rounded-lg hover:ring-1 hover:ring-purple-600 transition-all py-[8px] px-[15px] text-center cursor-pointer `}
                    >
                        <p>Business Profile Settings</p>
                        <HiOfficeBuilding className='text-lg ' size={20} />

                    </div>
                    
                    {/* <div 
                        onClick={handleUpsDisplayModal}  
                        className={`w-[250px] flex justify-between items-center font-thin border border-gray-200 rounded-lg hover:ring-1 hover:ring-purple-600 transition-all py-[8px] px-[15px] text-center cursor-pointer `}
                    >
                        <p>User Profile Settings</p>
                        <HiUserCircle className='text-lg ' size={20} />
                    </div> */}
                </div>
            </div>
        </>
    )
}

export default Settings