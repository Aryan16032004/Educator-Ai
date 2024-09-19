import React from 'react'
import { ModalProvider } from './ModalContext.jsx'
import {Outlet} from 'react-router-dom'
import Header from './Components/Header'

function Layout() {
  return (
    <div>
      <ModalProvider>
      <Header/>
      <Outlet/>
      </ModalProvider>
    </div>
  )
}

export default Layout


// can do the same thing in app.jsx 