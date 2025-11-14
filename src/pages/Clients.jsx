import React, {useEffect, useState} from 'react'
import Sidebar from '../components/Sidebar'
import { CiSearch } from "react-icons/ci";
import { GoPlus } from "react-icons/go";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaUser } from "react-icons/fa";
import { supabase } from '../components/supabase';
import { MdOutlineDeleteForever } from "react-icons/md";
import { GrFormView } from "react-icons/gr";
import { useInvoice } from '../contexts/InvoiceContext';
import { IoChevronBackCircle } from "react-icons/io5";
import { IoChevronForwardCircle } from "react-icons/io5";

const Clients = () => {

  const { setIsLoading, setDisplayConfirmClientDeleteModal, setTargetDeleteId } = useInvoice();
  const userId = localStorage.getItem('userId');

  const [clientData, setClientData] = useState([]);
  const [allClientData, setAllClientData] = useState([]);  // FULL DATA STORED HERE
  const [showNoDataMsg, setShowNoDataMsg] = useState(true);
  const [searchTerm ,setSearchTerm] = useState("");

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [clientsPerPage] = useState(10);

  const navigate = useNavigate();

  const handleClientProfilePage = (idx) => {
    navigate(`/dashboard/clients/client-profile/${idx}`);
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // FETCH CLIENTS ONCE
  useEffect(() => {
    const fetchClientsData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const accessToken = session?.access_token;

      setIsLoading(true);

      try {
        const result = await axios.get(
          `https://claukk-backend.onrender.com/api/users/clients-data/${userId}`,
          {
            headers: { Authorization: `Bearer ${accessToken}` }
          }
        );

        const response = result.data;

        setAllClientData(response);     // SAVE FULL ARRAY
        setClientData(response);        // DISPLAY LIST

        if (response.length > 0) setShowNoDataMsg(false);

      } catch (error) {
        console.error("Error fetching client data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClientsData();
  }, [userId]);

  // LOCAL SEARCH (NO BACKEND CALL)
  useEffect(() => {
    if (!searchTerm || searchTerm.trim() === "") {
      setClientData(allClientData);
      return;
    }

    const filtered = allClientData.filter((client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.phone.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setClientData(filtered);
    setCurrentPage(1);  // Reset pagination when searching

  }, [searchTerm, allClientData]);


  // pagination calculations
  const indexOfLastClient = currentPage * clientsPerPage;
  const indexOfFirstClient = indexOfLastClient - clientsPerPage;
  const currentClientData = clientData.slice(indexOfFirstClient, indexOfLastClient);

  const handleDeleteClient = (id) => {
    setDisplayConfirmClientDeleteModal(true);
    setTargetDeleteId(id);
  };

  return (
    <>
      <Sidebar/>

      <div className='relative pt-[50px] px-[15px] md:ml-[-120px] lg:ml-[1px]'>

        <div className='mt-[-20px] flex gap-[7px] items-center'>
          <div><p className='text-lg bg-purple-600 rounded-full h-[15px] w-[15px]'></p></div>
          <h1 className='font-thin text-2xl text-black'>Clients</h1>
        </div>

        {/* SEARCH BAR */}
        <div className='flex items-center justify-between h-[80px] py-[10px] mt-[10px] px-[5px] rounded-lg'>
          <div className='flex gap-[10px] items-center w-[300px] border border-gray-200 rounded-lg py-[8px] px-[15px]'>
            <CiSearch className='text-xl' />
            <input
              type="text"
              placeholder='search ...'
              className='bg-transparent border-none outline-none'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>


        {/* TABLE */}
        <div className='mt-[20px]'>
          <table className='border rounded-lg w-full text-sm'>
            <thead>
              <tr>
                <th className='pl-[15px] py-[12px] text-left bg-gray-100 text-gray-500 font-thin'>Client ~</th>
                <th className='pl-[15px] py-[12px] text-left bg-gray-100 text-gray-500 font-thin'>Client Name</th>
                <th className='pl-[15px] py-[12px] text-left bg-gray-100 text-gray-500 font-thin'>Client Email</th>
                <th className='pl-[15px] py-[12px] text-left bg-gray-100 text-gray-500 font-thin'>Client Phone</th>
                <th className='pl-[15px] py-[12px] text-left bg-gray-100 text-gray-500 font-thin'>Actions</th>
              </tr>
            </thead>

            <tbody>
              {currentClientData.map((item) => (
                <tr key={item.id}>
                  <td className='pl-[15px] py-[15px] text-2xl'>
                    <div className='w-[40px] h-[40px] flex items-center justify-center bg-gray-200 rounded-full'>
                      <FaUser />
                    </div>
                  </td>

                  <td className='pl-[15px] py-[15px]'>{item.name}</td>
                  <td className='pl-[15px] py-[15px] text-gray-500'>{item.email}</td>
                  <td className='pl-[15px] py-[15px]'>{item.phone}</td>

                  <td className='pl-[15px] py-[15px] flex gap-[20px] items-center'>
                    <GrFormView
                      onClick={() => handleClientProfilePage(item.id)}
                      className='text-purple-500 text-3xl cursor-pointer hover:scale-125 transition-all'
                    />

                    <MdOutlineDeleteForever
                      onClick={() => handleDeleteClient(item.id)}
                      className='text-red-500 text-xl cursor-pointer hover:scale-125 transition-all'
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>


        {/* PAGINATION */}
        <div className="flex justify-center my-4 gap-2">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <IoChevronBackCircle size={20} />
          </button>

          <span className="px-4 py-[2px] text-xs">
            {currentPage} of {Math.ceil(clientData.length / clientsPerPage)}
          </span>

          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={indexOfLastClient >= clientData.length}
          >
            <IoChevronForwardCircle size={20} />
          </button>
        </div>

        {showNoDataMsg && (
          <div className='flex justify-center items-center h-[300px]'>
            <h1 className='text-gray-400'>No data available</h1>
          </div>
        )}

      </div>
    </>
  );
};

export default Clients;
