'use client'

// 全局错误处理器
export class GlobalErrorHandler {
  private static instance: GlobalErrorHandler
  private errorCallbacks: Array<(error: Error) => void> = []

  private constructor() {
    this.setupGlobalErrorHandlers()
  }

  static getInstance(): GlobalErrorHandler {
    if (!GlobalErrorHandler.instance) {
      GlobalErrorHandler.instance = new GlobalErrorHandler()
    }
    return GlobalErrorHandler.instance
  }

  private setupGlobalErrorHandlers() {
    // 处理未捕获的JavaScript错误
    if (typeof window !== 'undefined') {
      window.addEventListener('error', (event) => {
        this.handleError(new Error(event.message))
        event.preventDefault()
      })

      // 处理未捕获的Promise拒绝
      window.addEventListener('unhandledrejection', (event) => {
        this.handleError(new Error(event.reason))
        event.preventDefault()
      })
    }
  }

  private handleError(error: Error) {
    // 过滤掉剪贴板权限错误
    if (error.message.includes('Clipboard') || 
        error.message.includes('writeText') || 
        error.message.includes('permissions policy')) {
      console.warn('Clipboard permission error (filtered):', error.message)
      return
    }

    console.error('Global error caught:', error)
    
    // 通知所有注册的错误回调
    this.errorCallbacks.forEach(callback => {
      try {
        callback(error)
      } catch (callbackError) {
        console.error('Error in error callback:', callbackError)
      }
    })
  }

  onError(callback: (error: Error) => void) {
    this.errorCallbacks.push(callback)
  }

  removeErrorCallback(callback: (error: Error) => void) {
    const index = this.errorCallbacks.indexOf(callback)
    if (index > -1) {
      this.errorCallbacks.splice(index, 1)
    }
  }
}

// 导出单例实例
export const globalErrorHandler = GlobalErrorHandler.getInstance()