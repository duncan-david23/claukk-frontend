import React, {useEffect, useState} from 'react'
import { useParams } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import { CiMail } from "react-icons/ci";
import { CiLocationOn } from "react-icons/ci";
import { CiPhone } from "react-icons/ci";
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { FaCirclePlus } from "react-icons/fa6";
import { FaCircleCheck } from "react-icons/fa6";
import { useInvoice } from '../contexts/InvoiceContext'
import DoughnutChart from '../components/DoughnutChart'
import { FaUser } from "react-icons/fa";
import { supabase } from '../components/supabase';
import { BsFillSendFill } from "react-icons/bs";
import { CgEditBlackPoint } from "react-icons/cg";
import { CiUser } from "react-icons/ci";


const ClientProfile = () => {
    const [clientProfileData, setClientProfileData] = useState()
    const [firstCharacter, setFirstCharacter ] = useState()
    const [cInvData, setCinvData] = useState();
    const [msg, setMsg] = useState('');
    const [clientName, setClientName] = useState('');

    const [updtPtPaymentValue, setUpdtPtPaymentValue] = useState('');
    const [showUpdateBtn, setShowUpdateBtn] = useState(true)
    const [activeRowId, setActiveRowId] = useState(null); // Track the active row for the modal
    const [showNoDataMsg, setShowNoDataMsg] = useState(true)
    const notify = () => toast.success(msg);

    const {setDisplayUpdateClientDataModal, clientId, setClientId, currencySymbol, displayReminderModal, setDisplayReminderModal, displayConfirmClientDeleteModal, setDisplayConfirmClientDeleteModal,} = useInvoice();

     // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [invoicesPerPage] = useState(10); // Show 10 invoices per page


  // Calculate current invoices to display
  const indexOfLastInvoice = currentPage * invoicesPerPage;
  const indexOfFirstInvoice = indexOfLastInvoice - invoicesPerPage;
  const currentInvoices = cInvData?.slice(indexOfFirstInvoice, indexOfLastInvoice);
  
  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const accessToken = localStorage.getItem('accessToken');
  
    const showPartPaymentModal = (idx)=> {
      setShowUpdateBtn(false)
      setActiveRowId((prevId) => (prevId === idx ? null : idx))
    }
  
    const handlePartPaymentData = async (idx)=> {
        
      setShowUpdateBtn(true)
      setActiveRowId((prevId) => (prevId === idx ? null : idx))
      console.log(updtPtPaymentValue)
      const partPayment = {
        part_payment: updtPtPaymentValue
      }
  
      try{
        const { data: { session } } = await supabase.auth.getSession()
      const accessToken = session?.access_token
  
        const result = await axios.put(`https://claukk-backend.onrender.com/api/users/invoice-details/part-payment/${idx}`,partPayment, {
                    headers: {
                    Authorization: `Bearer ${accessToken}`, // add token to request
                    },
                });
        const response = result.data
        console.log(response)
      }catch (error){
        console.error("an error occurred while updating invoice partial payment", error);
      }
  
  
    }
    
    
    
    
    const {id} = useParams();


    const handleClientUpdateForm = (e)=> {
        e.preventDefault();
        setDisplayUpdateClientDataModal(true)
        setClientId(id)
    }

    const handleDisplayReminderModal = (e)=> {
        e.preventDefault();
        setDisplayReminderModal(true)
        setClientId(id)
    }

    

    const handleDeleteClient = async (id) => {
       setDisplayConfirmModal(true)
        setTargetDeleteId(id)
}






    const handleChangeValue = async (e, idx)=> {
        const sValue = e.target.value;
        const statusValue = {status_value:sValue}
          try {
            const { data: { session } } = await supabase.auth.getSession()
            const accessToken = session?.access_token
            const result = await axios.put(`https://claukk-backend.onrender.com/api/users/invoice-details/${idx}`, statusValue, {
                    headers: {
                    Authorization: `Bearer ${accessToken}`, // add token to request
                    },
                });
            const response = result.data
            setMsg(response.msg)
    
            setCinvData((prevData) =>
              prevData.map((item) =>
                  item.id === idx ? { ...item, invoice_status: sValue } : item
              )
          );
    
    
            notify();
            
        } catch (error) {
            console.error("an error occurred while updating invoice status", error);
        }
    
      }






    
        

    



    useEffect(()=> {
   
        const fetchClientProfileData = async ()=> {
            const { data: { session } } = await supabase.auth.getSession()
            const accessToken = session?.access_token
        try {
            const result = await axios.get(`https://claukk-backend.onrender.com/api/users/client-profile-data/${id}`, {
                    headers: {
                    Authorization: `Bearer ${accessToken}`, // add token to request
                    },
                });
            const response = result.data; 
           setClientName(response.name);
            setFirstCharacter(clientName && clientName.slice(0,1))
            setClientProfileData(response)

    
        } catch (error) {
            console.error("an error occurred while fetching client profile data", error);
        }
     }
     fetchClientProfileData();
    },[])
    

    useEffect(()=> {
   
        const fetchClientInvoiceData = async ()=> {
            const { data: { session } } = await supabase.auth.getSession()
            const accessToken = session?.access_token
        try {
            const result = await axios.get(`https://claukk-backend.onrender.com/api/users/client-invoice-data/${id}`, {
                    headers: {
                    Authorization: `Bearer ${accessToken}`, // add token to request
                    },
                });
            const response = result.data

            const sortedData = response.sort((a,b)=> {
                return new Date(b.date_issued) - new Date(a.date_issued);
            })

            setCinvData(sortedData)
    
            // if (response.data && response.data.length > 0) {
            //   setShowNoDataMsg(false);
            //   }
    
        } catch (error) {
            console.error("an error occurred while fetching invoice data", error);
        }
     }
     fetchClientInvoiceData();
    },[id])

  return (
    <>
        <Sidebar/>
        <div className='px-[15px] md:ml-[-120px] lg:ml-[1px]'>

          <div className=' pt-[20px] flex gap-[7px] items-center'>
          <div><p className='items-center text-lg bg-purple-600 rounded-full h-[15px] w-[15px]'></p></div>
          <h1 className='font-thin text-2xl ' >Client Profile</h1>
          </div>


        <div className=' flex justify-between  gap-[40px]   py-[10px] w-full  mt-[20px]  rounded-lg'>

              <div className='flex gap-[35px] bg-gray-50 border rounded-lg p-[15px] px-[30px] w-[620px] h-[350px]'>
                  <div className='w-[150px] h-[150px]  rounded-full flex items-center justify-center '>
                      <div className='text-8xl font-bold  ' > <CiUser /></div>
                  </div>

                  <div className=''>
                      <h1 className='font-thin text-purple-600 text-2xl mt-[20px] mb-[10px]' > {clientProfileData?.name} </h1>
                         <div className='flex gap-[15px] text-sm items-center'>
                          <CiMail />
                          
                          <p className='text-gray-500'> {clientProfileData?.email} </p>
                         </div>
                        
                         <div className='flex gap-[15px] text-sm items-center'>
                            <CiPhone />
                             
                            <p className='text-gray-500'> {clientProfileData?.phone} </p>
                          </div>

                          <div className='flex gap-[15px] text-sm items-center'>
                            <CiLocationOn />
                             
                            <p className='text-gray-500'> {clientProfileData?.address} </p>
                          </div>

                      <div className='mt-[150px] flex gap-[15px]'>
                        <div onClick={handleDisplayReminderModal} className='text-white lg:text-sm md:text-xs flex items-center justify-between gap-[10px] px-[15px] py-[8px] cursor-pointer text-center transition-all bg-purple-600 rounded-lg hover:scale-105 hover:bg-purple-800 '>
                          <button  >Send Reminder</button>
                          <BsFillSendFill size={18} />
                        </div>

                        <div onClick={handleClientUpdateForm}className='text-white lg:text-sm md:text-xs flex items-center justify-between gap-[10px] px-[15px] py-[8px] cursor-pointer text-center transition-all bg-purple-600 rounded-lg hover:scale-105 hover:bg-purple-800 '>
                          <button>Update Details</button>
                          <CgEditBlackPoint size={18} />
                        </div>
                      </div>

                  </div>
              </div>

              <div className=' w-[420px] h-[350px]  bg-gray-50 border rounded-lg'>
                    <div className='flex flex-col gap-[20px]  h-[350px] py-[15px] my-[0px] mr-[-5px] '>
                                <div>
                                    <DoughnutChart clientName={clientName} cId = {id} cData={cInvData && cInvData} />
                                </div> 

                            
                    </div>
              </div>

        </div>

              <div className='  h-[700px]  py-[20px] mt-[20px]'>

                    <div className='  flex justify-center'>
                    
                    <table className='border  w-full text-sm '>
                        <thead>
                        <tr>
                            <th className='text-left pl-[15px] py-[12px] cursor-pointer bg-gray-100 text-gray-500 font-thin hover:text-violet-700'>Invoice #</th>
                            <th className='text-left pl-[15px] py-[12px] cursor-pointer bg-gray-100 text-gray-500 font-thin hover:text-violet-700'>Date Issued</th>
                            <th className='text-left pl-[15px] py-[12px] cursor-pointer bg-gray-100 text-gray-500 font-thin hover:text-violet-700'>Client Details</th>
                            <th className='text-left pl-[15px] py-[12px] cursor-pointer bg-gray-100 text-gray-500 font-thin hover:text-violet-700'>Total Amount</th>
                            <th className='text-left pl-[15px] py-[12px] cursor-pointer bg-gray-100 text-gray-500 font-thin hover:text-violet-700'>Status</th>
                            <th className='text-left pl-[15px] py-[12px] cursor-pointer bg-gray-100 text-gray-500 font-thin hover:text-violet-700'>Payment</th>
                            <th className='text-left pl-[15px] py-[12px] cursor-pointer bg-gray-100 text-gray-500 font-thin hover:text-violet-700'>Due Date</th>
                            <th className='text-left pl-[15px] py-[12px] cursor-pointer bg-gray-100 text-gray-500 font-thin hover:text-violet-700'>Amount Due</th>
                        </tr>
                        </thead>

                        <tbody>
                        {currentInvoices?.map((item)=> {
                                const colors = item.invoice_status === "overdue" ? "overdue" : item.invoice_status === "unpaid" ? "unpaid": item.invoice_status === "paid"? "paid": item.invoice_status === "cancelled"? "cancelled": item.invoice_status === "partpayment"? "partpayment": "";

                            const duDate =item.due_date;
                            const updDueDate = new Date(duDate)
                            const updateDueDate = updDueDate.toISOString().split('T')[0];

                            const isd = item.date_issued;
                            const isudate = new Date(isd);
                            const updateIssueDate = isudate.toISOString().split('T')[0];
                            const updateInvoiceAmount = new Intl.NumberFormat('en-US', {style:'decimal', minimumFractionDigits:2, maximumFractionDigits:2}).format(item.invoice_amount);
                            

                            return(
                                <tr key={item.id} className='hover:bg-slate-200'>
                                    <td className='border-t text-left pl-[15px] py-[15px] font-thin text-gray-400 '>{item.invoice_number}</td>
                                    <td className='border-t text-left pl-[15px] py-[15px] font-thin'>{updateIssueDate}</td>
                                    <td className='border-t text-left pl-[15px] py-[15px] font-thin '>{item.client_name}</td>
                                <td className='border-t text-left pl-[15px] py-[15px] font-thin'>{currencySymbol}{updateInvoiceAmount}</td>
                                    <td className='border-t text-left pl-[15px] py-[15px] font-thin  '>
                                    <select name="status" id="status" value={item.invoice_status} onChange = {(e)=>handleChangeValue(e, item.id) } className={`bg-transparent ${colors} border-none outline-none font-thin cursor-pointer rounded-xl py-[2px] px-[10px]`}>
                                        <option value="paid" className='text-black'>Paid</option>
                                        <option value="unpaid" className='text-black' >Unpaid</option>
                                        <option value="overdue" className='text-black'>Overdue</option>
                                        <option value="cancelled" className='text-black'>Cancelled</option>
                                        <option value="partpayment" className='text-black'>Part Payment</option>
                                    </select>
                                    </td>
                                    <td className='border-t text-left pl-[15px] px-[15px] py-[15px] font-thin relative'>{item.part_payment_amount}
                                    
                                    {activeRowId === item.id &&
                                    <div className='flex flex-col gap-[10px] bg-gray-100 shadow-lg rounded-lg py-[10px] w-[250px] zIndex-500 relative'>
                                        <div>
                                        <input type='text' placeholder='Enter Amount' value={updtPtPaymentValue} onChange={(e)=> setUpdtPtPaymentValue(e.target.value)}  className='w-[200px] h-[30px] p-[7px] bg-transparent outline-none border-none py-[5px]' />                             
                                        <FaCircleCheck onClick={()=> handlePartPaymentData(item.id)} className='absolute top-0 right-0 cursor-pointer text-lg ' />
                                        </div>
                                    
                                    </div> 
                                    } 
                                    
                                    {showUpdateBtn &&
                                        <FaCirclePlus onClick={()=> showPartPaymentModal(item.id)} className='absolute top-[18px] right-[5px] cursor-pointer '/>
                                    }

                                    </td>
                                    <td className='border-t text-left pl-[15px] py-[15px] font-thin'>{updateDueDate}</td>
                                    <td className='border-t text-left pl-[15px] py-[15px] font-thin'>{item.amount_due || item.invoice_amount}</td>
                                </tr>
                            )
                            })}

                        

                        
                        
                            </tbody>

                        </table>
                        </div>

                    {/* Pagination Controls */}
                        <div className="flex justify-center my-4 gap-2">
                            <button
                            onClick={() => paginate(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-[20px] bg-black text-white rounded-full disabled:opacity-50 text-xs"
                            >
                            Previous
                            </button>
                            
                            <span className="px-4 py-[2px] text-xs">
                            Page {currentPage} of {Math.ceil(cInvData?.length / invoicesPerPage)} 
                            </span>
                            
                            <button
                            onClick={() => paginate(currentPage + 1)}
                            disabled={indexOfLastInvoice >= cInvData?.length}
                            className="px-[20px] bg-black text-white rounded-full disabled:opacity-50 text-xs"
                            >
                            Next
                            </button>
                        </div>

                        {/* {showNoDataMsg &&
                                <div className='flex justify-center items-center h-[300px]'>
                                    <h1 className='text-gray-400'>No data available</h1>
                                </div>
                                } */}


                        </div>





        
        
        
        
        
        </div>
    </>
  )
}

export default ClientProfile