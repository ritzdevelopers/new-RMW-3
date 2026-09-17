import { Approach } from "@/components/home/Approach";
import { Hero } from "@/components/home/Hero";
import { Marquee } from "@/components/home/Marquee";
import { SelectedWork } from "@/components/home/SelectedWork";
import { ParallaxMedia } from "@/components/motion/ParallaxMedia";

export default function Home() {
  return (
    <>
      <Hero />
      <div className="relative mx-6 h-[70vh] overflow-hidden md:mx-10 md:h-[85vh]">
        <ParallaxMedia
          src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=2000&q=80"
          alt="Cinematic interior used as a motion study"
          priority
        />
      </div>
      <Marquee />
      <SelectedWork />
      <Approach />
    </>
  );
}
