import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Local font hosting via Fontsource — avoids cross-origin CSS blocks that
// prevent html-to-image from embedding fonts in SVG foreignObject exports.
import '@fontsource/dm-sans/300.css'
import '@fontsource/dm-sans/300-italic.css'
import '@fontsource/dm-sans/400.css'
import '@fontsource/dm-sans/400-italic.css'
import '@fontsource/dm-sans/500.css'
import '@fontsource/dm-sans/600.css'
import '@fontsource/dm-sans/700.css'
import '@fontsource/fraunces/700.css'
import '@fontsource/fraunces/700-italic.css'
import '@fontsource/plus-jakarta-sans/400.css'
import '@fontsource/plus-jakarta-sans/500.css'
import '@fontsource/plus-jakarta-sans/600.css'
import '@fontsource/plus-jakarta-sans/700.css'
import '@fontsource/plus-jakarta-sans/800.css'
import '@fontsource/sora/400.css'
import '@fontsource/sora/600.css'
import '@fontsource/sora/700.css'
import '@fontsource/sora/800.css'

createRoot(document.getElementById('root')).render(<App />)
