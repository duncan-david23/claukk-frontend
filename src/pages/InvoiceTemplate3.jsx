import React, {useRef, useState, useEffect} from 'react'
import { FaLocationDot } from "react-icons/fa6";
import { IoIosCall } from "react-icons/io";
import { IoIosMail } from "react-icons/io";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import html2pdf from "html2pdf.js";
import { FiEdit3 } from "react-icons/fi";
import { FaCirclePlus } from "react-icons/fa6";
import { useInvoice } from '../contexts/InvoiceContext';
import { CiCircleMinus } from "react-icons/ci";
import Sidebar from '../components/Sidebar'
import axios from 'axios'
import { FaCircleCheck } from "react-icons/fa6";
import { supabase } from '../components/supabase';

const InvoiceTemplate3 = () => {
    const containerRef = useRef();
    const {itemData, clientPhoneValue, setClientPhoneValue, customColor, setCustomColor, currencySymbol, clientEmailValue, setClientEmailValue,invoiceStatus,invoiceInitials, setInvoiceInitials,setDueDateDays, dueDateDays, invoiceData, setItemData, businessData,invoiceIssueDate, setInvoiceIssueDate, setBusinessdata, showEdtBtn, invoiceTotal, invoiceSubTotal, taxAmount, setShowEdtBtn, dueDateValue, setDueDateValue, paymentMethodvalue, setPaymentMethodvalue, clientAddressValue, setClientAddressValue,clientNameValue, setClientNameValue, tNcValue, setTnCvalue,displayAddItemModal, setDisplayAddItemModal} = useInvoice();
    const [msg, setMsg] = useState('');
    const [showEditDate, setShowEditDate] = useState(true);
    const [invoiceNumberValue, setInvoiceNumberValue] = useState()
    const [invNumber, setInvNumber] = useState()
    const [displayCname, setDisplayCname] = useState(false)
    const [displayCaddress, setDisplayCaddress] = useState(false)
    const [displayCemail, setDisplayCemail] = useState(false)
    const [displayCphone, setDisplayCphone] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [key, setKey] = useState(0);
    const [clientInfo, setClientInfo] = useState([])
    const [showNoDataMsg, setShowNoDataMsg] = useState();
    const [isDownloading, setIsDownloading] = useState(false);
    const [isDownloaded, setIsDownloaded] = useState(false);
  
  
const paymentMValueRef = useRef();
const tNcValueRef = useRef();

useEffect(() => {
  if (paymentMValueRef.current) {
    const pmv = paymentMValueRef.current.innerText;
    setPaymentMethodvalue(pmv);
  }

  if (tNcValueRef.current) {
    const tncv = tNcValueRef.current.innerText;
    setTnCvalue(tncv);
  }
}, []);


  
    const handleDeleteItem = (idx) => {
      const updatedData = itemData.filter((item, index) => index !== idx); // Filter out the item by index
      setItemData(updatedData)
    };
  
  
    const theTaxAmount = new Intl.NumberFormat('en-US', {style:'decimal', minimumFractionDigits:2, maximumFractionDigits:2}).format(taxAmount);
    const theSubTotalAmount = new Intl.NumberFormat('en-US', {style:'decimal', minimumFractionDigits:2, maximumFractionDigits:2}).format(invoiceSubTotal);
    const theTotalAmount = new Intl.NumberFormat('en-US', {style:'decimal', minimumFractionDigits:2, maximumFractionDigits:2}).format(invoiceTotal);
    
    const userId = localStorage.getItem('userId') || '';
    const currentDate = new Date().toISOString().split('T')[0];
  
    
    
  
    
  
    
      
        const handleClientAddress = (e)=> {
          const cAddress = e.target.value;
          setClientAddressValue(cAddress)
        }
  
        const handleClientName = (e)=> {
          const cName = e.target.value;
          setClientNameValue(cName)
        }
  
        const handleClientPhone = (e)=> {
          const cPhone = e.target.value;
          setClientPhoneValue(cPhone)
        }
  
        const handleClientEmail = (e)=> {
          const cEmail = e.target.value;
          setClientEmailValue(cEmail)
        }
    
  
  
        const handleTnC = (e)=> {
          setTnCvalue(e.target.value)
        }
  
        const handlePaymentMchang = (e)=> {
          setPaymentMethodvalue(e.target.value)
        }
  
  
  
        let dateValue;
        const handleDateChange = (event) => {
           dateValue = event.target.value; // Get the selected date value
          setDueDateValue(dateValue); // Update the state
      };
  
        
        
        const handleDisplayAddItemModal = (e)=> {
  
          e.preventDefault();
          setDisplayAddItemModal(true);
          console.log(itemData);
            
          
       }
  
       const invBinitials = businessData?.bsname?.slice(0, 3).toUpperCase();
       
       
       
       
       
        const invoiceNum = {
          invoice_number : invNumber
         }
  
         const invoiceAmount = {
          invoice_amount: invoiceTotal,
         }
  
  
       const formDataValues = {...invoiceAmount, ...invoiceNum, invoiceData,  };
  
       const handleFormDataSubmit = async()=> {
        const { data: { session } } = await supabase.auth.getSession()
      const accessToken = session?.access_token
        try {
  
            const response = await axios.post(`https://claukk-backend.onrender.com/api/users/invoice-details/${userId}`,formDataValues, {
            headers: { Authorization: `Bearer ${accessToken}` },
          });
            const result = response.data;
          } catch (error) {
            console.error('an occurred while sending form data', error)
          }
       }
  
       const handleReload = () => {
        setKey((prevKey) => prevKey + 1); // Increment the key to force remount
      };
  
    // Validate required fields before submission
  const validateForm = () => {
    if (!dueDateValue) {
      alert('Please select a due date');
      return false;
    }
    if (itemData.length === 0) {
      alert('Please add at least one item');
      return false;
    }
    if (!clientNameValue) {
      alert('Please enter client name');
      return false;
    }
    return true;
  };

  
  const downloadAsPDF = () => {
    if (!validateForm()) return;
    
    setIsDownloading(true);
    setShowEditDate(true);
    setShowEdtBtn(false);
    handleReload();

    const options = {
      margin: 1,
      filename: `${clientNameValue} ${invNumber}.pdf`,
      html2canvas: {
        scale: 3,
        useCORS: true,
      },
      jsPDF: { unit: "pt", format: "a4", orientation: "portrait" },
    };

    if (containerRef.current) {
      html2pdf()
        .set(options)
        .from(containerRef.current)
        .save()
        .then(() => {
          // After PDF is generated
          handleFormDataSubmit();
          resetInputFields();
          setShowEdtBtn(true);
          setIsDownloading(false);
          setIsDownloaded(true);
          
          // Generate new invoice number
          const randomInvNumber = Math.floor(1000 + Math.random() * 9000);
          setInvoiceNumberValue(randomInvNumber);
        })
        .catch((error) => {
          console.error('PDF generation failed:', error);
          setIsDownloading(false);
        });
    }
  };
  
    const resetInputFields = () => {
      setClientNameValue(""); // Reset client name
      setClientAddressValue(""); // Reset client address
      setClientEmailValue("")
      setClientPhoneValue("")
      setDueDateValue(""); // Reset due date
      // setPaymentMethodvalue("Enter payment method details"); // Reset payment method
      // setTnCvalue("Write Something"); // Reset terms and conditions
      setItemData([]); // Reset item data if needed
  };
  
   useEffect(()=> {
    const invoiceNmb = parseInt(invoiceNumberValue);
    setInvoiceNumberValue(invoiceNmb)
  
    
   },[userId])
  
   useEffect(() => {
    const generateRandomInvNumber = () => {
      const randomInvNumber = Math.floor(1000 + Math.random() * 9000); // Generates a 4-digit number
      setInvoiceNumberValue(randomInvNumber);
    };
    generateRandomInvNumber();
  }, []);
  
  
    useEffect(()=> {
      setInvoiceIssueDate(currentDate)
      const fetchBizData = async ()=> {
        const { data: { session } } = await supabase.auth.getSession()
      const accessToken = session?.access_token
      try {
          const result = await axios.get(`https://claukk-backend.onrender.com/api/users/bsprofile/${userId}`, {
            headers: { Authorization: `Bearer ${accessToken}` },
          });
          const response = result.data
          
          setBusinessdata(response.data);

          setMsg(response.message)
  
          const invBinitials = response.data?.bsname?.slice(0, 3).toUpperCase();
          setInvoiceInitials(invBinitials)
  
      } catch (error) {
          console.error("an error occurred while fetching user's business profile data");
      }
   }
  
  
   fetchBizData();
  },[userId, invoiceNumberValue])
    
  
  
  
  useEffect(()=> {
    if(invBinitials){
      setInvNumber(`${invBinitials}${invoiceNumberValue} `)
    }
  },[invBinitials, invoiceNumberValue])
  
  
    
  
    const saveNandAcontentBtn = ()=> {
        setShowModal(!showModal)
        setDisplayCname(true)
        setDisplayCaddress(true)
        setDisplayCphone(true)
        setDisplayCemail(true)
    }
      
    const handleModal= ()=> {
      setShowModal(true)
    }

   

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
          setClientInfo(response)
          if (response && response.length > 0) {
              setShowNoDataMsg(false);
          }

      } catch (error) {
          console.error("an error occurred while fetching client data", error);
      }
    }
    fetchClientsData();
  },[userId])

  const handleClientChange = (e) => {
    const selectedClientName = e.target.value;
    const matchedClient = clientInfo.find(client => client.name === selectedClientName);
  
    if (matchedClient ) {
      setClientNameValue(matchedClient .name || '');
      setClientAddressValue(matchedClient .address || '');
      setClientEmailValue(matchedClient .email || '');
      setClientPhoneValue(matchedClient .phone || '');
      setShowNoDataMsg(false);
      // to show the contents of the clients
      setDisplayCname(true)
      setDisplayCaddress(true)
      setDisplayCphone(true)
      setDisplayCemail(true)
    } else {
      setClientNameValue('');
      setClientAddressValue('');
      setClientEmailValue('');
      setClientPhoneValue('');
      setShowNoDataMsg(true);
    }
  };


   useEffect(() => {
        const fetchColorData = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            const accessToken = session?.access_token
            try {
                const result = await axios.get(`https://claukk-backend.onrender.com/api/users/bsprofile/${userId}`, {
                    headers: {
                    Authorization: `Bearer ${accessToken}`, // add token to request
                    },
                });

                if (result.data.data) {

                    setCustomColor(result.data.data.bscolor)
                }
            } catch (error) {
                console.error("Error fetching business profile:", error);
            } 
        };

        fetchColorData()
    }, [userId]);





  return (
    <>
    <Sidebar/>
      <div className='md:ml-[-120px] lg:ml-[1px]'>
          
          <div className=' flex justify-center items-center my-[50px]'>
            
            <div  ref={containerRef} className='container w-[793px] h-fit bg-white shadow-lg py-[20px] px-[50px]'>
              <div className='flex items-center justify-between'>
                  <div>
                    <h1 className='text-2xl font-bold mb-[10px]'>{businessData?.bsname || 'Company Name' }</h1>
                    <p className='font-thin text-sm'>{businessData?.bsnumber || 'Company Number' } / {businessData?.bsnumber2 || '-' }</p>
                    <p className='font-thin text-sm'>{businessData?.bsmail || 'Company Email' }</p>
                    <p className='font-thin text-sm'>{businessData?.bsaddress || 'Company Address' }</p>
                  </div>
                  <h1 className='text-7xl' style={{ fontFamily: 'Great Vibes, cursive', color: customColor }} >Invoice</h1>
                </div>

                <p className='w-full h-[1px] bg-black mt-[30px]' style={{backgroundColor:customColor}}></p>
                     
                   {/* select clients data from existing clients */}
                    {showEdtBtn && 
                      <div className='flex justify-between items-center mt-[20px]'>
                        <select value={''} onChange={handleClientChange} className='p-[9px] border border-gray-300  bg-gray-50  rounded-md'>
                          <option value="">Select a client</option>
                          {clientInfo.map(client => (
                            <option key={client.id} value={client.name}>
                              {client.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    }

                <div className='mt-[20px] flex items-center justify-between'>
                    <div>
                      <div className='flex gap-[10px]  w-[190px] items-center'>
                      <h1 className='text-lg font-semibold mt-[20px] mb-[10px]' style={{color: customColor}}>Bill TO</h1>
                      {showEdtBtn && 
                      <FiEdit3 onClick={handleModal} className='text-lg cursor-pointer'/>
                      }

                      {showModal && 
                        <div>
                          <form>
                            <div className='flex flex-col gap-[10px] bg-gray-100 shadow-lg rounded-lg py-[10px] w-[250px] relative'>
                            <input type='text' placeholder='Name' value={clientNameValue} onChange={handleClientName} className='w-[200px] h-[30px] p-[7px] bg-transparent  outline-none border-none py-[5px]' />            
                            <input type='text' placeholder='Address' value={clientAddressValue} onChange={handleClientAddress} className='w-[200px] h-[30px] p-[7px] bg-transparent outline-none border-none py-[5px]' />                  
                            <input type='email' placeholder='Email' value={clientEmailValue} onChange={handleClientEmail} className='w-[200px] h-[30px] p-[7px] bg-transparent outline-none border-none py-[5px]' />                  
                            <input type='tel' placeholder='Phone' value={clientPhoneValue} onChange={handleClientPhone} className='w-[200px] h-[30px] p-[7px] bg-transparent outline-none border-none py-[5px]' />                  
                            <FaCircleCheck className='absolute top-0 right-0 cursor-pointer text-lg' onClick={saveNandAcontentBtn } />
                            </div>
                          </form>
                        </div>
                      }
                      
                    </div>

                      <div>
                        {displayCname && clientNameValue &&
                          <p className='w-[200px] h-[30px] p-[7px] ml-[-7px] text-sm'>{clientNameValue}</p>
                        }  
                      </div>
                      <div>
                        {displayCaddress && clientAddressValue &&
                          <p className='w-[200px] p-[7px] ml-[-7px] text-sm mt-[-9px]' >{clientAddressValue}</p>
                        }
                      </div>

                     <div>
                        {displayCemail && clientEmailValue &&
                          <p className='w-[200px]  p-[7px] ml-[-7px] text-sm mt-[-9px]' >{clientEmailValue}</p>
                        }
                      </div>

                      <div>
                        {displayCphone && clientPhoneValue &&
                          <p className='w-[200px] p-[7px] ml-[-7px] text-sm mt-[-9px]' >{clientPhoneValue}</p>
                        }
                      </div>


                    </div>

                    <div className='flex  gap-[50px]'>
                        <div >
                          <h1 className=' font-bold text-sm mb-[10px]'>Invoice #</h1>
                          <h1 className=' font-bold text-sm mb-[10px]'>Invoice Date</h1>
                          <div className='flex gap-[10px]  w-[100px] mt-[15px] items-center'>
                            <h1 className='font-semibold text-sm'>Due Date</h1>
                            <div>
                              {showEdtBtn &&
                                <FiEdit3 onClick={()=>setShowEditDate(!showEditDate) } className='cursor-pointer'/>
                              }
                            </div>
                          </div>
                            <input type="date" name="" value={dueDateValue} className={`${showEditDate && dueDateValue ? 'hidden': 'block'}`} onChange={handleDateChange} />
                        </div>
                        <div>
                          <p className=' font-thin text-sm mb-[10px]'>{invBinitials}{invoiceNumberValue}</p>
                          <p className=' font-thin text-sm mb-[10px]'>{invoiceIssueDate}</p>
                          <p className=' font-thin text-sm mb-[10px]'>{dueDateValue }</p>
                        </div>
                    </div>
                </div>


                <div className='relative mt-[50px] z-10'>
                   {showEdtBtn && <FaCirclePlus onClick={handleDisplayAddItemModal} className='absolute top-[25px] right-[-38px] text-xl cursor-pointer' />}
                  <table className='w-[692px]'>
                    <thead className='  border-b-2 border-t-2 border-black ' style={{borderColor: customColor}} >
                      <tr className='text-left'>
                        <th className='pl-[10px] py-[10px]'>Item Description</th>
                        <th className='px-[10px] py-[10px]'>Qty</th>
                        <th className='px-[10px] py-[10px]'>Price</th>
                        <th className='pl-[10px] py-[10px] text-right '>Amount</th>
                      </tr>
                    </thead>
                   
                    <tbody>
                          {itemData.map((item,index)=> {
                              const itemPrice = new Intl.NumberFormat('en-US', {style:'decimal', minimumFractionDigits:2, maximumFractionDigits:2}).format(item.itemPrice);
                              const itemPrice2 = parseInt(item.itemPrice)
                              const itemQty = parseInt(item.itemQty)
                              const total = new Intl.NumberFormat('en-US', {style:'decimal', minimumFractionDigits:2, maximumFractionDigits:2}).format(itemPrice2*itemQty);
                              
                              

                          return(
                            <>
                              <tr key={index} className='relative mt-[10px] '>
                                <td className='py-[10px] max-w-[200px] pl-[10px]'>{item.itemDesc}</td>
                                <td className='py-[10px] px-[10px]'>{item.itemQty}</td>
                                <td className='py-[10px] px-[10px]'>{currencySymbol}{itemPrice}</td>
                                <td className='py-[10px] pl-[10px] text-right'>{currencySymbol}{total}</td>
                                {showEdtBtn && <CiCircleMinus onClick={()=> handleDeleteItem(index)} className='absolute top-[15px] right-[-30px] cursor-pointer'/>}
                              </tr>
                          </>
                          )})}
                    </tbody>


                  </table>
                </div>

                <div className='flex justify-end mt-[50px]'>
                    <div className='flex flex-col'>

                      <div>
                        <div className='mb-[20px] flex items-center justify-between text-sm'>
                          <h1 className='font-thin'>Subtotal</h1>
                          <p className='font-thin'>{currencySymbol}{theSubTotalAmount}</p>
                        </div>

                        <div className='flex items-center justify-between text-sm'>
                          <h1 className='font-thin'>Tax</h1>
                          <p className='font-thin'>{currencySymbol}{theTaxAmount}</p>
                        </div>
                      </div>

                      <div className='flex items-center mt-[30px] gap-[55px]'>
                        <h1 className='font-bold text-lg' style={{color: customColor}}>INVOICE TOTAL</h1>
                        <p className='font-bold text-lg' style={{color:customColor}}>{currencySymbol}{theTotalAmount}</p>
                      </div>


                        
                    </div>

                    
                </div>


                <div className='mt-[40px]'>
                  <p className='w-full h-[3px] bg-black' style={{backgroundColor: customColor}} ></p>

                  <div className='flex flex-col gap-[25px] mt-[20px]'>

                    <div className='w-[240px]'>
                      <h1 className='font-bold text-xl' style={{color:customColor}} >TERMS & CONDITIONS</h1>
                      <div>
                        <p ref={tNcValueRef} suppressContentEditableWarning contentEditable className=' w-[200px] p-[10px] mt-[10px] overflow-hidden scrollbar-hide' >{tNcValue}</p>
                      </div>
                    </div>

                    <div className='w-[240px]'>
                      <h1 className='font-bold text-xl' style={{color: customColor}} >PAYMENT METHOD</h1>
                      <div>
                        <p ref={paymentMValueRef} suppressContentEditableWarning contentEditable className=' w-[200px] p-[10px] mt-[10px] overflow-hidden scrollbar-hide' >{paymentMethodvalue}</p>
                      </div>
                    </div>

                    
                  </div>
                  
                </div>

            </div>
          
          </div>
        
          <div className='ml-[35%] mb-[30px]'>
            <button 
              onClick={downloadAsPDF} 
              disabled={isDownloading}
              className={`py-[8px] px-[15px] rounded-lg bg-purple-700 text-white w-[300px] hover:scale-105 hover:bg-purple-900 transition-all duration-150 ${
                isDownloading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isDownloading ? 'Generating Invoice...' :  'Download Invoice'}
            </button>
          </div>
      </div>
  
      </>
  )
}

export default InvoiceTemplate3