import { Image002, Image001 } from "@/assets";
import Image from "next/image";

export function FeaturedMatch() {
  return (
    <div className="flex relative text-white p-6 bg-gradient-to-r from-red-800 to-red-900 rounded-lg md:w-full">
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="flex items-center">
        <Image
          src={Image002}
          width={500}
          height={500}
          alt="England Player"
          className=""
        />
      </div>
      <div className="flex flex-col items-center justify-center">
        <div className="flex flex-col text-center mb-6">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
            <div className="w-6 h-6 bg-white rounded-full"></div>
          </div>
          <div className="text-xs opacity-80">FIFA WORLD CUP</div>
          <div className="text-xs opacity-80">QATAR 2022</div>
        </div>

        <div className="text-center mb-6">
          <h2 className="text-xl font-bold mb-1">England vs Germany</h2>
          <p className="text-sm opacity-80">Sunday, 21 January 2022</p>
        </div>

        <div className="text-center">
          <div className="flex items-center gap-4 text-2xl font-bold">
            <div>03</div>
            <span>:</span>
            <span>12</span>
            <span>:</span>
            <span>43</span>
            <span>:</span>
            <span>14</span>
          </div>
          <div className="flex gap-5 items-center text-center text-xs opacity-80">
            <span>Days</span>
            <br />
            <span>Hours</span>
            <br />
            <span>Minutes</span>
            <span> Seconds</span>
          </div>
        </div>
      </div>

      <div className="flex items-center">
        <Image
          src={Image001}
          width={500}
          height={500}
          alt="Germany Player"
          className=""
        />
      </div>
    </div>
  );
}