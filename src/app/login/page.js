
import React from 'react'
import Login from '@/app/component/Login'
export const metadata ={
  title : "WashHub | Login"}

const login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 px-4">
      <Login/>
    </div>
  )
}

export default login
