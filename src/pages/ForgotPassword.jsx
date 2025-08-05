import React, { useState } from 'react'
import { AiFillSecurityScan } from "react-icons/ai";
import { supabase } from '../components/supabase';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';


const ForgotPassword = () => {
    const [email, setEmail] = useState()
    const [msg, setMsg] = useState()


    const handleFormSubmit = async (e)=> {
        e.preventDefault();
        if(!email) return alert ('Please enter your email');
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'http://localhost:5173/reset-password',
        });

        if (error) {
        console.error('Error:', error.message);
        alert('❌ ' + error.message);
    } else {
        setMsg('✅ Reset email sent! Check your inbox.')
        setEmail('')
    }
        
    }

  return (
    <div className='ml-[-200px] flex  backdrop-blur-lg h-[100vh] justify-center items-center bg-gray-50'>
        <div className='border border-purple-500 p-[20px] w-[400px] h-[350px] rounded-lg'>
                <AiFillSecurityScan size={50} className='mx-auto' />
                <p className='text-gray-400 mt-[20px] text-center'>You're going to receive a password reset link shortly after request</p>
                <p className='text-black mb-[15px] text-center font-thin text-sm mt-[20px]'>{msg&&msg}</p>
                <form onSubmit={handleFormSubmit}>
                    <div className='mt-[40px]'>
                        <input type="email" value={email} onChange={(e)=> setEmail(e.target.value)} placeholder='Enter your email' className='px-[15px] py-[10px] border rounded-lg w-full bg-transparent' />
                        <button type='submit' className='px-[15px] py-[10px] w-full rounded-lg bg-purple-600 text-white mt-[30px] hover:bg-purple-800 transition-all'>Reset Password</button>
                    </div>
                </form>
        </div>

    </div>
  )
}

export default ForgotPassword