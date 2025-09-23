import React from "react";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { LogoSide, VideoIcon } from "@/assets";
import Image from "next/image";
import Link from "next/link";

function About() {
  return (
    <section
      id="about"
      className="py-10 shadow-lg rounded-lg dark:bg-[#1E2939] bg-hover mx-auto overflow-x-clip"
    >
      <div className="mx-auto px-4 sm:px-6 lg:px-8 overflow-x-clip">
        <div className="grid lg:grid-cols-2 items-center overflow-x-clip">
          {/* Left Side - Stream D Logo */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            viewport={{ once: true }} // animate only once
            className="flex items-center justify-center"
          >
            <div className="relative w-full max-w-[500px] aspect-square">
              <Image
                src={LogoSide}
                alt="logo"
                fill
                priority
                sizes="(max-width: 768px) 250px, (max-width: 1024px) 400px, 500px"
                className="object-contain"
              />
            </div>

            {/* <Image src={LogoSide} width={500} height={500} alt="StreamD Logo" /> */}
          </motion.div>

          {/* Right Side - How it Works */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-6 px-8 overflow-x-clip"
          >
            <h2 className="text-3xl font-bold text-chart dark:text-hover mb-6">
              How Stream D Works
            </h2>

            <div className="space-y-4 text-chart dark:text-hover leading-relaxed">
              <p>
                <strong> Stream-D</strong> is your all-in-one digital platform
                for official football highlights, live scores, and live matches
                accessible anytime, on any device, straight from your browser.
              </p>

              <p>
                Catch every moment from the Premier League, Champions League, La
                Liga, Serie A, Europa League, and more with our official video
                highlights.
              </p>

              {/*Footer text */}
              <div className="mt-6 text-sm text-gray-500 dark:text-gray-400">
                <p>To subscribe, dial *13035# or send SD to 13035.</p>
                <p>T&amp;Cs apply.</p>
              </div>
            </div>

            {/* Subscribe Card with Scale Animation */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
              viewport={{ once: true }}
              className="flex justify-end overflow-x-clip"
            >
              <div className="bg-primary rounded-2xl py-3 px-6 text-center w-60 h-55">
                <div className="flex justify-center">
                  <Image
                    src={VideoIcon}
                    alt="video icon"
                    width={80}
                    height={80}
                    priority
                    className="w-16 h-auto"
                  />
                </div>
                {/* <div className="flex justify-center items-center">
                  <Image
                    src={VideoIcon}
                    alt="subvideo"
                    width={80}
                    height={80}
                  />
                </div> */}
                <div className="text-3xl font-bold text-white mb-2">₦ 100</div>
                <div className="text-white mb-2">Daily</div>
                <Link href="/login">
                  <Button className="bg-white text-primary hover:bg-gray-100 font-semibold px-8 py-2 rounded-full">
                    Get Started
                  </Button>
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default About;
