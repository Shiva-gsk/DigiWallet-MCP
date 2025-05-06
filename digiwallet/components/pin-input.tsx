"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Input } from "@/components/ui/input"

interface PinInputProps {
  length: number
  onComplete: (pin: string) => void
}

export function PinInput({ length, onComplete }: PinInputProps) {
  const [pin, setPin] = useState<string[]>(Array(length).fill(""))
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    // Focus the first input on mount
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus()
    }
  }, [])

  const handleChange = (index: number, value: string) => {
    // Only allow numbers
    if (!/^\d*$/.test(value)) return

    const newPin = [...pin]
    // Take only the last character if multiple are pasted
    newPin[index] = value.slice(-1)
    setPin(newPin)

    // If a digit was entered and there's a next input, focus it
    if (value && index < length - 1) {
      inputRefs.current[index + 1]?.focus()
    }

    // Check if all digits are filled
    const newPinString = newPin.join("")
    if (newPinString.length === length) {
      onComplete(newPinString)
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle backspace
    if (e.key === "Backspace") {
      if (!pin[index] && index > 0) {
        // If current input is empty and backspace is pressed, focus previous input
        const newPin = [...pin]
        newPin[index - 1] = ""
        setPin(newPin)
        inputRefs.current[index - 1]?.focus()
      }
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text/plain").trim()

    // Check if pasted content is all digits and not longer than our pin length
    if (!/^\d+$/.test(pastedData)) return

    const newPin = [...pin]
    const digits = pastedData.split("").slice(0, length)

    digits.forEach((digit, index) => {
      if (index < length) {
        newPin[index] = digit
      }
    })

    setPin(newPin)

    // Focus the appropriate input after paste
    if (digits.length < length) {
      inputRefs.current[digits.length]?.focus()
    } else {
      inputRefs.current[length - 1]?.focus()
      // If all digits are filled, call onComplete
      onComplete(newPin.join(""))
    }
  }

  return (
    <div className="flex justify-center space-x-2">
      {Array.from({ length }).map((_, index) => (
        <Input
          key={index}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={pin[index]}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
          className="h-12 w-12 text-center text-xl"
        />
      ))}
    </div>
  )
}

