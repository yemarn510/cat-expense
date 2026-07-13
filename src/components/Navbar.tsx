import type { JSX } from 'react'

export default function Nav(): JSX.Element {
  return <nav className='flex flex-row p-5 items-center gap-2'>
    <img src="svgs/cat-paw.svg" alt="pawket icon" className='w-auto h-20' />
    <div className='w-auto flex flex-col'>
      <h1 className='text-4xl'>Pawket</h1>
      <h2 className='text-sm mt-auto'>Cat Expense Tracker</h2>
    </div>
  </nav>
}