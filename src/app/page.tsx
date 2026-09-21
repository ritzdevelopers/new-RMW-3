import { Awards } from "@/components/home/Awards";
import { Credentials } from "@/components/home/Credentials";
import { Engines } from "@/components/home/Engines";
import { Growth } from "@/components/home/Growth";
import { Hero } from "@/components/home/Hero";
import { Highways } from "@/components/home/Highways";
import { StartProject } from "@/components/home/StartProject";
import { Moved } from "@/components/home/Moved";
import { News } from "@/components/home/News";
import { Reviews } from "@/components/home/Reviews";
import { Roadbook } from "@/components/home/Roadbook";
import { Route } from "@/components/home/Route";
import { Ticker } from "@/components/home/Ticker";

export default function Home() {
  return (
    <>
      <Hero />
      <div className="proof-pin">
        <Ticker />
        <Credentials />
      </div>
      <Route />
      <Engines />
      <Growth />
      <Roadbook />
      <Moved />
      <Reviews />
      <Awards />
      <News />
      <Highways />
      <StartProject />
    </>
  );
}
