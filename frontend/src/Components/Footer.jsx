import React from 'react'
import { FaXTwitter } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";


const Footer = () => {
  return (
    <footer className='bg-orange-400 text-white text-center p-3 h-20 mt-5'>
    <p className='text-md'>
    TastyNest &copy; 2026  All Rights Reserved.</p>
    <p className='text-md '>
         Contact- SupportTastyNest@gmail.Com
        </p>
      <div className=' flex gap-4 justify-center'>  <FaXTwitter /> <FaInstagram /> <FaFacebook /></div>


    </footer>
  )
}

export default Footer