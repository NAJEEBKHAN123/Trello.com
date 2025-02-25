import React from 'react'
import Logout from '../pages/Logout'

function Navbar() {
  return (
    <div className="flex justify-end items-center bg-gray-500 h-20 p-10 w-full">
  <div className=" bg-red-500 px-4 py-2  rounded-md">
    <Logout />
  </div>
</div>

  )
}

export default Navbar