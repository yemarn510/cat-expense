import type { JSX } from "react/jsx-runtime";

export default function Footer(): JSX.Element {
  return <footer className="absolute bottom-0 left-0 -z-10">
    <img src="/images/cat-playing.png" alt="cat playing with yarn" className="w-50 h-auto" />
  </footer>
}