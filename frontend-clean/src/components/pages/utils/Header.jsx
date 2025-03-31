import React from 'react'
import { Link, useNavigate } from 'react-router-dom'


const Header = () => {
  const handleLogout = () => {
   
    localStorage.removeItem("token");
    localStorage.removeItem("membership");
   
    navigate("/");
  };
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  return (
    <header className="flex flex-wrap items-center justify-between p-4 border-b border-gray-700">
    <img src="photo/logo.png" alt="logo" />
    <nav className="flex space-x-4">
      <Link to="/" className="text-gray-400 hover:text-white">Anasayfa</Link>
      <Link to="/pricing" className="text-gray-400 hover:text-white">Paketler ve Fiyatlar</Link>
    </nav>
    <div>
    {token ? (
          
          <div className='space-x-4'>
            <Link to="/pano" className="text-gray-400 hover:text-white">Panolarım</Link>
          <button
            onClick={handleLogout}
            className="px-4 py-2 border border-red-500 text-red-500 rounded-md
                       hover:bg-red-500 hover:text-white transition"
          >
            Çıkış Yap
          </button>
          </div>
          
        ) : (
        
          <>
            <Link
              to="/login"
              className="px-4 py-2 border border-blue-500 text-blue-500
                         rounded-md hover:bg-blue-500 hover:text-white transition"
            >
              Giriş Yap
            </Link>
            <Link
              to="/register"
              className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md
                         hover:bg-blue-600 transition"
            >
              Kayıt Ol
            </Link>
          </>
        )}
      
    </div>
   
    
  </header>
  )
}

export default Header