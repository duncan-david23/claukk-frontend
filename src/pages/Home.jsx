import React, {useRef} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import claukkInvoiceLogo from '../assets/Claukk_Invoice_logo.png';
import clientsPage_img from '../assets/allClientPagePic.PNG';
import dashboardImage from '../assets/cDp.PNG';
import allInvoicesImage from '../assets/cInvP.PNG';
import detailClientPageImage from '../assets/claukk_client_page_pic.PNG';
import FAQSection from '../components/FAQSection';
import { useInvoice } from '../contexts/InvoiceContext';
// Animation configurations
const fadeUp = {
  hidden: { opacity: 0, y: 50 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3
    }
  }
};

const staggerItem = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "backOut" }
  }
};

const floatingAnimation = {
  animate: {
    y: [0, -15, 0],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

const pulseGlow = {
  initial: { scale: 1, boxShadow: "0 0 0 0 rgba(124, 58, 237, 0.7)" },
  animate: {
    scale: [1, 1.02, 1],
    boxShadow: [
      "0 0 0 0 rgba(124, 58, 237, 0.7)",
      "0 0 20px 5px rgba(124, 58, 237, 0.3)",
      "0 0 0 0 rgba(124, 58, 237, 0)"
    ],
    transition: {
      duration: 3,
      repeat: Infinity,
      repeatType: "loop"
    }
  }
};


const Home = () => {


const featuresRef = useRef(null);
const faqRef = useRef(null);
const contactRef = useRef(null);




const handlMenuNav = (navItem) => {
  if (navItem === 'Features' && featuresRef.current) {
    featuresRef.current.scrollIntoView({ behavior: 'smooth' });
  } else if (navItem === 'Contact' && contactRef.current) {
    contactRef.current.scrollIntoView({ behavior: 'smooth' });
  } else if (navItem === 'FAQ' && faqRef.current) {
    faqRef.current.scrollIntoView({ behavior: 'smooth' });
  }
};


  const year = new Date().getFullYear();

  const handleLoginRoute = () => {
    window.location.href = '/login';
  };

  const handleSignUpRoute = () => {
    window.location.href = '/signup';
  };

  return (
    <div className="ml-[-200px] overflow-x-hidden">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-gray-50 via-purple-50 to-gray-100 h-[100vh] px-[70px] py-[25px] overflow-hidden">
        {/* Animated background elements */}
        <motion.div 
          className="absolute top-0 left-0 w-full h-full overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-purple-100/50"
              style={{
                width: Math.random() * 300 + 100,
                height: Math.random() * 300 + 100,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                x: [0, (Math.random() - 0.5) * 100],
                y: [0, (Math.random() - 0.5) * 100],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut"
              }}
            />
          ))}
        </motion.div>

        {/* Navigation */}
        <motion.div 
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="relative bg-white/80 py-[10px] px-[30px] rounded-full w-full border border-purple-200 backdrop-blur-md z-10"
        >
          <div className="flex items-center justify-between">
            <motion.div whileHover={{ scale: 1.05 }}>
              <img 
                src={claukkInvoiceLogo} 
                alt="claukk logo" 
                className="w-[100px] h-[20px] cursor-pointer" 
              />
            </motion.div>

            <motion.div className="flex items-center gap-[30px]">
              {['Features', 'FAQ'].map((item, index) => (
                <motion.p 
                  key={index}
                  className="text-gray-600 cursor-pointer font-medium relative group"
                  whileHover={{ scale: 1.05, color: "#7e22ce" }}
                  onClick={()=> handlMenuNav (item)}
                >
                  {item}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-600 transition-all duration-300 group-hover:w-full"></span>
                </motion.p>
              ))}
            </motion.div>

            <div className="flex items-center gap-[20px]">
              <motion.button 
                whileHover={{ scale: 1.05, color: "#7e22ce" }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLoginRoute} 
                className="text-gray-700 font-semibold"
              >
                Sign in
              </motion.button>
              <motion.button 
                variants={pulseGlow}
                initial="initial"
                animate="animate"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSignUpRoute} 
                className="text-white bg-gradient-to-r from-purple-600 to-purple-800 py-[8px] px-[25px] rounded-full font-semibold cursor-pointer relative overflow-hidden"
              >
                <span className="relative z-10">Get Started</span>
                <motion.span 
                  className="absolute inset-0 bg-gradient-to-r from-purple-700 to-purple-900 opacity-0"
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.button>
            </div>
          </div>
        </motion.div>

        
       {/* Hero Content */}
<div className="relative z-10 flex justify-center text-center items-center mt-[70px]">
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
    className="w-[700px] py-[20px] px-[20px]"
  >
    <motion.h1 
      className="font-bold text-5xl my-[15px] tracking-wide leading-tight"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.8 }}
    >
      Send <span className="text-gray-400">Smart Invoices.</span> Get Paid{' '}
      <motion.span 
        className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-purple-800"
        animate={{
          backgroundPosition: ['0% 50%', '100% 50%'],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "linear"
        }}
        style={{
          backgroundSize: "200% 200%",
        }}
      >
        Faster.
      </motion.span>
    </motion.h1>
    
    <motion.p 
      className="font-thin text-sm text-gray-500"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.8 }}
    >
      ClaukkInvoice helps freelancers, businesses and small teams create professional invoices, track payments and manage clients - all in one place
    </motion.p>
    
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.8 }}
      className="mt-[30px]"
    >
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleSignUpRoute}
        className="relative text-white bg-gradient-to-r from-purple-600 to-purple-800 py-[10px] px-[30px] rounded-full font-semibold cursor-pointer shadow-lg shadow-purple-500/30 overflow-hidden"
      >
        <span className="relative z-10">Get started for free</span>
        <motion.span 
          className="absolute inset-0 bg-gradient-to-r from-purple-700 to-purple-900 opacity-0"
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      </motion.button>
    </motion.div>
  </motion.div>
</div>
      </div>

      {/* Dashboard Preview Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        className="relative py-[100px] bg-gradient-to-b from-white to-gray-50"
      >
        <motion.div 
          className="flex justify-center"
          initial={{ scale: 0.9, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, type: "spring" }}
        >
          <motion.img 
            src={dashboardImage} 
            alt="" 
            className="w-[1000px] rounded-xl shadow-2xl ring-1 ring-purple-200/50 mt-[-220px]"
            whileHover={{ scale: 1.005 }}
            animate={{
              y: [0, -10, 0],
              boxShadow: [
                "0 25px 50px -12px rgba(124, 58, 237, 0.1)",
                "0 25px 50px -12px rgba(124, 58, 237, 0.2)",
                "0 25px 50px -12px rgba(124, 58, 237, 0.1)"
              ]
            }}
            transition={{
              y: { duration: 8, repeat: Infinity, ease: "easeInOut" },
              boxShadow: { duration: 8, repeat: Infinity, ease: "easeInOut" }
            }}
          />
        </motion.div>
        
        <AnimatePresence>
          <motion.div 
            className="w-[300px] px-[-50px] absolute top-[10px] left-[40px]"
            initial={{ x: -100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true, margin: "0px 0px -100px 0px" }}
            transition={{ delay: 0.3, type: "spring" }}
          >
            <motion.div variants={floatingAnimation} animate="animate">
              <motion.img 
                src={allInvoicesImage} 
                alt="" 
                className="w-[280px] h-[220px] ring-1 ring-purple-300 rounded-xl shadow-lg"
                whileHover={{ scale: 1.03 }}
              />
              <p className="text-sm text-purple-700 font-bold mt-[10px] text-center">
                Track all invoices issued
              </p>
            </motion.div>
          </motion.div>

          <motion.div 
            className="w-[300px] px-[10px] absolute bottom-[100px] right-[40px]"
            initial={{ x: 100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true, margin: "0px 0px -100px 0px" }}
            transition={{ delay: 0.5, type: "spring" }}
          >
            <motion.div variants={floatingAnimation} animate="animate">
              <motion.img 
                src={detailClientPageImage} 
                alt="" 
                className="w-[280px] h-[220px] ring-1 ring-purple-300 rounded-xl shadow-lg"
                whileHover={{ scale: 1.03 }}
              />
              <p className="text-sm text-purple-700 font-bold mt-[10px] text-center">
                Manage and track client payments
              </p>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Feature section */}
      <motion.div 
      ref={featuresRef}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={staggerContainer}
        className="flex flex-col items-center justify-center my-[100px] px-[20px]"
        
      >
        <motion.h1 variants={staggerItem} className="text-4xl font-bold">
          Feature <span className="underline decoration-purple-600 decoration-5">Highlights</span>
        </motion.h1>
        <motion.p variants={staggerItem} className="my-[8px] text-gray-500">
          Professional Invoicing, Smarter Workflow
        </motion.p>

        <motion.div variants={staggerContainer} className="mt-10">
          {[
  {
    title: "Fast Invoice Creation",
    desc: "Customize and send invoices in seconds with your logo, payment terms, and itemized details."
  },
  {
    title: "Real-Time Revenue Dashboard",
    desc: "Instantly see paid, unpaid, and overdue invoices — all in one clean view."
  },
  {
    title: "Smart Notifications",
    desc: "Get automatic reminders for invoices due in 3 days, due today, or overdue, so you never miss a payment."
  },
  {
    title: "Client Page",
    desc: "View all invoices for each client, send reminders, and track payment history with ease."
  },
  {
    title: "Multi-Currency Support",
    desc: "Select the currency in which you want to issue each invoice — perfect for billing international clients."
  },
  {
    title: "Invoice Theme Color Customization",
    desc: "Personalize your invoice appearance by choosing a color theme that matches your brand."
  }
]
.map((feature, index) => (
            <motion.div 
              key={feature.title}
              variants={staggerItem}
              whileHover={{ scale: 1.02, y: -5 }}
              className="flex items-center gap-[20px] bg-white w-full max-w-[800px] cursor-pointer rounded-xl shadow-md hover:shadow-lg py-[15px] px-[20px] my-[15px] border border-purple-100/50 hover:border-purple-200 transition-all"
            >
              <motion.div 
                className="w-[30px] h-[30px] bg-gradient-to-br from-purple-600 to-purple-800 rounded-full flex items-center justify-center shrink-0"
                whileHover={{ rotate: 90 }}
              >
                <p className="text-white text-lg">+</p>
              </motion.div>
              <div>
                <h1 className="text-gray-800 font-bold text-lg">
                  {feature.title}
                </h1>
                <p className="text-gray-500 text-sm">{feature.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Pricing Section
     
      {/* FAQ Section */}
      <motion.div 
        ref={faqRef}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        
      >
        <FAQSection />
      </motion.div>

      {/* Footer section */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mt-[100px]"
      >
        <motion.div 
          className="w-full h-[1px] bg-gradient-to-r from-transparent via-purple-300 to-transparent"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        />

        <div className="flex justify-center items-center py-[20px]">
          <p className="text-sm text-gray-500">
            &copy; All rights reserved {year} - Claukk
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Home;