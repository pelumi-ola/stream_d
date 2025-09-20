import React from "react";
import { LogoSvg, FaLinkedinIn, FaFacebookF, FaTwitter } from "@/assets";
import Image from "next/image";

function Footer() {
  return (
    <footer className="bg-gradient-to-r from-purple-900 to-purple-800 dark:from-gray-900 dark:to-gray-800 py-12 w-full mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-20 flex flex-col md:flex-row justify-between items-center gap-8">
        {/* Left: Copyright */}
        <p
          className="text-sm flex items-center gap-2 text-purple-100 dark:text-gray-400 cursor-pointer 
                      transition-transform duration-300 hover:scale-105 hover:text-white"
        >
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-white text-purple-900 text-xs">
            ©
          </span>
          2025 Stream-D | Football Highlight
        </p>

        {/* Center: Logo */}
        <div className="flex flex-col items-center gap-2 cursor-pointer transition-transform duration-300 hover:scale-110">
          <div className="relative w-20 h-20">
            <Image
              src={LogoSvg}
              alt="Logo"
              fill
              sizes="80px"
              priority
              className="object-contain"
            />
          </div>

          {/* <Image src={LogoSvg} alt="Logo" width={50} height={50} /> */}
          <p className="text-purple-300 dark:text-gray-400 font-semibold text-sm hover:text-white transition-colors duration-300">
            Stream D
          </p>
        </div>

        {/* Right: Social Links */}
        <div className="flex space-x-4">
          {[FaLinkedinIn, FaFacebookF, FaTwitter].map((Icon, idx) => (
            <a
              key={idx}
              href="#"
              className="w-10 h-10 flex items-center justify-center rounded-full border border-white text-white 
                         hover:bg-white hover:text-purple-900 transition-all duration-300 shadow-lg hover:shadow-purple-500/50"
            >
              <Icon size={16} />
            </a>
          ))}
        </div>
      </div>

      {/* Optional bottom divider */}
      <div className="mt-8 border-t border-purple-700 dark:border-gray-800"></div>
    </footer>
  );
}

export default Footer;
