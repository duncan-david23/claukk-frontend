import React, { useState, useEffect} from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { useInvoice } from '../contexts/InvoiceContext'
import { useAuth } from '../contexts/AuthContext'
import claukInv from '../assets/Claukk_Invoice_logo.png' 
import pcImage from '../assets/invpcImage.png' 
import patternImage from '../assets/pattern.jpg' 
import Lottie from "lottie-react";
import loginArtAnim from '../animations/loginArtAnim.json'
import { supabase } from '../components/supabase';
import { MdOutlineRemoveRedEye } from "react-icons/md";


const Login = () => {
  const {userAuth, setUserAuth } = useAuth();
  const [showPassword, setShowPassword] = useState(false)

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

      const [msg, setMsg] = useState('')
      const navigate = useNavigate();

  const handleChange = (e)=> {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      });
  }

  const notify = () => toast.success('Logged In Successfully.');


  // const handleSubmit = async (e)=> {
  //   e.preventDefault();

  //   try {

  //     let response = await axios.post('https://claukk-backend.onrender.com/api/users/login', formData);


  //     let result = response.data;
  //     console.log(response.data);
  //     setMsg(result.msg)
  //     const userId = result.user.id;
  //     const user_email = result.user.email

  //     if(response.data.success){
  //       // setMsg('')
  //       // notify()
  //       localStorage.setItem('accessToken', result.accessToken )
  //       localStorage.setItem('refreshToken', result.refreshToken )
  //       localStorage.setItem('userId', userId);
  //       localStorage.setItem('userEmail', user_email)
  //       navigate(`/dashboard`)
  //     }



  //   } catch (error) {
  //     console.error('There was an error signing In:', error);  // Handle any errors
  //     setMsg('An error occured during sign in, try again in few seconds')
  //   }

    
  // }


const handleSubmit = async (e)=> {
  e.preventDefault(); 

  const { email, password } = formData;


  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password
    });

  if (error) {
            setMsg(error.message);
            return
        }
        
        localStorage.setItem('userId', data.user.id);
        localStorage.setItem('userEmail', data.user.email);
  
      // setUserAuth(data.user);
      navigate('/dashboard');
      notify();
  } catch (error) {
    console.error('Error signing in:', error);
    setMsg( 'An error occurred during sign in, please check your details and try again.');
  }
}


 const handleForgotpassword = ()=> {
    navigate('/forgot-password')
 }

  return (
    <div>
    <div className='flex flex-col h-[100vh] max-w-100vw md:flex-row ml-[-200px] '>
        
          {/* ------Left Side ------ */}

    <div className=' px-[20px] py-[20px]  md:px-[90px] h-full w-full md:w-1/2 flex flex-col gap-[40px] items-center justify-center bg-white '>
          
          <div className='w-[200px]'>
            <img src={claukInv} alt="claukk invoice logo" className='w-[200px]' />
          </div>

          <div className=' w-[250px] md:w-[350px]'>


          <form onSubmit={handleSubmit}>

            <h1 className='font-thin text-xl text-purple-600 md:text-3xl md:pb-[20px] py-[7px]'>Sign In</h1>

            
            {/* Display message */}
            {msg && <span className='font-thin text-gray-500 text-xs'>{msg}</span>}
            

            <div className='flex flex-col mt-[15px]'>
            {/* <label htmlFor="email" className='font-semibold'>Email*</label> */}
              <input type="email" id='email' name='email' placeholder='example@mail.com' value={formData.email} onChange={handleChange} required={true} className=' border-none outline-none bg-slate-100 rounded-lg  py-[7px] px-5  w-full'/>
            </div>

            <div className='flex items-center justify-between mt-[25px] border-l-2 bg-slate-100 rounded-lg focus:outline-none pr-[15px] w-full'>
              <input type={showPassword ? 'text' : 'password'} id='password' name='password' placeholder='************' value={formData.password} onChange={handleChange} required={true} className=' py-[7px] px-5 bg-transparent w-full outline-none border-none '/>
              <MdOutlineRemoveRedEye onClick={()=> setShowPassword(prev => !prev)} className='cursor-pointer' />
            </div>
            
            <div>
                <p onClick={handleForgotpassword} className=' font-semibold text-xs md:text-sm  cursor-pointer text-left mt-[22px] text-purple-500'>Forgot password</p>
            </div>
            
            <button type="submit" className='w-full bg-purple-700 text-white  py-[5px] px-[7px] mt-[20px] font-bold hover:bg-purple-800 rounded-lg'>Sign In</button>
            <p className='text-sm font-semibold mt-[15px]'>
              
              Don't have an account?
              <Link to='/signup'>
               <span className='text-sm font-semibold text-purple-500 cursor-pointer ml-[5px]'> Sign Up</span>
              </Link>
               </p> 
          </form>
          </div>
        </div>


                {/* ------ Right Side */}

        <div className='relative z-10 bg-purple-50 md:flex items-center w-1/2 hidden text-purple-600 '>
             

            <div className='flex flex-col items-center'>
             
              <Lottie animationData={loginArtAnim } loop={true} className='w-[350px]' />
             <p className='text-center  md:text-xl lg:text-2xl font-bold mt-[30px] px-[100px] '>Stay on Top of Your Finances with Smart Invoicing</p>
             <p className='text-center text-gray-500 md:text-xs lg:text-sm font-thin  mt-[10px] md:px-[70px] lg:px-[100px]'>Take control of your invoicing with a platform designed to keep you organized. Easily create professional invoices, track their status at every stage, and receive timely reminders to stay ahead.</p>
            </div>
        </div>

                
        
            
        

      
    </div>
    </div>
  )
}

export default Login