import type { Metadata } from "next";
import { AboutDrive } from "@/components/about/AboutDrive";
import { AboutFounder } from "@/components/about/AboutFounder";
import { AboutHero } from "@/components/about/AboutHero";
import { AboutJourney } from "@/components/about/AboutJourney";
import { AboutMileage } from "@/components/about/AboutMileage";
import { AboutProofs } from "@/components/about/AboutProofs";
import { Highways } from "@/components/home/Highways";
import { StartProject } from "@/components/home/StartProject";

export const metadata: Metadata = {
  title: "About",
};

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <AboutDrive />
      <AboutMileage />
      <AboutJourney />
      <AboutProofs />
      <AboutFounder />
      <Highways />
      <StartProject />
    </>
  );
}
