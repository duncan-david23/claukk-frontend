import React, {createContext, useState, useEffect, useContext} from 'react'
import axios from 'axios'
import {CURRENCY_SYMBOLS} from '../assets/data'
import { supabase } from '../components/supabase';


const InvoiceContext = createContext();

export const InvoiceProvider = ({children}) => {
    const [showEdtBtn, setShowEdtBtn] = useState(true)
    const [dueDateValue, setDueDateValue] = useState('')
    const [dueDateDays, setDueDateDays] = useState('')
    const [clientAddressValue, setClientAddressValue] = useState('');
    const [clientNameValue, setClientNameValue] = useState('');
    const [clientEmailValue, setClientEmailValue] = useState('');
    const [clientPhoneValue, setClientPhoneValue] = useState('');
    const [activePlan, setActivePlan] = useState('free');
    const [donationAmount, setDonationAmount] = useState(0);
    const [customColor, setCustomColor] = useState('#000000');
    const [targetDeleteId, setTargetDeleteId] = useState()
    const [isLoading, setIsLoading] = useState(false)
    
    const [invoiceInitials, setInvoiceInitials] = useState('');
    const [tNcValue, setTnCvalue] = useState('Write Something');
    const [invoiceStatus, setInvoiceStatus] = useState('unpaid');
    const [paymentMethodvalue, setPaymentMethodvalue] = useState('Enter payment method details');
    const [invoiceTotal, setInvoiceTotal] = useState(0);
    const [invoiceIssueDate, setInvoiceIssueDate] = useState(0);
    const [invoiceSubTotal, setInvoiceSubTotal] = useState(0);
    const [taxAmount, setTaxAmount] = useState(0);
    const [userId, setUserId] = useState('');
    const [businessData, setBusinessdata] = useState();
    const [bissData, setBissdata] = useState();
    const [displayAddItemModal, setDisplayAddItemModal] = useState(false);
    const [displayConfirmModal, setDisplayConfirmModal] = useState(false);
    const [displayConfirmClientDeleteModal, setDisplayConfirmClientDeleteModal] = useState(false);
    const [confirmStatus, setConfirmStatus] = useState(false)
    const [displayTemplatesModal, setDisplayTemplatesModal] = useState(false);
    const [displayUpdateClientDataModal, setDisplayUpdateClientDataModal] = useState(false);
    const [displayBpsModal, setDisplayBpsModal] = useState(false);
    const [clientId, setClientId] = useState('')
    const [displayPsModal, setDisplayPsModal] = useState(false);
    const [displaySubscriptionModal, setDisplaySubscriptionModal] = useState(false);
    const [displayUpsModal, setDisplayUpsModal] = useState(false);
    const [displayDonateModal, setDisplayDonateModal] = useState(false);
    const [currency, setCurrency] = useState(' ');
     const [currencySymbol, setCurrencySymbol] = useState(' ');
    const [displayReminderModal, setDisplayReminderModal] = useState(false);
    const [displayContactUsModal, setDisplayContactUsModal] = useState(false);
    const [itemValues, setItemValues] = useState({
        itemDesc: '',
        itemQty: '',
        itemPrice: '',
        taxAmount: 0
    })
    const [invoiceData, setInvoiceData] = useState({
        date_issued: '',
        client_name: '',
        client_details: '',
        client_email: '',
        client_phone: '',
        invoice_status: '',
        due_date: '',
        user_id: '',
      })

       const [formValues, setFormValues] = useState({
        bsname: '',
        bsindustry: '',
        bsmail: '',
        bsaddress: '',
        bsnumber: '',
        bsnumber2: '',
        bswebsite_url: '',
        bs_id: '',
        bscolor:'#000000',
        currency: 'GHS' // Default currency
    });

    const [itemData, setItemData] = useState([])

    const subtotalAmount = itemData.reduce(
        (total, item) => total + parseInt(item.itemQty || 0) * parseFloat(item.itemPrice || 0),
        0
    );

    
    
    
    const taxAmt = itemData.reduce((total, item) => {
        const itemTax = parseFloat(item.taxAmount || 0) / 100; // Tax as a decimal
        const itemSubtotal = parseInt(item.itemQty || 0) * parseFloat(item.itemPrice || 0);
        return total + itemSubtotal * itemTax; 
    }, 0);
    

    useEffect(()=> {
        setInvoiceSubTotal(subtotalAmount);
        setTaxAmount(taxAmt)
        setInvoiceTotal(subtotalAmount + taxAmt)
        
    },[subtotalAmount, taxAmt])

    const usrId = localStorage.getItem('userId')
    


useEffect(() => {
  const fetchCurrency = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const accessToken = session?.access_token;

      if (!usrId) {
        console.warn("usrId is not ready yet");
        return;
      }

      const response = await axios.get(`https://claukk-backend.onrender.com/api/users/currency/${usrId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const result = response.data;
      if (!result || !result.data) {
        console.warn("No currency data found");
        return;
      }
      setCurrency(result.data.currency);
      setCurrencySymbol(CURRENCY_SYMBOLS[result.data.currency] || result.data.currency);

    } catch (error) {
      console.error('Error fetching currency:', error);
    }
  };

  fetchCurrency();
}, [usrId]); // rerun effect when usrId becomes available

    

    useEffect(() => {
        const fetchBizData = async () => {
           
            const userId = localStorage.getItem('userId');
            const { data: { session } } = await supabase.auth.getSession()
            const accessToken = session?.access_token

            if (!userId) {
                console.warn("User ID is not available");
                return;
            }

            try {
                const result = await axios.get(`https://claukk-backend.onrender.com/api/users/bsprofile/${userId}`, {
                    headers: {
                    Authorization: `Bearer ${accessToken}`, // add token to request
                    },
                });

                
                if (result.data.data) {
                    setBusinessdata(result.data.data);
                    localStorage.setItem('business_name', result.data.data.bsname);
                    setFormValues({
                        bsname: result.data.data.bsname || '',
                        bsindustry: result.data.data.bsindustry || '',
                        bsmail: result.data.data.bsmail || '',
                        bsaddress: result.data.data.bsaddress || '',
                        bsnumber: result.data.data.bsnumber || '',
                        bsnumber2: result.data.data.bsnumber2 || '',
                        bswebsite_url: result.data.data.bswebsite_url || '',
                        currency: result.data.data.currency || 'GHS'
                    });
                }
            } catch (error) {
                console.error("Error fetching business profile:", error);
            } 
        };

        fetchBizData();
    }, [userId]);
    
    
    
    
    
    const dataValues = {
        showEdtBtn, 
        currency, 
        setCurrency,
        setShowEdtBtn,
        dueDateValue, 
        setDueDateValue,
        currencySymbol, 
        setCurrencySymbol,
        invoiceTotal, 
        setInvoiceTotal,
        invoiceSubTotal, 
        setInvoiceSubTotal,
        displayAddItemModal, 
        setDisplayAddItemModal,
        itemValues, 
        setItemValues,
        itemData, 
        setItemData,
        tNcValue, 
        setTnCvalue,
        paymentMethodvalue, 
        setPaymentMethodvalue,
        taxAmount, 
        setTaxAmount,
        clientAddressValue, 
        setClientAddressValue,
        clientNameValue, 
        setClientNameValue,
        displayBpsModal, 
        setDisplayBpsModal,
        displayPsModal,
        setDisplayPsModal,
        displayUpsModal, 
        setDisplayUpsModal,
        userId, 
        setUserId,
        businessData, 
        setBusinessdata,
        invoiceIssueDate, 
        setInvoiceIssueDate,
        invoiceStatus, 
        setInvoiceStatus,
        invoiceData, 
        setInvoiceData,
        dueDateDays, 
        setDueDateDays,
        invoiceInitials, 
        setInvoiceInitials,
        clientPhoneValue, 
        setClientPhoneValue,
        clientEmailValue, 
        setClientEmailValue,
        displayUpdateClientDataModal, 
        setDisplayUpdateClientDataModal,
        clientId, 
        setClientId,
        displayReminderModal, 
        setDisplayReminderModal,
        displayTemplatesModal, 
        setDisplayTemplatesModal,
        displaySubscriptionModal, 
        setDisplaySubscriptionModal,
        activePlan, 
        setActivePlan,
        displayDonateModal, 
        setDisplayDonateModal,
        donationAmount, 
        setDonationAmount,
        formValues, 
        setFormValues,
        customColor, 
        setCustomColor,
        displayConfirmModal, 
        setDisplayConfirmModal,
        confirmStatus, 
        setConfirmStatus,
        targetDeleteId, setTargetDeleteId,
        displayConfirmClientDeleteModal, setDisplayConfirmClientDeleteModal,
        displayContactUsModal, setDisplayContactUsModal,
        isLoading, setIsLoading
    }


    return (

        <InvoiceContext.Provider value={dataValues}>
            {children}
        </InvoiceContext.Provider>


    )
}


export const useInvoice = ()=> useContext(InvoiceContext);