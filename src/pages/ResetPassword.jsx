import React, { useState, useEffect } from 'react'
import { AiFillSecurityScan } from "react-icons/ai";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { supabase } from '../components/supabase';





const ResetPassword = () => {
    const [password, setPassword] = useState()
    const [confirmPassword, setConfirmPassword] = useState()
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [msg, setMsg] = useState('')

    const handleFormSubmit = async (e)=> {
        e.preventDefault();
        if(password !== confirmPassword){
            setMsg('Passwords do not match, try again')
            return;
        };

        if (!password || password.length < 6) {
            return setMsg('❌ Password must be at least 6 characters');
        };

        const { data, error } = await supabase.auth.updateUser({
        password: password,
        });

        if (error) {
            console.error(error);
            setMsg('❌ ' + error.message);
        } else {
            setMsg('✅ Password successfully reset! You can now log in.');
            setTimeout(() => {
                window.location.href = '/login'
            }, 3000);
        }

        setMsg('')
    }


    useEffect(() => {
    // Optional: Check if session is valid
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        setMsg('❌ Session expired or invalid reset link.');
      }
    });
  }, []);


  return (
    <div className='ml-[-200px] flex  backdrop-blur-lg h-[100vh] justify-center items-center bg-gray-50'>
            <div className='border border-purple-500 p-[20px] w-[400px] h-[400px] rounded-lg'>
                    <AiFillSecurityScan size={50} className='mx-auto' />
                    <p className='text-gray-800 mt-[20px] text-lg font-bold text-center'>Reset Your Password</p>
                    
                    <form onSubmit={handleFormSubmit}>
                        <div className='mt-[40px]'>
                            <p className='text-black mb-[15px] text-center font-thin text-sm'>{msg&&msg}</p>
                            <div className='flex items-center justify-between border px-[10px] rounded-lg w-full my-[5px]'>
                                <input type={showPassword ? 'text' : 'password'} value={password} placeholder='******' onChange={(e)=> setPassword(e.target.value)} className='px-[15px] py-[10px] border-none outline-none w-full bg-transparent' />
                                <MdOutlineRemoveRedEye onClick={()=> setShowPassword(prev => !prev)} className='cursor-pointer' />
                            </div>
                            <div className='flex items-center justify-between border px-[10px] rounded-lg w-full my-[5px]'>
                                <input type={showConfirmPassword ? 'text' : 'password'} value={confirmPassword} placeholder='confirm password' onChange={(e)=> setConfirmPassword(e.target.value)}className='px-[15px] py-[10px] border-none outline-none w-full bg-transparent' />
                                <MdOutlineRemoveRedEye onClick={()=> setShowConfirmPassword(prev => !prev)} className='cursor-pointer' />
                            </div>
                            <button type='submit' className='px-[15px] py-[10px] w-full rounded-lg bg-purple-600 text-white mt-[30px] hover:bg-purple-800 transition-all'>Confirm Password</button>
                        </div>
                    </form>
            </div>
    
        </div>
  )
}

export default ResetPassword