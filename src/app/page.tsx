import { Header } from "@/components/Header";
import { Portfolio } from "@/components/Portfolio";
import { Footer } from "@/components/Footer";
export default function Home() {
  return (
    <div id="top">
      <Header />
      <main id="main">
        <Portfolio />
      </main>
      <Footer />
    </div>
  );
}
