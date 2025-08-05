import React, {useEffect, useState} from 'react'
import { NavLink } from 'react-router-dom'
import { RiDashboardHorizontalFill } from "react-icons/ri";
import { FaFileInvoice } from "react-icons/fa";
import { IoSettingsOutline } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";
import { useInvoice } from '../contexts/InvoiceContext';
import { FaUserFriends } from "react-icons/fa";
import { IoIosLogOut } from "react-icons/io";
import { IoIosNotifications } from "react-icons/io";
import { IoDiamondOutline } from "react-icons/io5";
import { BsStars } from "react-icons/bs";
import claukInv from '../assets/Claukk_Invoice_logo.png' 
import claukkIcon from '../assets/Claukk_Icon.png'
import axios from 'axios' 
import { supabase } from '../components/supabase';


const Sidebar = () => {

    const [bData, setBdata] = useState()


    const { displayBpsModal, setDisplayBpsModal, displayPsModal, setDisplayPsModal, displayUpsModal,activePlan, setActivePlan, setDisplayUpsModal, displaySubscriptionModal, setDisplaySubscriptionModal} = useInvoice();

  
   const handleSignOut = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error('Error signing out:', error.message);
        } else {
            console.log('Signed out successfully');
            window.location.href = '/login'; 
            localStorage.removeItem('accessToken');
            localStorage.removeItem('userId');
            localStorage.removeItem('userEmail');
            localStorage.removeItem('business_name');
        }
    };

//   useEffect(()=> {
//     const fetchBizData = async ()=> {
//     try {
//         const result = await axios.get(`https://claukk-backend.onrender.com/api/users/bsprofile/${usrId}`);
//         const response = result.data
//         setBdata(response.data);
        


//     } catch (error) {
//         console.error("an error occurred while fetching user's business profile data", error);
//     }
//  }

//  fetchBizData();
// },[usrId])

  return (
    <div className='flex flex-col justify-between lg:w-[180px] w-[80px]  h-[100vh] px-[15px] border-r border-gray-300 fixed top-0 left-0 bg-white '>

        <div>
            <div className=''>
                <div className='mt-[15px]'>
                    <img src={claukInv} alt="claukk logo" className='w-[100px] ' />
                </div>
                
            </div>
            <div className=''>
                <NavLink to={`/dashboard`} end className='flex  gap-[10px] items-center py-[4px] px-[10px]  text-lg cursor-pointer  my-[10px] mt-[60px]  hover:text-violet-700 md:rounded-full '>
                    <RiDashboardHorizontalFill className='lg:text-sm md:text-lg text-yellow-500 ' />
                    <p className='  text-sm md:hidden lg:block  '>Dashboard</p>
                </NavLink>
            </div>
            <div className=''>
                <NavLink to={`/dashboard/invoices`} className='flex  gap-[10px] items-center py-[4px] px-[10px]  text-lg  cursor-pointer my-[10px]  hover:text-violet-700 md:rounded-full '>
                    <FaFileInvoice className='lg:text-sm md:text-lg text-blue-500 '/>
                    <p className='  text-sm md:hidden lg:block  '>Invoice</p>
                </NavLink>
            </div>
            <div className=''>
                <NavLink to={`/dashboard/clients`} className='flex  transition-all gap-[10px] items-center py-[4px] px-[10px]  text-lg  cursor-pointer my-[10px]  hover:text-violet-700 md:rounded-full '>
                    <FaUserFriends className='lg:text-sm md:text-lg text-green-500 '/>
                    <p className='  text-sm md:hidden lg:block  '>Clients</p>
                </NavLink>
            </div>
        </div>

        <div>
{/* 
        <div className='mt-[20px]'>
        <div className='flex flex-col gap-[20px] items-center py-[8px] px-[10px]  text-lg  cursor-pointer my-[10px]  hover:text-violet-700'>
                <div className='flex gap-[5px] items-center'>
                    <p className=' bg-green-200 text-green-600  tracking-wide text-xs rounded-xl px-[8px] py-[2px]'>Active</p>
                    <p className=' text-sm font-bold uppercase text-purple-600'>{activePlan}</p>

                </div>
                
                <div onClick={()=> setDisplaySubscriptionModal(true)} className='mt-[-10px]  justify-center text-center py-[7px] px-[8px] flex gap-[7px] items-center hover:scale-110 transition-all rounded-lg cursor-pointer ' style={{backgroundColor:'rgba(128, 0, 128, 0.1)'}}>
                    <p  className='text-xs text-purple-600 font-thin '>{activePlan=='pro' ? 'Manage Subscription' : 'Get C-Pro'}</p>
                    <BsStars className='text-sm text-purple-600'/>
                </div>
        </div>
        </div> */}

        </div>  



        <div>

            <div className=''>
            <NavLink to={`/dashboard/user-settings`} className='flex  gap-[10px] items-center py-[4px] px-[10px]  text-lg  cursor-pointer my-[10px]  hover:text-violet-700 md:rounded-full '>
                    <IoSettingsOutline className='lg:text-sm md:text-lg text-violet-500 '/>
                    <p className='  text-sm md:hidden lg:block  '>Settings</p>
                </NavLink>
            </div>

            <div className='mt-[20px]'>
            <div onClick={handleSignOut} className='flex gap-[10px] items-center py-[8px] px-[10px]  text-lg  cursor-pointer my-[10px]  hover:text-violet-700 md:rounded-full '>
                    <IoIosLogOut className='lg:text-sm md:text-lg text-red-500 '/>
                    <p className=' text-sm md:hidden lg:block  '>Logout</p>
                </div>
            </div>
        </div>


      
    </div>
  )
}

export default Sidebar