import React, { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'
import { useParams } from 'react-router-dom'
import { useInvoice } from '../contexts/InvoiceContext'
import LineChart from '../components/LineChart'
import axios from 'axios'
import { IoIosNotifications } from "react-icons/io";
import { FiTrendingUp, FiDollarSign, FiAlertCircle } from "react-icons/fi";
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../components/supabase'


const Dashboard = () => {
  const [issuedDates, setIssuedDates] = useState([])
  const [issuedInvoiceAmounts, setIssuedInvoiceAmounts] = useState([])
  const [totalRevenue, setTotalRevenue] = useState()
  const [paidRevenue, setPaidRevenue] = useState()
  const [unpaidRevenue, setUnpaidRevenue] = useState()
  const [overdueRevenue, setOverdueRevenue] = useState()
  const [overdueInvoiceArray, setOverdueInvoiceArray] = useState([])
  const [paidInvoiceArray, setPaidInvoiceArray] = useState([])
  const [totalInvoiceIssued, setTotalInvoiceIssued] = useState()
  // Changed notificationMessage to notificationMessages (an array)
  const [notificationMessages, setNotificationMessages] = useState([]) 
  const [allDueDaysData, setAllDueDaysData] = useState([])
  const [rawTotals, setRawTotals] = useState({
  total: 0,
  paid: 0,
  overdue: 0,
  unpaid: 0,
});
 
const [formattedTotals, setFormattedTotals] = useState({
    total: '0.00',
    paid: '0.00',
    unpaid: '0.00',
    overdue: '0.00',
  });


  const {currencySymbol, currency, setDisplayDonateModal, setDisplayBpsModal} = useInvoice()

  const userId = localStorage.getItem('userId')

  // Currency formatter
  const formatCurrency = (value) => {
    if (!value) return `${currencySymbol}0.00`;
    if (value >= 1_000_000_000) return `${currencySymbol}${(value / 1_000_000_000).toFixed(2)}b`;
    if (value >= 1_000_000) return `${currencySymbol}${(value / 1_000_000).toFixed(2)}m`;
    if (value >= 1_000) return `${currencySymbol}${(value / 1_000).toFixed(2)}k`;
    return `${currencySymbol}${value.toFixed(2)}`;
  };
  

   useEffect(() => {
    const fetchInvoiceData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const accessToken = session?.access_token;

      try {
        const { data } = await axios.get(`https://claukk-backend.onrender.com/api/users/invoice-details/${userId}`, {
          headers: { Authorization: `Bearer ${accessToken}` }
        });

        const invoices = data?.data || [];
        setTotalInvoiceIssued(invoices.length);

        const paid = invoices.filter(i => i.invoice_status === 'paid');
        const partPaid = invoices.filter(i => i.invoice_status === 'partpayment');
        const overdue = invoices.filter(i => i.invoice_status === 'overdue');

        const paidAmount = paid.reduce((sum, i) => sum + parseFloat(i.invoice_amount || 0), 0);
        const partPaidAmount = partPaid.reduce((sum, i) => sum + parseFloat(i.part_payment_amount || 0), 0);
        const overdueAmount = overdue.reduce((sum, i) => sum + parseFloat(i.invoice_amount || 0), 0);
        const allAmount = invoices.reduce((sum, i) => sum + parseFloat(i.invoice_amount || 0), 0);
        const unpaidAmount = allAmount - (paidAmount + partPaidAmount + overdueAmount);
        const totalAmount = allAmount;

        setRawTotals({
          total: totalAmount,
          paid: paidAmount + partPaidAmount,
          unpaid: unpaidAmount,
          overdue: overdueAmount,
        });

        // Chart accumulation
        const grouped = invoices.reduce((acc, i) => {
          const date = i.date_issued;
          acc[date] = (acc[date] || 0) + parseFloat(i.invoice_amount || 0);
          return acc;
        }, {});
        const sortedDates = Object.keys(grouped).sort();
        let runningTotal = 0;
        const formattedChartData = sortedDates.map(date => {
          runningTotal += grouped[date];
          return { date, accumulatedAmount: runningTotal.toFixed(2) };
        });

        const formattedDates = formattedChartData.map(d => {
          const dateObj = new Date(d.date);
          return dateObj.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: '2-digit'
          }).toLowerCase();
        });

        setIssuedDates(formattedDates);
        setIssuedInvoiceAmounts(formattedChartData.map(d => d.accumulatedAmount));

      } catch (err) {
        console.error('Error fetching invoices:', err);
      }
    };

    fetchInvoiceData();
  }, [userId]);


useEffect(() => {
  setFormattedTotals({
    total: formatCurrency(rawTotals.total),
    paid: formatCurrency(rawTotals.paid),
    unpaid: formatCurrency(rawTotals.unpaid),
    overdue: formatCurrency(rawTotals.overdue),
  });
}, [currencySymbol, rawTotals]);






  useEffect(() => {
    const fetchNotificationData = async () => {
       const { data: { session } } = await supabase.auth.getSession()
       const accessToken = session?.access_token

      if (!userId) { // Ensure userId exists before fetching
          console.warn("No userId available to fetch notifications.");
          return;
      }

      try {
        const response = await axios.get(`https://claukk-backend.onrender.com/api/users/notification-data/${userId}`, {
                    headers: {
                    Authorization: `Bearer ${accessToken}`, // add token to request
                    },
                });
        const result = response.data;

        // The backend now sends 'days_remaining' directly, already filtered for unpaid and relevant days.
        const fetchedInvoices = result.data;

        
        // Separate invoices based on 'days_remaining'
        const threeDaysToDueData = fetchedInvoices.filter(item => item.days_remaining === 3);
        const dueTodayData = fetchedInvoices.filter(item => item.days_remaining === 0);
        const overdueData = fetchedInvoices.filter(
          item => item.days_remaining < 0 && item.invoice_status.toLowerCase() !== 'overdue'
        ); // ⬅️ added status check


        // Combine the data if you need it elsewhere for display or further processing
        const combinedData = [
          ...threeDaysToDueData,
          ...dueTodayData,
          ...overdueData,
        ];
        setAllDueDaysData(combinedData); // Update state with filtered data

        // Build an array of notifications
        const notifications = [];

        threeDaysToDueData.forEach(item => {
          notifications.push(
            `Invoice #${item.invoice_number} for ${item.client_name} is due in 3 days. Follow up to ensure timely payment.`
          );
        });
        dueTodayData.forEach(item => {
          notifications.push(
            `Invoice #${item.invoice_number} for ${item.client_name} is due today. Follow up to ensure timely payment.`
          );
        });
        overdueData.forEach(item => {
          // You might want more specific messages for different levels of overdue
          const daysOverdue = Math.abs(item.days_remaining);
          notifications.push(
            `Invoice #${item.invoice_number} for ${item.client_name} is overdue by ${daysOverdue} day${daysOverdue !== 1 ? 's' : ''}. Please take action.`
          );
        });

        // Set the notifications array into state
        setNotificationMessages(notifications);

      } catch (error) {
        console.error("An error occurred while fetching notification data:", error);
        // Optionally, set an error message in state to display to the user
      }
    };

    fetchNotificationData();
  }, [userId]); // Re-run effect if userId changes

 

  

    useEffect(() => {
      const businessName = localStorage.getItem('business_name');
    
      if (businessName === null || businessName === '') {
        setTimeout(() => {
          setDisplayBpsModal(true);
        }, 5000);
      }
    }, []);

    
 

  return (
    <>
      <Sidebar />
      <div className='mx-[50px] mt-[50px]'>
        <div className='absolute lg:top-[20px] lg:right-[30px] top-[20px] right-[-100px]'>
          <div className='flex items-center gap-[4px] mb-[10px]'>
              <p className='w-[8px] h-[20px] bg-purple-600'></p>
              <p className='text-xs font-thin text-gray-600'>Love using the app? Help keep it free for everyone.</p>
          </div>
          <button onClick={() => setDisplayDonateModal(true)} className='py-2 px-4 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-all '>Fuel the Mission</button>
        </div>
        <div className='mt-[120px] lg:pl-[1px] md:pl-[90px] md:ml-[-200px] lg:ml-[1px] flex gap-[50px] justify-center lg:w-full'>
          <div className='w-[260px] h-[230px] lg:w-[300px] lg:h-[240px] rounded-lg border transition-all duration-150 cursor-pointer hover:shadow-md'>
            <div className='flex justify-center items-center py-[15px]'>
              <h1 className='font-thin text-xl py-[10px] px-[10px] text-center'>Total Invoice Issued</h1>
              <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                <FiTrendingUp size={20} />
              </div>
            </div>
          


            <p className='font-semibold text-3xl text-center mt-[12px] p-[10px]'>+{totalInvoiceIssued}</p>
          </div>

          <div className=' w-[260px] h-[230px] lg:w-[300px] lg:h-[240px] rounded-lg border transition-all duration-150 cursor-pointer hover:shadow-md'>
            <div className='flex justify-center items-center py-[15px]'>
              <h1 className='font-thin text-xl py-[10px] px-[10px] text-center'>Total Revenue</h1>
              <div className="p-3 rounded-full bg-green-100 text-green-600">
                <FiDollarSign size={20} />
              </div>
            </div>
            <p className='font-bold text-2xl text-center mt-[12px] p-[10px]'>{formattedTotals.total}</p>
            <div className='flex justify-between items-center mt-[10px] text-sm px-[20px]'>
              <p>Paid</p>
              <p className='font-semibold text-green-400'>{formattedTotals.paid}</p>
            </div>
            <div className='flex justify-between items-center text-sm px-[20px] py-[5px]'>
              <p>Unpaid</p>
              <p className='font-semibold text-orange-400'>{formattedTotals.unpaid}</p>
            </div>
            <div className='flex justify-between items-center text-sm px-[20px]'>
              <p>Overdue</p>
              <p className='font-semibold text-red-400'>{formattedTotals.overdue}</p>
            </div>
          </div>

          <div className='w-[260px] h-[230px] lg:w-[300px] lg:h-[240px] border rounded-lg transition-all duration-150 cursor-pointer hover:shadow-md'>
            <div className='flex justify-center items-center py-[15px]'>
              <h1 className='font-thin text-xl py-[10px] px-[10px] text-center'>Total Overdue</h1>
              <div className="p-3 rounded-full bg-red-100 text-red-600">
                <FiAlertCircle size={20} />
              </div>
            </div>
            <p className='font-bold text-2xl text-center mt-[12px] mb-[20px] p-[10px]'>{formattedTotals.overdue}</p>
          </div>
        </div>

        <div className='flex md:ml-[-50px] lg:ml-[1px] gap-[30px] justify-center w-full h-[500px] mt-[70px]'>
          <div>
            <div className='flex-2 md:w-[500px] lg:w-[670px] overflow-auto [&::-webkit-scrollbar]:hidden h-[400px] p-[15px] rounded-lg border transition-all duration-150 cursor-pointer hover:shadow-md'>
              <LineChart dateArray={issuedDates} invoiceAmountArray={issuedInvoiceAmounts} />
            </div>
          </div>

          <div>
          <motion.div 
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
  className="flex-1 w-full max-w-[320px] h-[400px] bg-white rounded-xl shadow-sm border border-gray-100  flex flex-col overflow-hidden scrollbar-hide scrollbar-hide::-webkit-scrollbar"
>
  {/* Notification Header */}
  <div className="flex items-center justify-between p-4 border-b border-gray-100">
    <div className="flex items-center gap-2">
      <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
        <IoIosNotifications className="text-xl" />
      </div>
      <h3 className="font-semibold text-gray-800">Notifications</h3>
    </div>
    {notificationMessages.length > 0 && (
      <span className="text-xs bg-purple-600 text-white px-2 py-1 rounded-full">
        {notificationMessages.length} New
      </span>
    )}
  </div>

  {/* Notification List */}
  <div className="flex-1 overflow-y-auto overflow-hidden scrollbar-hide scrollbar-hide::-webkit-scrollbar scrollbar-thin scrollbar-thumb-purple-200 w-[300px]">
    {notificationMessages.length > 0 ? (
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.05
            }
          }
        }}
        className="p-2 space-y-2"
      >
        {notificationMessages.map((message, index) => (
          <motion.div
            key={index}
            variants={{
              hidden: { opacity: 0, x: -10 },
              visible: { opacity: 1, x: 0 }
            }}
            whileHover={{ scale: 1.02 }}
            className="p-3 bg-gray-50 rounded-lg transition-all cursor-pointer hover:bg-purple-50 group"
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-800 group-hover:text-purple-700">
                  {/* Display the full message directly without splitting */}
                  {message}
                </p>
                {/* Removed the second p tag to prevent truncation and unnecessary split logic */}
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-gray-400">Just now</span>

                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    ) : (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center">
        <div className="p-4 mb-3 bg-gray-100 rounded-full">
          <IoIosNotifications className="text-2xl text-gray-400" />
        </div>
        <h4 className="font-medium text-gray-500">No notifications</h4>
        <p className="text-sm text-gray-400 mt-1">
          You're all caught up!
        </p>
      </div>
    )}
  </div>

  
</motion.div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Dashboard
