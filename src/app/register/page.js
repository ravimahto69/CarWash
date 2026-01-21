import React from 'react'
import Register from '@/app/component/Register'

export const metadata ={
  title : "WashHub | SignUp"}

const register = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 px-4">
      <Register />
    </div>
  )
}

export default register