import React, {useEffect, useState} from "react";
import {Doughnut} from "react-chartjs-2";
import {Chart as ChartJS, ArcElement, Tooltip, Legend} from 'chart.js'
import axios from "axios"
import { useInvoice } from '../contexts/InvoiceContext'
import { supabase } from "./supabase";



ChartJS.register(ArcElement, Tooltip, Legend);

const DoughnutChart = ({ cId, clientName}) => {
     const [clientInvData, setClientInvData] = useState([]);
  const [paidInvoice, setPaidInvoice] = useState([]);
  const [unpaidInvoice, setUnpaidInvoice] = useState([]);
  const [overdueInvoice, setOverdueInvoice] = useState([]);
  const [partPaymentInvoice, setPartPaymentInvoice] = useState([]);
  const { currencySymbol } = useInvoice();

  // 🔍 Breakdown partpayment into paid & unpaid
  const partPaidAmount = partPaymentInvoice.reduce((sum, item) => {
    return sum + parseFloat(item.part_payment_amount || 0);
  }, 0);

  const partUnpaidAmount = partPaymentInvoice.reduce((sum, item) => {
    const full = parseFloat(item.invoice_amount || 0);
    const paid = parseFloat(item.part_payment_amount || 0);
    return sum + Math.max(full - paid, 0);
  }, 0);

  const paidAmount = paidInvoice.reduce((sum, item) => {
    return sum + parseFloat(item.invoice_amount || 0);
  }, 0);

  const unpaidAmount = unpaidInvoice.reduce((sum, item) => {
    return sum + parseFloat(item.invoice_amount || 0);
  }, 0);

  const overdueAmount = overdueInvoice.reduce((sum, item) => {
    return sum + parseFloat(item.invoice_amount || 0);
  }, 0);

  const totalRevenue = clientInvData.reduce((sum, item) => {
    return sum + parseFloat(item.invoice_amount || 0);
  }, 0);

  const totalPaid = paidAmount + partPaidAmount;
  const totalUnpaid = unpaidAmount + partUnpaidAmount;

  const formatToShortCurrency = (value) => {
    if (value >= 1_000_000_000) return (value / 1_000_000_000).toFixed(2) + 'b';
    if (value >= 1_000_000) return (value / 1_000_000).toFixed(2) + 'm';
    if (value >= 1_000) return (value / 1_000).toFixed(2) + 'k';
    return value?.toFixed(2);
  };

  const paidRevenueStr = formatToShortCurrency(totalPaid);
  const unpaidRevenueStr = formatToShortCurrency(totalUnpaid);
  const overdueRevenueStr = formatToShortCurrency(overdueAmount);
  const totalRevenueStr = formatToShortCurrency(totalRevenue);

  const chartData = {
    labels: ['Paid', 'Unpaid', 'Overdue'],
    datasets: [{
      label: 'Revenue Breakdown',
      data: [totalPaid, totalUnpaid, overdueAmount],
      backgroundColor: ['#7CE577', '#E4B363', '#ee6b6e'],
      borderWidth: 0
    }]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      tooltip: { enabled: true },
      legend: {
        position: 'top',
        labels: { color: '#000' }
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const accessToken = session?.access_token;

      try {
        const result = await axios.get(`https://claukk-backend.onrender.com/api/users/client-invoice-data/${cId}`, {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        const data = result.data;
        setClientInvData(data);
        setPaidInvoice(data.filter(i => i.invoice_status === 'paid'));
        setUnpaidInvoice(data.filter(i => i.invoice_status === 'unpaid'));
        setOverdueInvoice(data.filter(i => i.invoice_status === 'overdue'));
        setPartPaymentInvoice(data.filter(i => i.invoice_status === 'partpayment'));
      } catch (err) {
        console.error("Error fetching invoice data:", err);
      }
    };

    fetchData();
  }, [cId]);


    return(
        <div className='  mt-[-18px]  py-[14px]'>
            <h1 className='text-center mt-[-15px] py-[7px] font-thin text-xs' >Revenue From {clientName}</h1>
            <h1 className='text-center mt-[-10px] py-[7px] font-extrabold text-lg ' style={{color:'rgb(138, 2, 120)' }}>{currencySymbol}{totalRevenueStr}</h1>
            <div className='w[200px] h-[200px] flex justify-center'>
                <Doughnut data={chartData} options={chartOptions} />
            </div>

            <div>
                <div className='flex justify-between items-center px-[20px]'>
                    <h1 className='font-bold text-xs paid w-[70px] rounded-full text-center  py-[3px] px-[4px]'>Paid</h1>
                    <p className='font-bold text-xs'>{currencySymbol}{paidRevenueStr}</p>
                </div>
                <div className='flex justify-between items-center px-[20px] mt-[10px]'>
                    <h1 className='font-bold text-xs unpaid w-[100px] rounded-full text-center py-[3px] px-[4px]'>Total Unpaid</h1>
                    <p className='font-bold text-xs'>{currencySymbol}{unpaidRevenueStr }</p>
                </div>
                <div className='flex justify-between items-center px-[20px] mt-[10px]'>
                    <h1 className='font-bold text-xs overdue w-[70px] rounded-full text-center py-[3px] px-[4px]'>Overdue</h1>
                    <p className='font-bold text-xs'>{currencySymbol}{overdueRevenueStr}</p>
                </div>
            </div>
        </div>
    )
}


export default DoughnutChart;