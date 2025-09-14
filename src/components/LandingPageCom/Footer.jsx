import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  LogoSvg,
  FaArrowRight,
  FaLinkedinIn,
  FaFacebookF,
  FaTwitter,
} from "@/assets";
import Image from "next/image";

function Footer() {
  return (
    <div>
      <footer className="bg-purple-900 dark:bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-20 py-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="">
              <div className="flex items-center space-x-2">
                <Image src={LogoSvg} alt="Logo" width={80} height={80} />
              </div>
              <p className="text-purple-200 dark:text-gray-300 text-sm leading-relaxed lg:w-[20vw] mb-4">
                Stream D is your all-in-one platform for live football matches,
                past games, exciting highlights and up-to-the-minute scores.
              </p>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <ul className="flex flex-row gap-10">
                <div className="space-y-8 text-sm">
                  <li>
                    <a
                      href="#"
                      className="text-purple-200 dark:text-gray-300 hover:text-white transition-colors"
                    >
                      Home
                    </a>
                  </li>
                  <li>
                    <a
                      href="#highlights"
                      className="text-purple-200 dark:text-gray-300 hover:text-white transition-colors"
                    >
                      Highlights
                    </a>
                  </li>
                  <li>
                    <a
                      href="#StreamD"
                      className="text-purple-200 dark:text-gray-300 hover:text-white transition-colors"
                    >
                      Best Of Stream D
                    </a>
                  </li>
                  <li>
                    <a
                      href="/Login"
                      className="text-purple-200 dark:text-gray-300 hover:text-white transition-colors"
                    >
                      Login
                    </a>
                  </li>
                </div>
                <div className="space-y-8 text-sm">
                  <li>
                    <a
                      href="#Live Matches"
                      className="text-purple-200 dark:text-gray-300 hover:text-white transition-colors"
                    >
                      Live Matches
                    </a>
                  </li>
                  <li>
                    <a
                      href="#all-goals"
                      className="text-purple-200 dark:text-gray-300 hover:text-white transition-colors"
                    >
                      All Goals
                    </a>
                  </li>
                  <li>
                    <a
                      href="#top-matches"
                      className="text-purple-200 dark:text-gray-300 hover:text-white transition-colors"
                    >
                      Top Football Competitions
                    </a>
                  </li>
                  <li>
                    <a
                      href="#about"
                      className="text-purple-200 dark:text-gray-300 hover:text-white transition-colors"
                    >
                      How Stream D works
                    </a>
                  </li>
                </div>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Subscribe</h4>
              <div className="flex relative">
                <Input
                  placeholder="Enter Phone Number"
                  className="bg-white/10 dark:bg-gray-800/50 border-white/20 dark:border-gray-600/30 text-white placeholder:text-gray-300"
                />
                <Button className="bg-muted absolute right-0 hover:bg-hover hover:text-primary text-white font-semibold">
                  <FaArrowRight />
                </Button>
              </div>
            </div>
          </div>

          <div className="flex flex-row justify-between border-t border-purple-800 dark:border-gray-700 mt-5 pt-5 text-center">
            <div className="flex space-x-4">
              <a
                href="#"
                className="w-10 h-10 flex items-center justify-center rounded-full border border-white text-white hover:bg-white hover:text-purple-800 transition"
              >
                <FaLinkedinIn size={16} />
              </a>
              <a
                href="#"
                className="w-10 h-10 flex items-center justify-center rounded-full border border-white text-white hover:bg-white hover:text-purple-800 transition"
              >
                <FaFacebookF size={16} />
              </a>
              <a
                href="#"
                className="w-10 h-10 flex items-center justify-center rounded-full border border-white text-white hover:bg-white hover:text-purple-800 transition"
              >
                <FaTwitter size={16} />
              </a>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-purple-300 dark:text-gray-400 text-sm">
                A product of
              </p>
              <Image src={LogoSvg} alt="Logo" width={50} height={50} />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Footer;
