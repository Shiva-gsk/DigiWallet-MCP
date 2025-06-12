"use client"

import { updatePhoneNumber } from "@/app/actions/verifyPhoneNum";
import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";

// Define the schema for validation
const phoneSchema = z.object({
  phoneNumber: z.string()
    .min(10, "Phone number must be at least 10 digits")
    .regex(/^\+?[0-9\s\-()]+$/, "Invalid phone number format")
});

type PhoneFormValues = z.infer<typeof phoneSchema>;

export default function PhoneNumberForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState('');
  const { user } = useUser();
  
  const { 
    register, 
    handleSubmit: handleFormSubmit, 
    setValue,
    formState: { errors },
    reset,
    watch
  } = useForm<PhoneFormValues>({
    resolver: zodResolver(phoneSchema),
    defaultValues: {
      phoneNumber: '',
    }
  });

  async function onSubmit(data: PhoneFormValues) {
    if(!user) return;
    
    setStatus("loading");
    
    try {
      const result = await updatePhoneNumber(user.id, data.phoneNumber);
      setMessage(result.message);
      console.log(register);
      setStatus("success");
      
      // Reset form after successful submission
      setTimeout(() => {
        reset();
        setMessage('');
        setStatus("idle");
      }, 3000);
    } catch (error) {
      setMessage("Failed to update phone number. Please try again.");
      setStatus("error");
      console.log(error);
    }
  }
  
  return (
    <div className="flex justify-center min-w-[90vw] bg-gray-100 p-6">
      <form 
        onSubmit={handleFormSubmit(onSubmit)} 
        className="bg-white p-6 rounded-lg shadow-lg w-96 space-y-6"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800">Update Phone Number</h2>
        
        <div className="space-y-2">
          <label className="block text-gray-700 font-medium">
            Phone Number:
          </label>
          <PhoneInput
            value={watch("phoneNumber")}
            // value={register("phoneNumber").value}
            onChange={(value) => setValue("phoneNumber", value)}
            className="mt-1 w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
          />
          {errors.phoneNumber && (
            <p className="text-red-500 text-sm">{errors.phoneNumber.message}</p>
          )}
        </div>
      
        <button 
          type="submit" 
          disabled={status === "loading"}
          className={`w-full py-3 rounded-lg font-medium transition ${
            status === "loading" 
              ? "bg-gray-400 cursor-not-allowed" 
              : "bg-black text-white hover:bg-zinc-700"
          }`}
        >
          {status === "loading" ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : "Update Phone Number"}
        </button>
        
        {message && (
          <div className={`p-3 rounded-lg text-center font-medium ${
            status === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}>
            {message}
          </div>
        )}
        
        <p className="text-xs text-gray-500 text-center">
          We&apos;ll only use your phone number for account security and verification purposes.
        </p>
      </form>
    </div>
  );
}