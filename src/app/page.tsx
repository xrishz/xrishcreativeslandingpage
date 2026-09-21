import { Header } from "@/components/Header";
import { Portfolio } from "@/components/Portfolio";
import { Footer } from "@/components/Footer";
import { CameraCursor } from "@/components/CameraCursor";
export default function Home() {
  return (
    <div id="top">
      <CameraCursor />
      <Header />
      <main id="main">
        <Portfolio />
      </main>
      <Footer />
    </div>
  );
}
