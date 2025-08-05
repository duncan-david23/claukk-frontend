import React from 'react';
import { motion } from 'framer-motion';
import Claukk_Invoice_logo from '../assets/Claukk_Invoice_logo.png';
import Claukk_Icon from '../assets/Claukk_Icon.png';
import Lottie from "lottie-react";
import loaderAnim from '../animations/loaderAnim.json'

const Loader = () => {
  return (
    <div className='flex h-screen w-full items-center justify-center bg-white ml-[-100px]'>

        <Lottie animationData={loaderAnim } loop={true} className='w-[350px]' />
        
     
    </div>
  );
};

export default Loader;
