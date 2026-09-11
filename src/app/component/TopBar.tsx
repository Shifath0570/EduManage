"use client";

import {
  FaPhoneAlt,
  FaEnvelope,
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const TopBar = () => {
  return (
    <div className="w-full bg-[#1d2433] text-white">
      <div className="mx-auto flex h-[40px] max-w-[1320px] items-center justify-between px-4 text-[13px]">
        
        {/* Left Side */}
        <div className="flex items-center">
          
          {/* Phone */}
          <div className="flex items-center gap-3 pr-6">
            <FaPhoneAlt className="text-[16px] text-[#f5c542]" />
            <span>(705) 569-0123</span>
          </div>

          {/* Divider */}
          <div className="h-5 w-px bg-gray-500/60" />

          {/* Email */}
          <div className="flex items-center gap-3 pl-6">
            <FaEnvelope className="text-[17px] text-[#f5c542]" />
            <span>info@intogmail.com</span>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center">
          
          {/* Login / Register */}
          <div className="flex items-center gap-3 pr-7">
            <a
              href="/login"
              className="transition-colors hover:text-[#f5c542]"
            >
              Login
            </a>

            <span>/</span>

            <a
              href="/register"
              className="transition-colors hover:text-[#f5c542]"
            >
              Register
            </a>
          </div>

          {/* Divider */}
          <div className="h-5 w-px bg-gray-500/60" />

          {/* Social Media */}
          <div className="flex items-center gap-4 pl-7">
            <span className="mr-1">Follow On:</span>

            <a
              href="#"
              aria-label="Facebook"
              className="transition-colors hover:text-[#f5c542]"
            >
              <FaFacebookF size={14} />
            </a>

            <a
              href="#"
              aria-label="X"
              className="transition-colors hover:text-[#f5c542]"
            >
              <FaXTwitter size={14} />
            </a>

            <a
              href="#"
              aria-label="Instagram"
              className="transition-colors hover:text-[#f5c542]"
            >
              <FaInstagram size={15} />
            </a>

            <a
              href="#"
              aria-label="LinkedIn"
              className="transition-colors hover:text-[#f5c542]"
            >
              <FaLinkedinIn size={15} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;