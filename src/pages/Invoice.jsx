import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CiSearch } from "react-icons/ci";
import { GoPlus } from "react-icons/go";
import './Invoice.css'
import { CiClock2 } from "react-icons/ci";
import { FaCheckSquare } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import { CgDanger } from "react-icons/cg";
import Sidebar from '../components/Sidebar'
import { useInvoice } from '../contexts/InvoiceContext';
import axios from 'axios'
import toast, { Toaster } from 'react-hot-toast';
import { FaCirclePlus } from "react-icons/fa6";
import { FaCircleCheck } from "react-icons/fa6";
import { supabase } from '../components/supabase';
import { MdOutlineDeleteForever } from "react-icons/md";
import { IoChevronBackCircle } from "react-icons/io5";
import { IoChevronForwardCircle } from "react-icons/io5";





const Invoice = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');
  const { invoiceStatus, setInvoiceStatus, setDisplayConfirmModal,targetDeleteId, setTargetDeleteId, confirmStatus, setInvoiceNumberValue, invoiceInitials, setInvoiceInitials, currency, setDisplayTemplatesModal, currencySymbol } = useInvoice();
  const [invData, setInvData] = useState([]);
  const [msg, setMsg] = useState('');
  const [updtPtPaymentValue, setUpdtPtPaymentValue] = useState('');
  const [showUpdateBtn, setShowUpdateBtn] = useState(true)
  const [activeRowId, setActiveRowId] = useState(null);
  const [showNoDataMsg, setShowNoDataMsg] = useState(true)
  const [searchTerm, setSearchTerm] = useState()
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false)
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [invoicesPerPage] = useState(10); // Show 10 invoices per page

  const notify = () => toast.success(msg);
  const accessToken = localStorage.getItem('accessToken');

  // Calculate current invoices to display
  const indexOfLastInvoice = currentPage * invoicesPerPage;
  const indexOfFirstInvoice = indexOfLastInvoice - invoicesPerPage;
  const currentInvoices = invData.slice(indexOfFirstInvoice, indexOfLastInvoice);
  
  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const showPartPaymentModal = (idx) => {
    setShowUpdateBtn(false)
    setActiveRowId((prevId) => (prevId === idx ? null : idx))
  }

  const handlePartPaymentData = async (idx) => {
    const { data: { session } } = await supabase.auth.getSession()
    const accessToken = session?.access_token
    setShowUpdateBtn(true)
    setActiveRowId((prevId) => (prevId === idx ? null : idx))
    const partPayment = {
      part_payment: updtPtPaymentValue
    }

    try {
      const result = await axios.put(`https://claukk-backend.onrender.com/api/users/invoice-details/part-payment/${idx}`, partPayment, {
                    headers: {
                    Authorization: `Bearer ${accessToken}`, // add token to request
                    },
                });
      const response = result.data
      console.log(response)
    } catch (error) {
      console.error("an error occurred while updating invoice partial payment", error);
    }
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
    
            setInvData((prevData) =>
              prevData.map((item) =>
                  item.id === idx ? { ...item, invoice_status: sValue } : item
              )
          );
    
    
            notify();
            
        } catch (error) {
            console.error("an error occurred while updating invoice status", error);
        }
    
      }






  const handleDisplayTemplateModal = ()=> {
    setDisplayTemplatesModal(true); 
    
 }

  useEffect(() => {
    const fetchInvoiceData = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      const accessToken = session?.access_token
      try {
        const result = await axios.get(`https://claukk-backend.onrender.com/api/users/invoice-details/${userId}`, {
                    headers: {
                    Authorization: `Bearer ${accessToken}`, // add token to request
                    },
                });
        const response = result.data

        // Sort by date issued (newest first)
        const sortedData = response.data.sort((a,b)=> {
           return new Date(b.date_issued) - new Date(a.date_issued);
        })


        setInvData(sortedData)

        if (response.data && response.data.length > 0) {
          setShowNoDataMsg(false);
        }

        if (!searchTerm) {
          setInvData(sortedData)
        }

      } catch (error) {
        console.error("an error occurred while fetching invoice data", error);
      }
    }
    fetchInvoiceData();
  }, [userId, searchTerm])

  useEffect(() => {
    const delayDeBounce = setTimeout(async () => {
      const { data: { session } } = await supabase.auth.getSession()
      const accessToken = session?.access_token
      if (searchTerm) {
        try {
          setLoading(true);
          const response = await axios.get(`https://claukk-backend.onrender.com/api/users/search-invoice/${userId}`, {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
                params: {
                  term: searchTerm,
                }
              });
                console.log(response.data)
                setMsg(response.data.msg)
          if (response.data.length > 0) {
            
            const sortedData = response.data.sort((a,b)=> {
              return new Date(b.date_issued) - new Date(a.date_issued);
            })
            
            setInvData(sortedData)
          }
        } catch (err) {
          console.error('Search error:', err);
        } finally {
          setLoading(false);
        }
      }
    }, 500);

    return () => clearTimeout(delayDeBounce);
  }, [searchTerm])



const handleDeleteInvoice = async (id) => {
       setDisplayConfirmModal(true)
        setTargetDeleteId(id)
}


  return (
    <>
      <Sidebar />
      <div className='relative pt-[50px] px-[15px] md:ml-[-120px] lg:ml-[1px]'>
        <div className=' mt-[-20px] flex gap-[7px] items-center'>
          <div><p className='items-center text-lg bg-purple-600 rounded-full h-[15px] w-[15px]'></p></div>
          <h1 className='font-thin text-2xl ' >Invoices</h1>
        </div>

        <div className=' flex items-center justify-between h-[80px] py-[10px] mt-[10px]  px-[5px] rounded-lg'>
          <div className='flex justify-center mt-[8px]'>
            <div className='flex gap-[10px] items-center w-[300px] border border-gray-200  rounded-lg py-[8px] px-[15px] '>
              <CiSearch className='text-xl' />
              <input type="text" placeholder='search ...' className='bg-transparent border-none outline-none' value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
          </div>

          <div onClick={handleDisplayTemplateModal} className='flex gap-[15px] items-center justify-center w-[220px] py-[8px] px-[10px] bg-black font-semibold text-white transition-all  hover:bg-gray-800  cursor-pointer hover:scale-110 rounded-lg ' >
            <GoPlus className=' text-xl' />
            <button  className=' '>New Invoice</button>
          </div>
        </div>

        <div className='min-h-[100vh]'>
          <div className=' mt-[20px] flex justify-center'>
            <table className='border  w-full text-sm'>
              <thead>
                <tr>
                  <th className='text-left pl-[15px] bg-gray-100 py-[12px] cursor-pointer border-gray-300 text-gray-500 font-thin hover:text-violet-700'>Invoice #</th>
                  <th className='text-left pl-[15px] bg-gray-100 py-[12px] cursor-pointer border-gray-300 text-gray-500 font-thin hover:text-violet-700'>Date Issued</th>
                  <th className='text-left pl-[15px] bg-gray-100 py-[12px] cursor-pointer border-gray-300 text-gray-500 font-thin hover:text-violet-700'>Client Name</th>
                  <th className='text-left pl-[15px] bg-gray-100 py-[12px] cursor-pointer border-gray-300 text-gray-500 font-thin hover:text-violet-700'>Total Amount</th>
                  <th className='text-left pl-[15px] bg-gray-100 py-[12px] cursor-pointer border-gray-300 text-gray-500 font-thin hover:text-violet-700'>Status</th>
                  <th className='text-left pl-[15px] bg-gray-100 py-[12px] cursor-pointer border-gray-300 text-gray-500 font-thin hover:text-violet-700'>Payment</th>
                  <th className='text-left pl-[15px] bg-gray-100 py-[12px] cursor-pointer border-gray-300 text-gray-500 font-thin hover:text-violet-700'>Due Date</th>
                  <th className='text-left pl-[15px] bg-gray-100 py-[12px] cursor-pointer border-gray-300 text-gray-500 font-thin hover:text-violet-700'>Amount Due</th>
                  <th className='text-left pl-[15px] bg-gray-100 py-[12px] cursor-pointer border-gray-300 text-gray-500 font-thin hover:text-violet-700'>Action</th>
                </tr>
              </thead>

              <tbody>
                {currentInvoices.map((item) => {
                  const colors = item.invoice_status === "overdue" ? "overdue" : item.invoice_status === "unpaid" ? "unpaid" : item.invoice_status === "paid" ? "paid" : item.invoice_status === "cancelled" ? "cancelled" : item.invoice_status === "partpayment" ? "partpayment" : "";

                  const duDate = item.due_date;
                  const updDueDate = new Date(duDate)
                  const updateDueDate = updDueDate.toISOString().split('T')[0];

                  const isd = item.date_issued;
                  const isudate = new Date(isd);
                  const updateIssueDate = isudate.toISOString().split('T')[0];
                  const updateInvoiceAmount = new Intl.NumberFormat('en-US', {style:'decimal', minimumFractionDigits:2, maximumFractionDigits:2}).format(item.invoice_amount);

                  return (
                    <tr key={item.id} className='hover:bg-slate-200 '>
                      <td className='border-t  text-left pl-[15px] py-[15px] font-thin text-gray-400 '>{item.invoice_number}</td>
                      <td className='border-t text-left pl-[15px] py-[15px] font-thin'>{updateIssueDate}</td>
                      <td className='border-t text-left pl-[15px] py-[15px] font-thin '>{item.client_name}</td>
                      <td className='border-t text-left pl-[15px] py-[15px] font-thin'>{currencySymbol}{updateInvoiceAmount}</td>
                      <td className='border-t text-left pl-[15px] py-[15px] font-thin  '>
                        <select name="status" id="status" value={item.invoice_status} onChange={(e) => handleChangeValue(e, item.id)} className={`bg-transparent ${colors} border-none outline-none font-thin cursor-pointer rounded-xl py-[2px] px-[10px]`}>
                          <option value="paid" className='text-black'>Paid</option>
                          <option value="unpaid" className='text-black' >Unpaid</option>
                          <option value="overdue" className='text-black'>Overdue</option>
                          <option value="cancelled" className='text-black'>Cancelled</option>
                          <option value="partpayment" className='text-black'>Part Payment</option>
                        </select>
                      </td>
                      <td className='border-t text-left pl-[15px] px-[7px] py-[15px] font-thin relative' onChange={(e) => setUpdtPtPaymentValue(e.target.value)} >{item.part_payment_amount}

                        {activeRowId === item.id &&
                          <div className='flex flex-col gap-[10px] bg-gray-100 shadow-lg rounded-lg py-[10px] w-[250px] relative'>
                            <div>
                              <input type='text' placeholder='Enter Amount' value={updtPtPaymentValue} onChange={(e) => setUpdtPtPaymentValue(e.target.value)} className='w-[200px] h-[30px] p-[7px] bg-transparent outline-none border-none py-[5px]' />
                              <FaCircleCheck onClick={() => handlePartPaymentData(item.id)} className='absolute top-0 right-0 cursor-pointer text-lg ' />
                            </div>
                          </div>
                        }

                        {showUpdateBtn &&
                          <FaCirclePlus onClick={() => showPartPaymentModal(item.id)} className='absolute top-[18px] right-[5px] cursor-pointer ' />
                        }
                      </td>
                      <td className='border-t text-left pl-[15px] py-[15px] font-thin'>{updateDueDate}</td>
                      <td className='border-t text-left pl-[15px] py-[15px] font-thin'>{item.amount_due || item.invoice_amount}</td>
                      <td className='border-t text-left pl-[15px] py-[15px] font-thin'><MdOutlineDeleteForever onClick={()=> handleDeleteInvoice(item.id)} className='text-red-500 text-xl hover:scale-150 transition-all cursor-pointer' /></td>
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
              className=" disabled:opacity-50 text-xl"
            >
              <IoChevronBackCircle size={20} />
            </button>
            
            <span className="px-4 py-[2px] text-xs">
              {currentPage} of {Math.ceil(invData.length / invoicesPerPage)}
            </span>
            
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={indexOfLastInvoice >= invData.length}
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

export default Invoice