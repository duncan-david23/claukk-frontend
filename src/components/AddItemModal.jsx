import React from 'react'
import { useInvoice } from '../contexts/InvoiceContext'
import { IoMdCloseCircle } from "react-icons/io";

const AddItemModal = () => {


    
    const {setDisplayAddItemModal,clientEmailValue,clientPhoneValue, invoiceData, currencySymbol, dueDateDays, setInvoiceData,itemValues, setItemValues,invoiceStatus, setItemData, businessData,invoiceIssueDate, setInvoiceIssueDate, setBusinessdata, showEdtBtn, invoiceTotal, invoiceSubTotal, taxAmount, setShowEdtBtn, dueDateValue, setDueDateValue, paymentMethodvalue, setPaymentMethodvalue, clientAddressValue, setClientAddressValue,clientNameValue, setClientNameValue, tNcValue, setTnCvalue,invoiceNumberValue, setInvoiceNumberValue,displayAddItemModal} = useInvoice();
    
    
   const currntDate = new Date().toISOString().split('T')[0];
    const usrId = localStorage.getItem('usrid') || '';


    // difference in days calculation for due date
  const updateCurrentDate = new Date(currntDate)
  const updateDueDate = new Date(dueDateValue)
  const dateDiff = updateDueDate - updateCurrentDate
  const diffInDays = dateDiff / (1000 * 60 * 60 * 24);

    const handleItemValues = (e)=> {
        setItemValues({
            ...itemValues,
            [e.target.name]: e.target.value
        });


        setInvoiceData({
            invoice_number: invoiceNumberValue,
            date_issued: currntDate,
            client_name: clientNameValue,
            client_details: clientAddressValue,
            client_email: clientEmailValue,
            client_phone: clientPhoneValue,
            invoice_status: invoiceStatus,
            due_date: dueDateValue,
            due_date_days: diffInDays,
            user_id: usrId,
          })
    }

    const handleCloseModal = ()=> {
        setDisplayAddItemModal(false)
    }

    const handleAddItem = (e)=> {
        e.preventDefault();
        setItemData((prev)=> [...prev,itemValues] );
        setDisplayAddItemModal(false);
        setItemValues('')
    }

  return (
    <div className='fixed  top-0 right-0 left-0 bottom-0 w-[100%] h-[100%] z-50' style={{background: 'rgba(0,0,0,0.5)'}}>

            <div className='absolute  lg:top-[25%] lg:left-[40%] md:top-[15%] md:left-[30%] w-[500px] h-fit p-[20px] bg-white rounded-lg z-60'>
                <form onSubmit={handleAddItem} className='relative'>
                <IoMdCloseCircle onClick={handleCloseModal} className='absolute top-[-22px] right-[-22px] text-lg cursor-pointer' />
                    <div className='flex flex-col gap-[5px]'>
                        <label htmlFor="itemDesc">Item Description</label>
                        <input type="text" name='itemDesc' required value={itemValues.itemDesc} onChange={handleItemValues} className='border border-gray-400 w-[300px] p-[10px] outline-none rounded-xl'/>
                    </div>

                  <div className='flex gap-[30px] mt-[25px] items-center'>
                    <div className='flex flex-col gap-[5px] '>
                        <label htmlFor="itemQty">Item Quantity</label>
                        <input type="number" name='itemQty' required value={itemValues.itemQty} onChange={handleItemValues} className='border border-gray-400 w-[150px] p-[10px] outline-none rounded-xl'/>
                    </div>
                    <div className='flex flex-col gap-[5px]'>
                        <label htmlFor="itemPrice">Item Price ({currencySymbol})</label>
                        <input type="number" name='itemPrice' required value={itemValues.itemPrice} onChange={handleItemValues} className='border border-gray-400 w-[150px] p-[10px] outline-none rounded-xl'/>
                    </div>
                  </div>

                  <div className='flex flex-col gap-[5px] mt-[25px]'>
                        <label htmlFor="taxAmount">Tax(%)</label>
                        <span className='text-gray-400 text-xs mt-[-5px]'>(Optional)</span> 
                        <input type="text"  name='taxAmount' value={itemValues.taxAmount} onChange={handleItemValues} className='border border-gray-400 w-[150px] p-[10px] outline-none rounded-xl'/>
                    </div>

                    <div>
                        <button type="submit" className='bg-violet-600 text-white py-[8px] px-[10px] w-full text-center mt-[25px] hover:bg-violet-700 rounded-lg'>Add Item</button>
                    </div>
                    
                </form>
            </div>
    </div>
  )
}

export default AddItemModal