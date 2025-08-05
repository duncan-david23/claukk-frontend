import React, { useRef, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { useInvoice } from '../contexts/InvoiceContext'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const LineChart = ({ dateArray, invoiceAmountArray }) => {


  const {currencySymbol} = useInvoice();

  const chartContainerRef = useRef(null);
  
  const data = {
    labels: dateArray,
    datasets: [
      {
        label: 'Total Revenue',
        data: invoiceAmountArray,
        borderColor: '#7e22ce', // Purple color
        backgroundColor: 'rgba(126, 34, 206, 0.1)', // Light purple fill
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#7e22ce',
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  // Chart options with improved responsiveness
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          autoSkip: false,
          maxRotation: 45,
          minRotation: 45,
          font: {
            size: 10,
          },
        },
      },
      y: {
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          callback: function(value) {
            return currencySymbol + value;
          },
        },
      },
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false,
    },
  };

  // Auto-scroll to the end when new data comes in
  useEffect(() => {
    if (chartContainerRef.current && dateArray.length > 10) {
      chartContainerRef.current.scrollLeft = chartContainerRef.current.scrollWidth;
    }
  }, [dateArray]);

  return (
    <div 
      ref={chartContainerRef}
      className="relative h-full w-full overflow-x-auto scrollbar-hide"
      style={{ minHeight: '300px' }}
    >
      <div style={{ minWidth: `${dateArray.length * 30}px` }}>
        <Line 
          data={data} 
          options={options} 
          height={300}
        />
      </div>
    </div>
  );
};

export default LineChart;