import React, {useEffect, useState} from 'react'
import Sidebar from './components/Sidebar'
import { Routes, Route, Navigate } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Invoice from './pages/Invoice'
import InvoiceTemplate from './pages/InvoiceTemplate'
import InvoiceTemplate2 from './pages/InvoiceTemplate2'
import InvoiceTemplate3 from './pages/InvoiceTemplate3'
import InvoiceTemplate4 from './pages/InvoiceTemplate4'
import InvoiceTemplate5 from './pages/InvoiceTemplate5'
import BpsModal from './components/BpsModal'
import AddItemModal from './components/AddItemModal'
import { useInvoice } from './contexts/InvoiceContext'
import Settings from './pages/Settings'
import Signup from './pages/Signup'
import Login from './pages/Login'
import Home from './pages/Home'
import Clients from './pages/Clients'
import toast, { Toaster } from 'react-hot-toast';
import ClientProfile from './pages/ClientProfile'
import UpdateClientDataModal from './components/UpdateClientDataModal'
import SendReminderModal from './components/SendReminderModal'
import TemplatesModal from './components/TemplatesModal'
import SubscriptionModal from './components/SubscriptionModal'
import DonateModal from './components/DonateModal'
import AuthWrapper from './components/AuthWrapper'
import ThankYouPage from './pages/ThankYou'
import ResetPassword from './pages/ResetPassword'
import ForgotPassword from './pages/ForgotPassword'
import ConfirmDeleteModal from './components/ConfirmDeleteModal'
import ConfirmDeleteClientModal from './components/ConfirmDeleteClientModal'
import ContactClaukkModal from './components/ContactClaukkModal'



const App = () => {

  const {donationAmount,displayConfirmModal, displayContactUsModal, setDisplayContactUsModal, displayConfirmClientDeleteModal, setDisplayConfirmClientDeleteModal, setDisplayConfirmModal, setDisplayBpsModal,displayBpsModal, setDonationAmount, displayAddItemModal, displayDonateModal ,displayUpdateClientDataModal, displayReminderModal, displayTemplatesModal, displaySubscriptionModal, setSubscriptionModal} = useInvoice();




  // const [loading, setLoading] = useState(true);
  // const [auth, setAuth] = useState(false);


  //   const isAuthenticated = () => {
  //     return localStorage.getItem("accessToken") !== null;
  //   };


  // Check if the user is authenticated
  // const PrivateRoute = ({ children }) => {
  //   return isAuthenticated() ? children : <Navigate to="/login" />;
  // };

  
// useEffect(() => {
//   const businessName = localStorage.getItem('business_name');
//   console.log('Business Name:', businessName);

//   if (businessName === null || businessName === '') {
//     setTimeout(() => {
//       setDisplayBpsModal(displayBpsModal);
//     }, 5000);
//   }
// }, []);


  return (
    <div className='bg-white' >
      <Toaster/>

      {displayAddItemModal &&
      <AddItemModal/>
      }
      {displayUpdateClientDataModal &&
      <UpdateClientDataModal/>
      }
      { displayReminderModal &&
      <SendReminderModal />
      }
      { displayTemplatesModal &&
      <TemplatesModal />
      }
      { displaySubscriptionModal &&
          <SubscriptionModal />
      }
      { displayDonateModal &&
          <DonateModal />
      }
      { displayConfirmModal&&
          <ConfirmDeleteModal />
      }
      { displayConfirmClientDeleteModal &&
          <ConfirmDeleteClientModal />
      }
      { displayContactUsModal &&
          <ContactClaukkModal />
      }

      { displayBpsModal &&
          <BpsModal onClose={() => setDisplayBpsModal(false)} />
      }
     

      

      <div className='flex-1 ml-[200px] '>
        
          <Routes>
          <Route path='/' element={<Home/>} />
          <Route path='/forgot-password' element={<ForgotPassword/>} />
          <Route path='/reset-password' element={<ResetPassword/>} />
            <Route path='/dashboard' element={
              <AuthWrapper>
                <Dashboard/>
              </AuthWrapper>
              } />
            <Route path='/signup' element={<Signup/>} />
            <Route path='/login' element={<Login/>} />
            <Route path='/dashboard/invoices' element={
              <AuthWrapper>
                <Invoice/>
              </AuthWrapper>
              } 
              />
            <Route path='/dashboard/clients' element={
              <AuthWrapper>
                <Clients/>
              </AuthWrapper>
              } />
            <Route path='/dashboard/clients/client-profile/:id' element={
              <AuthWrapper>
                <ClientProfile/>
              </AuthWrapper>
              }
               />
            <Route path='/dashboard/invoice-template1' element={
              <AuthWrapper>
                <InvoiceTemplate/>
              </AuthWrapper>
              } />
            <Route path='/dashboard/invoice-template2' element={
              <AuthWrapper>
                <InvoiceTemplate2/>
              </AuthWrapper>
              } />
            <Route path='/dashboard/invoice-template3' element={
              <AuthWrapper>
                <InvoiceTemplate3/>
              </AuthWrapper>
              } />
            <Route path='/dashboard/invoice-template4' element={
              <AuthWrapper>
                <InvoiceTemplate4/>
              </AuthWrapper>
            } />

            <Route path='/dashboard/invoice-template5' element={
                <AuthWrapper>
                <InvoiceTemplate5/>
              </AuthWrapper>
            } />

            <Route path='/dashboard/user-settings' element={
              <AuthWrapper>
              <Settings/>
              </AuthWrapper>
              } />

            <Route path='/dashboard/thankyou' element={
              <AuthWrapper>
                <ThankYouPage />
              </AuthWrapper>
              } />
          </Routes>


        



      </div>




    </div>
  )
}

export default App