"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IoIosCall, CircleArrowRight } from "@/assets";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useLoginStore } from "@/context/store/useLoginStore";
import { loginApi } from "@/lib/api";
import { z } from "zod";
import { SuccessModal } from "@/components/success-modal";
import BackButton from "@/components/BackButton";
import { LoginImage, StreamdLogo } from "@/assets";
import { useAuthStore } from "@/context/store/useAuthStore";

const phoneSchema = z.string().min(10, "Phone Number is required");

export default function LoginPage() {
  const [phone, setPhone] = useState("");
  const { login } = useAuth();
  const router = useRouter();
  const { modal, setModal, closeModal, loading, setLoading } = useLoginStore();
  const { user, lastMsisdn } = useAuthStore();

  useEffect(() => {
    if (user?.msisdn && !user?.is_first_time) {
      setPhone(user.msisdn);
    } else if (lastMsisdn) {
      // ✅ if user is logged out, fallback to last used msisdn
      setPhone(lastMsisdn);
    }
  }, [user, lastMsisdn]);

  const handleLogin = async () => {
    const result = phoneSchema.safeParse(phone);
    if (!result.success) {
      setModal({
        title: "Error",
        message: "Phone number is required",
        type: "error",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await loginApi(phone);

      if (!response.success) {
        setModal({
          title: "Error",
          message: response.message,
          type: "error",
        });
        return;
      }

      const userData = response.data;

      if (userData.status === "active") {
        login(userData);
        setModal({
          title: "Login Successful",
          message: response.message,
          type: "login",
          actionData: userData,
        });
      } else if (userData.subscription_link) {
        setModal({
          title: `Your Subscription Status: ${userData.status}`,
          message: response.message,
          type: "subscribe",
          actionLink: userData.subscription_link,
        });
      } else {
        setModal({
          title: `Your Subscription Status: ${userData.status}`,
          message: response.message,
          type: "info",
        });
      }
    } catch (err) {
      setModal({
        title: "Error",
        message: err.message,
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-primary/51 flex items-center justify-center">
      <div className="absolute top-3 left-3">
        <BackButton href="/" label="Home" />
      </div>
      {/* Main Card */}
      <div className="w-full md:w-[900px] md:h-[560px] bg-white rounded-2xl shadow-xl flex overflow-hidden">
        {/* Left - Form */}
        <div className="w-full md:w-1/2 px-6 py-6 md:px-10">
          <div className="flex justify-center mb-6">
            <Image
              src={StreamdLogo}
              alt="logo"
              width={120}
              height={120}
              priority
              style={{ width: "120px", height: "auto" }} // ✅ keeps natural ratio
              className="max-h-[120px]" // ✅ ensures it won't grow too big
            />
          </div>

          {/* <div className="flex justify-center mb-6">
            <Image src={StreamdLogo} width={120} height={120} alt="logo" />
          </div> */}

          <div className="flex flex-col justify-center mt-6">
            <label className="text-sm font-bold text-ring2 mb-2">
              Phone Number
            </label>
            <div className="relative mb-4">
              <IoIosCall className="absolute left-3 top-4 text-primary text-lg" />
              <Input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0903XXXXXXXX or 0902XXXXXXX"
                className="pl-10 h-12 rounded-full border-gray-300 dark:text-black"
              />
              <p className="text-[12px] text-ring2 mb-3">
                Use MTN or Airtel Phone Number
              </p>
            </div>
          </div>

          <div className="relative mt-15">
            <Button
              onClick={handleLogin}
              disabled={loading}
              className="flex justify-start w-full h-12 bg-primary hover:bg-hover-button text-white font-bold rounded-full"
            >
              {loading ? "Please wait..." : "Get Started"}
            </Button>
            <CircleArrowRight className="absolute text-center text-white top-3 right-2" />
          </div>
        </div>

        {/* Right - Image */}

        <div className="hidden md:block md:w-1/2 relative">
          <Image
            src={LoginImage}
            alt="Football"
            fill
            priority
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
        {/* <div className="hidden md:block md:w-1/2 relative">
          <Image
            src={LoginImage}
            alt="Football"
            fill
            className="object-cover"
          />
        </div> */}
      </div>

      <SuccessModal
        isOpen={modal.open}
        onClose={closeModal}
        title={modal.title}
        message={modal.message}
        type={modal.type}
        buttons={
          modal.type === "subscribe"
            ? [
                {
                  label: "Cancel",
                  variant: "default",
                  action: closeModal,
                },
                {
                  label: "Subscribe",
                  variant: "primary",
                  action: async () => {
                    if (modal.actionLink) {
                      router.push(modal.actionLink);
                    }
                    closeModal();
                  },
                },
              ]
            : modal.type === "login"
            ? [
                {
                  label: "Continue",
                  variant: "primary",
                  action: () => {
                    closeModal();
                    router.push("/");
                  },
                },
              ]
            : [
                {
                  label: "Close",
                  variant: modal.type === "error" ? "error" : "default",
                  action: closeModal,
                },
              ]
        }
      />
    </div>
  );
}
