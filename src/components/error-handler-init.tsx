'use client'

import { useEffect } from 'react'
import { globalErrorHandler } from '@/lib/error-handler'
import { useToast } from '@/hooks/use-toast'

export function ErrorHandlerInit() {
  const { toast } = useToast()

  useEffect(() => {
    // 注册全局错误处理器
    const handleError = (error: Error) => {
      // 只显示非剪贴板相关的错误
      if (!error.message.includes('Clipboard') && 
          !error.message.includes('writeText') && 
          !error.message.includes('permissions policy')) {
        toast({
          title: "⚠️ Bir Hata Oluştu",
          description: "Beklenmedik bir hata oluştu. Lütfen sayfayı yenileyin.",
          variant: "destructive"
        })
      }
    }

    globalErrorHandler.onError(handleError)

    return () => {
      globalErrorHandler.removeErrorCallback(handleError)
    }
  }, [toast])

  return null
}