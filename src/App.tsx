import { useCallback, useState } from "react";
import IntroSplash from "./components/IntroSplash";
import NavBar from "./components/NavBar";
import Hero from "./components/Hero";
import Footer from "./components/Footer";

export default function App() {
  // Flips true once the intro splash begins revealing the page, so hero
  // animations (e.g. the counting stats) play in view rather than behind it.
  const [revealed, setRevealed] = useState(false);
  const reveal = useCallback(() => setRevealed(true), []);

  return (
    <>
      <IntroSplash onReveal={reveal} />
      <a
        href="#apply"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-aiesec focus:px-5 focus:py-2.5 focus:font-bold focus:text-white"
      >
        Skip to application form
      </a>
      <NavBar />
      <main>
        <Hero revealed={revealed} />
      </main>
      <Footer />
    </>
  );
}
