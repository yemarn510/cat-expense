import type { JSX } from 'react'

export default function Nav(): JSX.Element {
  return <nav className='flex flex-row py-5 px-5 md:px-20  items-center gap-3 border border-b border-gray-200 relative'>
    <img src="/svgs/cat-paw.svg" alt="pawket icon" className='w-auto h-15 md:h-20' />
    <div className='w-auto flex flex-col'>
      <h1 className='text-4xl'>Pawket</h1>
      <h2 className='text-sm mt-auto'>Cat Expense Tracker</h2>
    </div>

    <img src="/svgs/peeking-cat.svg" alt="peeking cat" className='w-auto h-10 md:h-20 absolute -bottom-1.5 md:-bottom-3 right-0' />
  </nav>
}
