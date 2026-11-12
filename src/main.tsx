import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { applyBaseFontSize, readBaseFontSize } from '@/components/generator/typography'
import App from './App.tsx'

applyBaseFontSize(readBaseFontSize(), false)
applyBaseFontSize(readBaseFontSize('tcm-csc'), false, 'tcm-csc')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
