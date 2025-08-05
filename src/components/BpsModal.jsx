import React, { useState, useEffect } from 'react';
import { IoMdCloseCircle } from "react-icons/io";
import { motion } from 'framer-motion';
import { useInvoice } from '../contexts/InvoiceContext';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import { supabase } from './supabase';

// Currency data with symbols
const CURRENCIES = [
  { code: 'GHS', name: 'Ghanaian Cedi', symbol: 'GH₵' },
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'NGN', name: 'Nigerian Naira', symbol: '₦' },
  { code: 'KES', name: 'Kenyan Shilling', symbol: 'KSh' },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R' },
];

const BpsModal = ({ onClose }) => {
    const { displayBpsModal, setDisplayBpsModal, formValues, setFormValues, setCustomColor } = useInvoice();
    const [msg, setMsg] = useState('');
    const [businessData, setBusinessdata] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);

    const userId = localStorage.getItem('userId');
    const notify = () => toast.success('Profile Updated Successfully');

   

    const handleFormChange = (e) => {
        setFormValues({
            ...formValues,
            [e.target.name]: e.target.value
        });

       
    };

    const handleCurrencySelect = (currency) => {
        setFormValues({
            ...formValues,
            currency: currency.code
        });
        setShowCurrencyDropdown(false);
    };

   

  const handleFormSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

  try {
    const { data: { session } } = await supabase.auth.getSession()
    const accessToken = session?.access_token

    const result = await axios.put(
      `https://claukk-backend.onrender.com/api/users/bsprofile/${userId}`,
      formValues,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`, // add token to request
        },
      }
    );

    setBusinessdata(result.data.data);
    localStorage.setItem('business_name', result.data.data.bsname);
    setCustomColor( result.data.data.bscolor)
    notify();
    window.location.assign('https://claukkinvoice.netlify.app/dashboard');
  } catch (error) {
    toast.error('Error updating profile');
    console.error('Error updating profile:', error);
  } finally {
    setIsLoading(false);
  }
};



    useEffect(() => {
        const fetchBizData = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            const accessToken = session?.access_token


            setIsLoading(true);
            try {
                const result = await axios.get(`https://claukk-backend.onrender.com/api/users/bsprofile/${userId}`, {
                    headers: {
                    Authorization: `Bearer ${accessToken}`, // add token to request
                    },
                });

                if (result.data.data) {
                    localStorage.setItem('business_name', result.data.data.bsname);
                    setBusinessdata(result.data.data);
                    setFormValues({
                        bsname: result.data.data.bsname || '',
                        bsindustry: result.data.data.bsindustry || '',
                        bsmail: result.data.data.bsmail || '',
                        bsaddress: result.data.data.bsaddress || '',
                        bsnumber: result.data.data.bsnumber || '',
                        bsnumber2: result.data.data.bsnumber2 || '',
                        bswebsite_url: result.data.data.bswebsite_url || '',
                        currency: result.data.data.currency || 'GHS',
                        bscolor: result.data.data.bscolor || '#000000'
                    });
                    setCustomColor(bscolor)
                }
            } catch (error) {
                console.error("Error fetching business profile:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchBizData();
    }, [userId]);

    

    const handleClose = (e) => {
        e.stopPropagation();
        onClose();
    };

    const selectedCurrency = CURRENCIES.find(c => c.code === formValues.currency) || CURRENCIES[0];

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        >
            <motion.div 
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                className="bg-white rounded-xl shadow-2xl w-full max-w-4xl lg:h-[600px] md:h-[400px]  overflow-auto scrollbar-hide scrollbar-hide::-webkit-scrollbar"
            >
                <div className="flex justify-between items-center p-6 border-b border-gray-100">
                    <h1 className="text-2xl font-bold text-purple-700">Business Profile Settings</h1>
                    <button 
                        onClick={handleClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <IoMdCloseCircle size={24} />
                    </button>
                </div>

                <div className="grid md:grid-cols-2 divide-x divide-gray-100">
                    {/* Form Section */}
                    <div className="p-6">
                        <form onSubmit={handleFormSubmit}>
                            <div className="space-y-6">
                                <motion.div 
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.1 }}
                                    className="space-y-1"
                                >
                                    <label htmlFor="bsname" className="block text-sm font-medium text-gray-700">Business Name</label>
                                    <input
                                        type="text"
                                        name="bsname"
                                        value={formValues.bsname}
                                        onChange={handleFormChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                                        required
                                    />
                                </motion.div>

                                <motion.div 
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.15 }}
                                    className="space-y-1"
                                >
                                    <label htmlFor="bsindustry" className="block text-sm font-medium text-gray-700">Business Industry</label>
                                    <input
                                        type="text"
                                        name="bsindustry"
                                        placeholder="e.g., Fashion, Technology"
                                        value={formValues.bsindustry}
                                        onChange={handleFormChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                                    />
                                </motion.div>

                                {/* Currency Selector */}
                                <motion.div 
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.175 }}
                                    className="space-y-1 relative"
                                >
                                    <label className="block text-sm font-medium text-gray-700">Currency</label>
                                    <button
                                        type="button"
                                        onClick={() => setShowCurrencyDropdown(!showCurrencyDropdown)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg text-left flex justify-between items-center hover:bg-gray-50"
                                    >
                                        <span>
                                            {selectedCurrency.code} - {selectedCurrency.name} ({selectedCurrency.symbol})
                                        </span>
                                        <svg
                                            className={`h-5 w-5 text-gray-400 transform transition-transform ${
                                                showCurrencyDropdown ? 'rotate-180' : ''
                                            }`}
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </button>

                                    {showCurrencyDropdown && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-lg py-1 max-h-60 overflow-auto border border-gray-200"
                                        >
                                            {CURRENCIES.map((currency) => (
                                                <div
                                                    key={currency.code}
                                                    onClick={() => handleCurrencySelect(currency)}
                                                    className={`px-4 py-2 cursor-pointer hover:bg-purple-50 ${
                                                        formValues.currency === currency.code ? 'bg-purple-100' : ''
                                                    }`}
                                                >
                                                    {currency.code} - {currency.name} ({currency.symbol})
                                                </div>
                                            ))}
                                        </motion.div>
                                    )}
                                </motion.div>

                                <motion.div 
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="space-y-1"
                                >
                                    <label htmlFor="bsmail" className="block text-sm font-medium text-gray-700">Business Email</label>
                                    <input
                                        type="email"
                                        name="bsmail"
                                        placeholder="info@example.com"
                                        value={formValues.bsmail}
                                        onChange={handleFormChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                                    />
                                </motion.div>

                                <motion.div 
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.25 }}
                                    className="space-y-1"
                                >
                                    <label htmlFor="bsaddress" className="block text-sm font-medium text-gray-700">TIN (Tax Identification Number) </label>
                                    <input
                                        type="text"
                                        name="bs_id"
                                        value={formValues.bs_id}
                                        placeholder='eg.GHA-1234567890'
                                        onChange={handleFormChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                                    />
                                </motion.div>

                                <motion.div 
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.25 }}
                                    className="space-y-1"
                                >
                                    <label htmlFor="bsaddress" className="block text-sm font-medium text-gray-700">Business Address</label>
                                    <input
                                        type="text"
                                        name="bsaddress"
                                        value={formValues.bsaddress}
                                        onChange={handleFormChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                                    />
                                </motion.div>

                                <div className="grid grid-cols-2 gap-4">
                                    <motion.div 
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.3 }}
                                        className="space-y-1"
                                    >
                                        <label htmlFor="bsnumber" className="block text-sm font-medium text-gray-700">Phone Number</label>
                                        <input
                                            type="tel"
                                            name="bsnumber"
                                            value={formValues.bsnumber}
                                            onChange={handleFormChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                                        />
                                    </motion.div>

                                    <motion.div 
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.35 }}
                                        className="space-y-1"
                                    >
                                        <label htmlFor="bsnumber2" className="block text-sm font-medium text-gray-700">Alternate Phone <span className="text-xs text-gray-500">(Optional)</span></label>
                                        <input
                                            type="tel"
                                            name="bsnumber2"
                                            value={formValues.bsnumber2}
                                            onChange={handleFormChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                                        />
                                    </motion.div>
                                </div>

                                <motion.div 
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.4 }}
                                    className="space-y-1"
                                >
                                    <label htmlFor="bswebsite_url" className="block text-sm font-medium text-gray-700">Website URL <span className="text-xs text-gray-500">(Optional)</span></label>
                                    <input
                                        type="text"
                                        name="bswebsite_url"
                                        placeholder="www.example.com"
                                        value={formValues.bswebsite_url}
                                        onChange={handleFormChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                                    />
                                </motion.div>

                                <motion.div 
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.4 }}
                                    className="space-y-1 relative"
                                    >
                                        <p className='text-gray-500 mb-[15px] font-thin'>Choose Invoice Theme</p>
                                    <label htmlFor="bscolor">
                                        <span
                                        style={{
                                            backgroundColor: formValues.bscolor,
                                            padding: '10px',
                                            borderRadius: '20px',
                                            width: '100px',
                                            height: '40px',
                                            display: 'inline-block',
                                            cursor: 'pointer',
                                        }}
                                        />
                                    </label>

                                    <input
                                        type="color"
                                        name="bscolor"
                                        id="bscolor"
                                        value={formValues.bscolor}
                                        onChange={handleFormChange}
                                        className="absolute top-0 left-0 opacity-0 w-[100px] h-[40px] cursor-pointer"
                                    />
                                    </motion.div>


                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.5 }}
                                    className="pt-4"
                                >
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-all ${isLoading ? 'bg-purple-400' : 'bg-purple-600 hover:bg-purple-700'} shadow-md hover:shadow-lg`}
                                    >
                                        {isLoading ? (
                                            <span className="flex items-center justify-center">
                                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Saving...
                                            </span>
                                        ) : 'Save Changes'}
                                    </button>
                                </motion.div>
                            </div>
                        </form>
                    </div>

                    {/* Preview Section */}
                    <div className="p-6 bg-gray-50">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">Current Profile</h2>
                        
                        {businessData ? (
                            <div className="space-y-5">
                                <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-100">
                                    <h3 className="text-xs font-semibold text-purple-600 uppercase tracking-wider">Business Name</h3>
                                    <p className="mt-1 text-gray-800">{businessData.bsname || 'Not provided'}</p>
                                </div>

                                <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-100">
                                    <h3 className="text-xs font-semibold text-purple-600 uppercase tracking-wider">TIN</h3>
                                    <p className="mt-1 text-gray-800">{businessData.bs_id || 'Not provided'}</p>
                                </div>

                                <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-100">
                                    <h3 className="text-xs font-semibold text-purple-600 uppercase tracking-wider">Industry</h3>
                                    <p className="mt-1 text-gray-800">{businessData.bsindustry || 'Not provided'}</p>
                                </div>

                                <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-100">
                                    <h3 className="text-xs font-semibold text-purple-600 uppercase tracking-wider">Currency</h3>
                                    <p className="mt-1 text-gray-800">
                                        {businessData.currency ? 
                                            `${businessData.currency} - ${CURRENCIES.find(c => c.code === businessData.currency)?.name || ''}` : 
                                            'Not provided'}
                                    </p>
                                </div>

                                <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-100">
                                    <h3 className="text-xs font-semibold text-purple-600 uppercase tracking-wider">Contact</h3>
                                    <div className="mt-1 space-y-1">
                                        <p className="text-gray-800">{businessData.bsmail || 'Email not provided'}</p>
                                        <p className="text-gray-800">{businessData.bsnumber || 'Phone not provided'}</p>
                                        {businessData.bsnumber2 && <p className="text-gray-800">{businessData.bsnumber2}</p>}
                                    </div>
                                </div>

                                <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-100">
                                    <h3 className="text-xs font-semibold text-purple-600 uppercase tracking-wider">Address</h3>
                                    <p className="mt-1 text-gray-800">{businessData.bsaddress || 'Not provided'}</p>
                                </div>

                                <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-100">
                                    <h3 className="text-xs font-semibold text-purple-600 uppercase tracking-wider">Invoice Theme</h3>
                                    <p style={{
                                            backgroundColor: formValues.bscolor,
                                            padding: '10px',
                                            borderRadius: '20px',
                                            width: '40px',
                                            height: '40px',
                                            display: 'inline-block',
                                            cursor: 'pointer',
                                            marginTop:'15px'
                                        }}></p>
                                </div>

                                {businessData.bswebsite_url && (
                                    <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-100">
                                        <h3 className="text-xs font-semibold text-purple-600 uppercase tracking-wider">Website</h3>
                                        <a 
                                            href={`https://${businessData.bswebsite_url}`} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="mt-1 text-purple-600 hover:underline"
                                        >
                                            {businessData.bswebsite_url}
                                        </a>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-full">
                                <div className="text-center">
                                    <div className="animate-pulse">
                                        <div className="h-8 w-3/4 bg-gray-200 rounded mx-auto mb-4"></div>
                                        <div className="h-4 w-1/2 bg-gray-200 rounded mx-auto"></div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>
            <Toaster position="top-right" />
        </motion.div>
    );
};

export default BpsModal;