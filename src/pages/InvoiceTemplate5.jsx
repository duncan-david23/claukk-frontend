import React, {useRef, useState, useEffect} from 'react'
import Sidebar from '../components/Sidebar'
import { IoIosCall } from "react-icons/io";
import { IoIosMail } from "react-icons/io";
import { FaLocationDot } from "react-icons/fa6";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import html2pdf from "html2pdf.js";
import { FiEdit3 } from "react-icons/fi";
import { FaCirclePlus } from "react-icons/fa6";
import { useInvoice } from '../contexts/InvoiceContext';
import { CiCircleMinus } from "react-icons/ci";
import axios from 'axios'
import { FaCircleCheck } from "react-icons/fa6";
import { supabase } from '../components/supabase';




const InvoiceTemplate5 = () => {
  const containerRef = useRef();
  const {itemData, clientPhoneValue, customColor, setCustomColor, setClientPhoneValue, currencySymbol, clientEmailValue, setClientEmailValue,invoiceStatus,invoiceInitials, setInvoiceInitials,setDueDateDays, dueDateDays, invoiceData, setItemData, businessData,invoiceIssueDate, setInvoiceIssueDate, setBusinessdata, showEdtBtn, invoiceTotal, invoiceSubTotal, taxAmount, setShowEdtBtn, dueDateValue, setDueDateValue, paymentMethodvalue, setPaymentMethodvalue, clientAddressValue, setClientAddressValue,clientNameValue, setClientNameValue, tNcValue, setTnCvalue,displayAddItemModal, setDisplayAddItemModal} = useInvoice();
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
  
  const usrId = localStorage.getItem('userId') || '';
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

          const response = await axios.post(`https://claukk-backend.onrender.com/api/users/invoice-details/${usrId}`,formDataValues, {
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
 },[usrId])

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
        const result = await axios.get(`https://claukk-backend.onrender.com/api/users/bsprofile/${usrId}`, {
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
},[usrId, invoiceNumberValue])
  



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
          const result = await axios.get(`https://claukk-backend.onrender.com/api/users/clients-data/${usrId}`, {
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
  },[usrId])

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
                const result = await axios.get(`https://claukk-backend.onrender.com/api/users/bsprofile/${usrId}`, {
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
    }, [usrId]);


  return (
    <>
    <Sidebar/>
      <div className='md:ml-[-120px] lg:ml-[1px]'>
          
          <div className=' flex justify-center items-center my-[50px]'>
            
            <div  ref={containerRef} className='container w-[793px] h-fit bg-white shadow-lg py-[20px]'>
              {/* header contents */}
                <div className='flex items-center '>
                    <p className='h-[2px] bg-black flex-1' style={{backgroundColor:customColor}}></p>
                      <div className='bg-black py-[10px] px-[7px] text-gray-300 w-[400px] text-center' style={{backgroundColor:customColor}}>
                          <h1 className='text-lg tracking-widest'>{businessData?.bsname || '-' }</h1>
                          <p className='text-sm text-thin  tracking-widest'>{businessData?.bsindustry ||'-'}</p>
                      </div>
                    <p className='h-[2px] bg-black flex-1' style={{backgroundColor:customColor}}></p>
                </div>

                {/* Contact info */}

                <div className='px-[50px] mt-[30px] flex justify-center gap-[70px]'>
                    <div className='flex flex-col items-center'>
                        <IoIosCall className='text-xl mb-[5px]' />
                        <p className='tracking-wider text-xs'>{businessData?.bsnumber || '-' }</p>
                        <p className='tracking-wider text-xs'>{businessData?.bsnumber2 || '-' }</p>
                    </div>
                    <div className='flex flex-col items-center'>
                        <IoIosMail  className='text-xl mb-[5px]' />
                        <p className='tracking-wider text-xs'>{businessData?.bsmail || '-' }</p>
                        
                    </div>
                    <div className='flex flex-col items-center'>
                        <FaLocationDot  className='text-xl mb-[5px]' />
                        <p className='tracking-wider text-xs'>{businessData?.bsaddress || '-' }</p>
                        
                    </div>
                </div>

                {/* invoice details */}
                
                <div className='flex items-center mt-[40px]'>
                    <div className='pt-[10px] flex gap-[20px] items-center justify-center bg-black text-gray-300 flex-1 text-center' style={{backgroundColor:customColor}} >
                        <p className='text-lg tracking-wide font-thin mb-[10px]'>Total Amount</p>
                        <p className=' tracking-wide font-semibold text-lg mb-[10px]'>{currencySymbol}{theTotalAmount}</p>
                    </div>

                    <div className='flex flex-col gap-[3px] mt-[-35px] '>
                        <p className='tracking-wider text-thin text-4xl text-right mr-[80px] mb-[12px]' style={{color:customColor}}>Invoice</p>
                        <p className='h-[2px] bg-black w-[450px]' style={{backgroundColor:customColor}}></p>
                    </div>
                </div>

                <div className='flex justify-between  mt-[30px] px-[50px]'>
                    <div className=''>
                          <div className='flex items-center gap-[15px]'>
                              <p className='font-bold'>Inv #:</p>
                              <p className='font-thin text-sm tracking-wider'>{invBinitials}{invoiceNumberValue}</p>
                          </div>
                          <div className='flex items-center gap-[15px]'>
                              <p className='font-bold tracking-wider'>Date:</p>
                              <p className='font-thin text-sm tracking-wider'>{invoiceIssueDate}</p>
                          </div>
                    </div>

                    <div>
                          {/* select clients data from existing clients */}
                    {showEdtBtn && 
                      <div className='flex justify-between items-center mb-[20px]'>
                        <select value={''} onChange={handleClientChange} className='p-[9px] border border-gray- bg-gray-50   rounded-md' >
                          <option value="">Select a client</option>
                          {clientInfo.map(client => (
                            <option key={client.id} value={client.name}>
                              {client.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    }
                        <div className='relative'>
                            <h1 className='font-bold text-lg'>INVOICE TO</h1>

                            {showEdtBtn && 
                              <FiEdit3 onClick={handleModal} className='text-lg cursor-pointer absolute top-0 right-[10px]'/>
                              }
                        </div>

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




                        {displayCname && clientNameValue &&
                           <p className='text-sm tracking-wider'>{clientNameValue}</p>
                         }  
                        
                        {displayCaddress && clientAddressValue &&
                          <p className='text-sm tracking-wider'>{clientAddressValue}</p>
                        }

                        {displayCemail && clientEmailValue &&
                            <p className='text-sm tracking-wider'>{clientEmailValue}</p>
                          }
                        
                        {displayCphone && clientPhoneValue &&
                          <p className='text-sm tracking-wider'>{clientPhoneValue}</p>
                        }
                        
                        

                        <div className='mt-[20px]'>
                          <div className='flex gap-[10px]  w-[190px] mt-[15px] items-center'>
                            <h1 className='font-semibold'>Due Date</h1>
                            <div>
                            {showEdtBtn &&
                              <FiEdit3 onClick={()=>setShowEditDate(!showEditDate) } className='cursor-pointer'/>
                            }
                            </div>
                          </div>
                          
                          <input type="date" name="" value={dueDateValue} className={`${showEditDate && dueDateValue ? 'hidden': 'block'}`} onChange={handleDateChange} />
                          <p className='w-[110px] ml-[-7px] text-sm p-[7px]'>{dueDateValue }</p>
                        </div>
                    </div>


                </div>


                <div className='relative mt-[35px] z-10 px-[50px]'>
                   {showEdtBtn && <FaCirclePlus onClick={handleDisplayAddItemModal} className='absolute top-[25px] right-[8px] text-xl cursor-pointer' />}
                  <table className='w-[720px]'>
                    <thead className='  border-b-2 border-black 'style={{borderColor:customColor}} >
                      <tr className='text-left'>
                        <th className='pl-[25px] pb-[10px]'>Description</th>
                        <th className='px-[10px] pb-[10px]'>Qty</th>
                        <th className='px-[10px] pb-[10px]'>Price</th>
                        <th className='px-[10px] pb-[10px]'>Amount</th>
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
                        <tr key={index} className='relative mt-[10px] border '>
                          <td className='py-[20px] max-w-[200px] pl-[25px]'>{item.itemDesc}</td>
                          <td className='py-[20px] px-[10px]'>{item.itemQty}</td>
                          <td className='py-[20px] px-[10px]'>{currencySymbol}{itemPrice}</td>
                          <td className='py-[20px] px-[10px]'>{currencySymbol}{total}</td>
                           {showEdtBtn &&<CiCircleMinus onClick={()=> handleDeleteItem(index)} className='absolute top-[55px] right-[-10px] cursor-pointer'/>}
                        </tr>
                        </>
                      )})}
                      
                
                    
                    </tbody>


                  </table>

                </div>

                <div className='flex justify-end items-center mt-[40px]'>
                    <div className=' flex flex-col gap-[10px] w-[300px]'>

                      <div className='flex items-center gap-[40px]'>
                        <h1 className='font-thin ml-[10px]'>SUB TOTAL</h1> 
                        <p className='font-semibold mr-[20px]'>{currencySymbol}{theSubTotalAmount}</p>
                      </div>
                      <div className='flex items-center gap-[100px]'>
                        <h1 className='font-thin ml-[10px]'>TAX</h1>
                        <p className='font-semibold mr-[20px]'>{currencySymbol}{theTaxAmount}</p>
                      </div>
                     
                    </div>
                   
                </div>

                <div className='flex flex-col gap-[25px] px-[50px] mt-[20px]'>
                  <div className='w-[240px]'>
                    <h1 className='font-thin text-lg' style={{color:customColor}}>PAYMENT METHOD</h1>
                    <div>
                      <p ref={paymentMValueRef} suppressContentEditableWarning contentEditable className=' w-[200px] p-[10px] mt-[10px] overflow-hidden scrollbar-hide' >{paymentMethodvalue}</p>
                    </div>
                  </div>

                  <div className='w-[240px]'>
                    <h1 className='font-thin text-lg' style={{color:customColor}}>TERMS & CONDITIONS</h1>
                    <div>
                      <p ref={tNcValueRef} suppressContentEditableWarning contentEditable className=' w-[200px] p-[10px] mt-[10px] overflow-hidden scrollbar-hide' >{tNcValue}</p>
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

export default InvoiceTemplate5