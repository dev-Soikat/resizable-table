import { useState } from "react";
import { MdOutlineLightMode, MdDarkMode } from 'react-icons/md';

const App = () => {
  const [dark, setDark] = useState(false);

  const toggleDarkMode = () => setDark(!dark);

  return (
    <div className={dark && 'dark'}>
      <div className="dark:bg-black h-[100vh]">
        <div className='flex justify-between items-center p-4'>
          <p className="text-red-500 dark:text-yellow-500 font-qsand text-3xl">Soikat's Stantech Assignment</p>

          <div className='border border-black dark:border-white rounded-full p-1 cursor-pointer' onClick={toggleDarkMode}>
            {dark ? <MdOutlineLightMode className="text-white" /> : <MdDarkMode />}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
