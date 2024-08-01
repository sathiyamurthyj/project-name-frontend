import React from 'react'

// loader animation
function Loader() {
  return (
    <div className='flex justify-center items-center fixed inset-0 bg-black opacity-80 z-[200]'>
        <div className='h-10 w-10 border-4 border-white border-solid border-t-transparent rounded-full animate-spin'>
        </div>
    </div>
  )
}

export default Loader;