import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Form from "./Form"
import Error from './Components/Error'
import ShowRandomMovie from './Components/ShowRandomMovie'

function App() {
  
  return (
    <div className='bg-white min-h-screen w-screen'>
     <BrowserRouter>
     <Routes>
        <Route path="/" element={<Form />} />
        <Route path="*" element={<Error />} />
        <Route path="/RandomMovie" element={<ShowRandomMovie />} />
      </Routes>
     </BrowserRouter>
    </div>
  )
}

export default App
