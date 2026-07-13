import type { JSX } from 'react'

export default function Nav(): JSX.Element {
  return (
    <header>
      <nav
        className="flex flex-row py-5 px-5 md:px-20 items-center gap-2 md:gap-5 border border-b border-gray-200 relative"
        aria-label="Pawket"
      >
        <img
          src="/svgs/cat-paw.svg"
          alt=""
          className="w-auto h-15 md:h-20"
          aria-hidden="true"
        />
        <div className="w-auto flex flex-col">
          <h1 className="text-4xl">Pawket</h1>
          <p className="text-sm mt-auto">Cat Expense Tracker</p>
        </div>

        <img
          src="/svgs/peeking-cat.svg"
          alt=""
          className="w-auto h-10 md:h-20 absolute -bottom-1.5 md:-bottom-3 right-0"
          aria-hidden="true"
        />
      </nav>
    </header>
  )
}
