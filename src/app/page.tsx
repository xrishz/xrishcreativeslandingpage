import { Header } from "@/components/Header";
import { Portfolio } from "@/components/Portfolio";
import { Footer } from "@/components/Footer";
import { IntroLoader } from "@/components/IntroLoader";
export default function Home() {
  return (
    <div id="top">
      <IntroLoader />
      <Header />
      <main id="main">
        <Portfolio />
      </main>
      <Footer />
    </div>
  );
}
