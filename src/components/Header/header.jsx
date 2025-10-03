import React from 'react'
import { Container, LogoutBtn } from '../index'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

// Note: Ensure this path is correct based on where your component and image are located
import logo from '../../../src/assets/logo_nitanp.webp'

function Header() {
  const authStatus = useSelector((state) => state.auth.status)
  const navigate = useNavigate()

  // Define nav items for the new orange bar
  const navItems = [
    { name: 'Home', slug: "/", active: true },
    { name: "Login", slug: "/login", active: !authStatus },
    { name: "Signup", slug: "/signup", active: !authStatus },
    { name: "Dashboard", slug: "/dashboard", active: authStatus },
    { name: "Add New", slug: "/add_new", active: authStatus },
    // You can add more static items here if needed, like "ADMINISTRATION", "ACADEMICS", etc.
  ]

  return (
    <header className='w-full shadow-lg sticky top-0 z-50'>
      {/* ========================================
        1. Top Banner Section (Dark Background)
        ========================================
      */}
      <div style={{ backgroundColor: '#2A364F' }}>
        <Container>
          <nav className='flex items-center justify-center py-2'> 
            {/* Logo/Banner Area */}
            <Link to='/' className='flex-shrink-0'>
              <img 
                src={logo} 
                alt="NIT Andhra Pradesh Banner" 
                // Adjusted max-width to allow the full banner to show horizontally
                className='h-auto max-h-24 object-contain w-full' 
              />
            </Link>
          </nav>
        </Container>
      </div>

      {/* ========================================
        2. Navigation Section (Orange Background)
        ========================================
      */}
      <div 
        className='py-2 shadow-md' 
        // Set the distinct orange/brown background color
        style={{ backgroundColor: '#A0522D' }} // This hex is Saddle Brown, which looks close to the image
      >
        <Container>
          <ul className='flex flex-wrap justify-center items-center space-x-4'>
            {navItems.map((item) =>
              item.active ? (
                <li key={item.name}>
                  <button
                    onClick={() => navigate(item.slug)}
                    // Style the buttons to look like simple orange-bar links
                    className='text-white uppercase text-sm font-semibold tracking-wider px-10 py-1 duration-200 hover:text-yellow-300' 
                  >
                    {item.name}
                  </button>
                </li>
              ) : null
            )}
            
            {/* Logout Button */}
            {authStatus && (
              <li>
                <LogoutBtn />
              </li>
            )}

          </ul>
        </Container>
      </div>
    </header>
  )
}

export default Header