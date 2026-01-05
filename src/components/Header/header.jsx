import React from 'react'
import { Container } from '../index'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import logo from '../../../src/assets/logo_nitanp.webp'
import { logout } from '../../store/authSlice' // adjust path if needed
import authService from '../../appwrite/auth'

function Header() {
  const authStatus = useSelector((state) => state.auth.status)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  const navItems = [
    { name: 'Home', slug: "/", show: true },
    { name: "Login", slug: "/login", show: !authStatus },
    { name: "Signup", slug: "/signup", show: !authStatus },
    { name: "Dashboard", slug: "/dashboard", show: authStatus }
  ]

  const handleLogout = async () => {
  await authService.logout();   // 🔥 kill session
  dispatch(logout());           // 🔥 clear Redux
  navigate("/");           // 🔥 redirect
};

  return (
    <header className="w-full shadow-lg">
      
      {/* Top Banner */}
      <div className="w-full bg-gradient-to-br from-slate-900 via-slate-900 to-black border-b border-white/5">
        <Container>
          <nav className="flex items-center justify-center py-3">
            <Link to="/" className="flex-shrink-0">
              <img
                src={logo}
                alt="NIT Andhra Pradesh"
                className="h-auto max-h-12 object-contain w-full"
              />
            </Link>
          </nav>
        </Container>
      </div>

      {/* Navigation */}
      <div className="bg-[#0b1220] border-b border-slate-800 pt-1 pb-3">
        <Container>
          <ul className="flex flex-wrap justify-center items-center gap-10 md:gap-14">
            
            {navItems.map(
              (item) =>
                item.show && (
                  <li key={item.name}>
                    <button
                      onClick={() => navigate(item.slug)}
                     className={`relative cursor-pointer text-[12px] font-semibold tracking-[0.2em] uppercase transition-all duration-300
  ${
    location.pathname === item.slug
      ? "text-emerald-400"
      : "text-slate-400 hover:text-white"
  }`}
                    >
                      {item.name}

                      {location.pathname === item.slug && (
                        <span className="absolute left-0 -bottom-2 w-full h-[2px] bg-emerald-400 rounded-full" />
                      )}
                    </button>
                  </li>
                )
            )}

            {/* Logout – same style, no special button */}
            {authStatus && (
              <li>
                <button
                  onClick={handleLogout}
                  className="relative cursor-pointer text-[12px] font-semibold tracking-[0.2em] uppercase
           text-slate-400 hover:text-red-400 transition-all duration-300"
                >               
                  Logout
                </button>
              </li>
            )}
          </ul>
        </Container>
      </div>
    </header>
  )
}

export default Header


