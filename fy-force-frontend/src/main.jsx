import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";
import './style/main.css'
import './index.css'
import MatchMaking from './views/MatchMaking.jsx';



createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
        <MatchMaking />
    </BrowserRouter>
  </StrictMode>,
)
