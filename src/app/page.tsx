import Atmosphere from "@/components/sections/Atmosphere";
import BookingSection from "@/components/sections/BookingSection";
import FinalCTA from "@/components/sections/FinalCTA";
import Hero from "@/components/sections/Hero";
import Program from "@/components/sections/Program";
import PromoMeditation from "@/components/sections/PromoMeditation";
import Review from "@/components/sections/Review";
import ThreeStepFlow from "@/components/sections/ThreeStepFlow";
import Section from "@/components/ui/Section";
import Image from "next/image";

export default function Home() {
  return (
    <div>

      <div className="hidden md:block">


        <Section bleed bg="vignette" maxW="7xl" className="ring-1 ring-white/5 min-h-screen">
          <Hero />
          <PromoMeditation
            mainSrc="/images/promo/main.jpg"
            circleSrc="/images/promo/circle.jpg"
          />
          <Atmosphere />
          <Program />
          <ThreeStepFlow />
          <Review />
          <FinalCTA
            whatsappPhone="+18133776678"
            whatsappText="Hola 👋 Quiero reservar una sesión de 90 min este viernes por la tarde. ¿Disponibilidad?"
          />
        </Section>
      </div>
      <div className=" block md:hidden py-4">
        <Hero />
        <PromoMeditation
          mainSrc="/images/promo/main.jpg"
          circleSrc="/images/promo/circle.jpg"
        />
        <Atmosphere />
        <Program />
        <ThreeStepFlow />
        <Review />
        <FinalCTA
          whatsappPhone="+18133776678"
          whatsappText="Hola 👋 Quiero reservar una sesión de 90 min este viernes por la tarde. ¿Disponibilidad?"
        />
      </div> </div>
  );
}
