'use client'

import { useState, useCallback } from 'react'
import { useToast } from '@/hooks/use-toast'

interface UseClipboardOptions {
  timeout?: number
}

export function useClipboard(options: UseClipboardOptions = {}) {
  const { timeout = 2000 } = options
  const [isCopied, setIsCopied] = useState(false)
  const { toast } = useToast()

  const copy = useCallback(async (text: string) => {
    try {
      // 尝试使用现代剪贴板API
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text)
      } else {
        // 降级到传统方法
        const textArea = document.createElement('textarea')
        textArea.value = text
        textArea.style.position = 'fixed'
        textArea.style.left = '-999999px'
        textArea.style.top = '-999999px'
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()
        
        try {
          document.execCommand('copy')
        } catch (error) {
          throw new Error('Copy failed')
        } finally {
          document.body.removeChild(textArea)
        }
      }

      setIsCopied(true)
      toast({
        title: "✅ Kopyalandı!",
        description: "Metin panoya başarıyla kopyalandı.",
      })

      // 自动重置状态
      setTimeout(() => {
        setIsCopied(false)
      }, timeout)

      return true
    } catch (error) {
      console.error('Clipboard error:', error)
      toast({
        title: "❌ Kopyalama Başarısız",
        description: "Metin kopyalanamadı. Lütfen manuel olarak kopyalayın.",
        variant: "destructive"
      })
      return false
    }
  }, [timeout, toast])

  const reset = useCallback(() => {
    setIsCopied(false)
  }, [])

  return { copy, isCopied, reset }
}