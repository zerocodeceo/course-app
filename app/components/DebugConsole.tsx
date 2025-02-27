"use client"
import { useState, useEffect } from 'react'

// Store logs in memory
let logs: string[] = []

// Override console methods
const originalConsole = {
  log: console.log,
  error: console.error,
  warn: console.warn
}

// Create a function to add logs
export const addLog = (type: 'log' | 'error' | 'warn', ...args: unknown[]) => {
  const log = `[${type.toUpperCase()}] ${args.map(arg => {
    try {
      return typeof arg === 'object' ? JSON.stringify(arg) : arg
    } catch (e) {
      return arg
    }
  }).join(' ')}`
  logs = [...logs, log].slice(-50) // Keep last 50 logs
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('newLog'))
  }
}

// Override console methods
console.log = (...args) => {
  originalConsole.log(...args)
  addLog('log', ...args)
}

console.error = (...args) => {
  originalConsole.error(...args)
  addLog('error', ...args)
}

console.warn = (...args) => {
  originalConsole.warn(...args)
  addLog('warn', ...args)
}

export function DebugConsole() {
  const [isVisible, setIsVisible] = useState(false)
  const [localLogs, setLocalLogs] = useState<string[]>([])

  useEffect(() => {
    const handleNewLog = () => {
      setLocalLogs([...logs])
    }

    window.addEventListener('newLog', handleNewLog)
    return () => window.removeEventListener('newLog', handleNewLog)
  }, [])

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 bg-gray-800 text-white p-2 rounded-full z-50"
      >
        🐛
      </button>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 w-[90vw] max-w-[400px] h-[300px] bg-gray-800 text-white p-4 rounded-lg overflow-hidden z-50">
      <div className="flex justify-between items-center mb-2">
        <h3>Debug Console</h3>
        <button onClick={() => setIsVisible(false)}>✕</button>
      </div>
      <div className="h-[calc(100%-2rem)] overflow-auto text-xs font-mono">
        {localLogs.map((log, i) => (
          <div 
            key={i} 
            className={`py-1 ${
              log.includes('[ERROR]') 
                ? 'text-red-400' 
                : log.includes('[WARN]')
                  ? 'text-yellow-400'
                  : 'text-green-400'
            }`}
          >
            {log}
          </div>
        ))}
      </div>
    </div>
  )
} 