import React, {useEffect, useState} from 'react'
import Sidebar from '../components/Sidebar'
import { CiSearch } from "react-icons/ci";
import { GoPlus } from "react-icons/go";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaUser } from "react-icons/fa";
import { supabase } from '../components/supabase';
import { MdOutlineDeleteForever } from "react-icons/md";
import { GrFormView } from "react-icons/gr";
import { useInvoice } from '../contexts/InvoiceContext';
import { IoChevronBackCircle } from "react-icons/io5";
import { IoChevronForwardCircle } from "react-icons/io5";


const Clients = () => {

const { displayConfirmClientDeleteModal, setDisplayConfirmClientDeleteModal, setTargetDeleteId} = useInvoice();
  const userId = localStorage.getItem('userId');

  const [clientData, setClientData] = useState()
  const [showNoDataMsg, setShowNoDataMsg] = useState(true)
  const [searchTerm ,setSearchTerm] = useState()
  const [loading, setLoading] = useState(false)

  // pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [invoicesPerPage] = useState(10);

  // pagination logic
  
  const accessToken = localStorage.getItem('accessToken');
  const navigate = useNavigate();

  const handleClientProfilePage = (idx) => {
      navigate(`https://claukkinvoice.netlify.app/dashboard/clients/client-profile/${idx}`)
  }

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);


  useEffect(()=> {
    const fetchClientsData = async ()=> {
      const { data: { session } } = await supabase.auth.getSession()
      const accessToken = session?.access_token
      try {
          const result = await axios.get(`https://claukk-backend.onrender.com/api/users/clients-data/${userId}`, {
                    headers: {
                    Authorization: `Bearer ${accessToken}`, // add token to request
                    },
                });
          const response = result.data; 
          setClientData(response)
          if (response && response.length > 0) {
              setShowNoDataMsg(false);
          }

          if (!searchTerm) {
            setClientData(response)
          }

      } catch (error) {
          console.error("an error occurred while fetching client data", error);
      }
    }
    fetchClientsData();
  },[userId, searchTerm])

  const indexOfLastInvoice = currentPage * invoicesPerPage;
  const indexOfFirstInvoice = indexOfLastInvoice - invoicesPerPage;
  const currentClientData = clientData?.slice(indexOfFirstInvoice, indexOfLastInvoice);


      

 useEffect(()=> {

      const delayDeBounce = setTimeout(async ()=> {
        const { data: { session } } = await supabase.auth.getSession()
      const accessToken = session?.access_token
        if (searchTerm) {
          try {
            setLoading(true);
            const response = await axios.get(`https://claukk-backend.onrender.com/api/users/search-client/${userId}`, {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
                params: {
                  term: searchTerm,
                }
              });
            // setSearchResults(response.data);
            console.log(response.data)
            if (response.data.length > 0){
              setClientData(response.data)
            } 

          } catch (err) {
            console.error('Search error:', err);

          } finally {
            setLoading(false);
          }
        }
      }, 500);

      return ()=> clearTimeout(delayDeBounce);

 }, [searchTerm])



 const handleDeleteClient = (id)=> {
  setDisplayConfirmClientDeleteModal(true)
  setTargetDeleteId(id)
 }



  return (
    <>
    <Sidebar/>
    <div className='relative pt-[50px] px-[15px] md:ml-[-120px] lg:ml-[1px]'>
      <div className='mt-[-20px] flex gap-[7px] items-center'>
      <div><p className='items-center text-lg bg-purple-600 rounded-full h-[15px] w-[15px]'></p></div>
      <h1 className='font-thin text-2xl text-black ' >Clients</h1>
      </div>

    <div className=' flex items-center justify-between h-[80px] py-[10px] mt-[10px] px-[5px] rounded-lg'>
           <div className='flex justify-center mt-[8px] flex-start'>
            <div className='flex gap-[10px] items-center w-[300px] border border-gray-200  rounded-lg py-[8px] px-[15px] '>
              <CiSearch className='text-xl'/>
              <input type="text" placeholder='search ...'  className='bg-transparent border-none outline-none' value={searchTerm} onChange={(e)=> setSearchTerm(e.target.value)} />
            </div>
          </div>

        
          
    </div>
      <div className='  min-h-[100vh] mt-[20px]'>

          
          


        <div className=' flex justify-center'>
         
          <table className='border rounded-lg w-full text-sm'>
            <thead>
              <tr>
                <th className='text-left pl-[15px] py-[12px] border-b  cursor-pointer bg-gray-100 text-gray-500 font-thin hover:text-purple-700'>Client ~</th>
                <th className='text-left pl-[15px] py-[12px] border-b  cursor-pointer bg-gray-100 text-gray-500 font-thin hover:text-purple-700'>Client Name</th>
                <th className='text-left pl-[15px] py-[12px] border-b  cursor-pointer bg-gray-100 text-gray-500 font-thin hover:text-purple-700'>Client Email</th>
                <th className='text-left pl-[15px] py-[12px] border-b  cursor-pointer bg-gray-100 text-gray-500 font-thin hover:text-purple-700'>Client Phone</th>
                <th className='text-left pl-[15px] py-[12px] border-b  cursor-pointer bg-gray-100 text-gray-500 font-thin hover:text-purple-700'>Actions</th>
                
           
              </tr>
            </thead>

            <tbody>

                {currentClientData ?.map((item)=> {
                  const cInitial = item.name.slice(0,1)

                  return (
                    <tr key={item.id} className=' cursor-pointer'>
                      <td className=' text-left pl-[15px] py-[5px] text-3xl font-bold text-black' >
                        <div className='w-[50px] text-xl flex justify-center items-center h-[50px] rounded-full '>
                          <FaUser />
                        </div>
                      </td>
                      <td className=' text-left pl-[15px] py-[15px] font-thin '>{item.name}</td>
                      <td className=' text-left pl-[15px] py-[15px] font-thin text-gray-500'>{item.email}</td>
                      <td className=' text-left pl-[15px] py-[15px] font-thin '>{item.phone}</td>
                      <td className=' text-left pl-[15px] py-[15px] font-thin flex gap-[20px] items-center'>
                        <GrFormView onClick={()=> handleClientProfilePage(item.id)} className='text-purple-500 text-3xl hover:scale-150 transition-all cursor-pointer' />
                        {/* <button className='py-[5px] px-[8px] bg-black text-white  hover:scale-110 rounded-lg transition-all'  onClick={()=> handleClientProfilePage(item.id)}>View</button> */}
                        <td className='border-t text-left pl-[15px] py-[15px] font-thin'><MdOutlineDeleteForever onClick={()=> handleDeleteClient(item.id)} className='text-red-500 text-xl hover:scale-150 transition-all cursor-pointer' /></td>
                        
                      </td>
                    </tr>
                  )
                })
                }
                      

            </tbody>

          </table>

                
        </div>

                 {/* Pagination Controls */}
          <div className="flex justify-center my-4 gap-2">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className=" disabled:opacity-50 text-xl"
            >
              <IoChevronBackCircle size={20} />
            </button>
            
            <span className="px-4 py-[2px] text-xs">
              {currentPage} of {Math.ceil(clientData?.length / invoicesPerPage)}
            </span>
            
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={indexOfLastInvoice >= clientData?.length}
             className="  disabled:opacity-50 text-xl"
            >
                <IoChevronForwardCircle size={20} />
            </button>
          </div>


                {showNoDataMsg &&
                <div className='flex justify-center items-center h-[300px]'>
                    <h1 className='text-gray-400'>No data available</h1>
                </div>
                }
                
    </div>            
    </div>
    </>
  )
}

export default Clients