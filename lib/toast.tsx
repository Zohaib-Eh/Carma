"use client"

import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle2, XCircle, Copy } from "lucide-react"
import { useState, useEffect } from "react"

interface ToastProps {
  type: 'success' | 'error'
  title: string
  message: string
  duration?: number
}

let toastCallback: ((props: ToastProps) => void) | null = null

export function showToast(props: ToastProps) {
  if (toastCallback) {
    toastCallback(props)
  }
}

export function ToastContainer() {
  const [toast, setToast] = useState<ToastProps | null>(null)

  useEffect(() => {
    toastCallback = (props: ToastProps) => {
      setToast(props)
      setTimeout(() => {
        setToast(null)
      }, props.duration || 5000)
    }

    return () => {
      toastCallback = null
    }
  }, [])

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    // Could show a mini notification here
  }

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: -100, x: '-50%' }}
          animate={{ opacity: 1, y: 20, x: '-50%' }}
          exit={{ opacity: 0, y: -100, x: '-50%' }}
          className="fixed top-0 left-1/2 z-[9999] w-full max-w-md px-4"
        >
          <div
            className={`rounded-xl shadow-2xl backdrop-blur-xl border-2 p-4 ${
              toast.type === 'success'
                ? 'bg-green-500/90 border-green-400'
                : 'bg-red-500/90 border-red-400'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                {toast.type === 'success' ? (
                  <CheckCircle2 className="w-6 h-6 text-white" />
                ) : (
                  <XCircle className="w-6 h-6 text-white" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-bold text-lg mb-1">{toast.title}</h3>
                <div className="flex items-center gap-2 group">
                  <p className="text-white/90 text-sm break-all">
                    {toast.message.length > 50 
                      ? `${toast.message.substring(0, 20)}...${toast.message.substring(toast.message.length - 20)}`
                      : toast.message
                    }
                  </p>
                  {toast.message.length > 20 && (
                    <button
                      onClick={() => copyToClipboard(toast.message)}
                      className="flex-shrink-0 p-1 hover:bg-white/20 rounded transition-colors"
                      title="Copy full hash"
                    >
                      <Copy className="w-4 h-4 text-white" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
