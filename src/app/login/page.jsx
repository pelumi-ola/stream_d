// "use client";

// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Eye, EyeOff } from "lucide-react";
// import { SuccessModal } from "@/components/success-modal";
// import Image from "next/image";
// import { LoginImage, StreamdLogo, IoIosCall, CircleArrowRight } from "@/assets";
// import BackButton from "@/components/BackButton";
// import { useAuth } from "@/context/AuthContext";
// import { useRouter } from "next/navigation";

// export default function LoginPage() {
//   const [showPassword, setShowPassword] = useState(false);
//   const [showSuccessModal, setShowSuccessModal] = useState(false);
//   const { login } = useAuth();
//   const router = useRouter();
//   const [loading, setLoading] = useState();

//   const handleLogin = () => {
//     login(); // fake login
//     setShowSuccessModal(true);
//   };
//   // const handleLogin = () => {
//   //   setShowSuccessModal(true);
//   // };

//   return (
//     <div className="relative min-h-screen bg-primary/51 flex items-center justify-center">
//       <div className="absolute top-3 left-3">
//         <BackButton href="/" label="Home" className="" />
//       </div>
//       {/* Main Card */}
//       <div className="w-full md:w-[900px] md:h-[560px] bg-white rounded-2xl shadow-xl flex overflow-hidden">
//         {/* Left Side - Form */}
//         <div className="w-full md:w-1/2 px-6 py-6 md:px-10">
//           {/* Logo */}
//           <div className="flex items-center justify-center mb-6">
//             <Image
//               src={StreamdLogo}
//               width={120}
//               height={120}
//               alt="Streamd logo"
//               className="w-24 md:w-32 h-auto"
//             />
//           </div>

//           {/* Phone Input */}
//           <div className="mb-4">
//             <label className="block text-sm font-bold text-ring2 mb-2">
//               Phone Number
//             </label>
//             <div className="relative mb-4">
//               <IoIosCall className="absolute left-3 top-4 text-primary text-lg" />
//               <Input
//                 type={showPassword ? "text" : "password"}
//                 placeholder="0903XXXXXXXX or 0902XXXXXXX"
//                 className="pl-10 h-12 rounded-full border-gray-300 focus:border-hover-button focus:ring2-hover-button"
//               />
//               <button
//                 type="button"
//                 className="absolute inset-y-0 right-0 pr-3 flex items-center"
//                 onClick={() => setShowPassword(!showPassword)}
//               >
//                 {showPassword ? (
//                   <EyeOff className="h-5 w-5 text-primary" />
//                 ) : (
//                   <Eye className="h-5 w-5 text-primary" />
//                 )}
//               </button>
//               <p className="text-[12px] text-ring2 mb-3">
//                 Use MTN or Airtel Phone Number
//               </p>
//             </div>
//           </div>

//           {/* Get Started Button */}
//           <div className="relative mt-15">
//             <Button
//               onClick={handleLogin}
//               disabled={loading}
//               className="flex justify-start w-full h-12 bg-primary hover:bg-hover-button text-white font-bold rounded-full"
//             >
//               {loading ? "Please wait..." : "Get Started"}
//             </Button>
//             <CircleArrowRight className="absolute text-center text-white top-3 right-2" />
//           </div>
//         </div>

//         {/* Right Side - Football Players Image */}
//         <div className="hidden md:block md:w-1/2 relative">
//           <Image
//             src={LoginImage}
//             alt="Football players in action"
//             fill
//             className="object-cover"
//           />
//         </div>
//       </div>

//       {/* Success Modal */}
//       <SuccessModal
//         isOpen={showSuccessModal}
//         onClose={() => {
//           setShowSuccessModal(false);
//           router.push("/");
//         }}
//         title="Login Successful !!"
//         message="Wait to be redirected to your dashboard or close"
//         type="login"
//       />
//     </div>
//   );
// }

"use client";

import { useState } from "react";
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
import { Eye, EyeOff } from "lucide-react";

const phoneSchema = z.string().min(10, "Phone Number is required");

export default function LoginPage() {
  const [phone, setPhone] = useState("");
  const { user, login } = useAuth();
  const router = useRouter();
  const { modal, setModal, closeModal, loading, setLoading } = useLoginStore();
  const [showPassword, setShowPassword] = useState(false);
  const [userDataRef, setUserDataRef] = useState(null);

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
        setUserDataRef(userData);
        setModal({
          title: "Login Successful",
          message: response.message,
          type: "login",
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
            <Image src={StreamdLogo} width={120} height={120} alt="logo" />
          </div>

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
              {/* <button
                type="button"
                className="absolute inset-y-0 right-0 bottom-6 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-primary" />
                ) : (
                  <Eye className="h-5 w-5 text-primary" />
                )}
              </button> */}
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
            className="object-cover"
          />
        </div>
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
                      if (user?.msisdn) {
                        setLoading(true);
                        try {
                          const response = await loginApi(user.msisdn);
                          if (response.data.status === "active") {
                            login(response.data);
                            router.push("/");
                          }
                        } catch (err) {
                          console.error("Re-check failed:", err);
                        } finally {
                          setLoading(false);
                        }
                      }
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
                    if (userDataRef) {
                      login(userDataRef);
                      router.push("/");
                    }
                    closeModal();
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
