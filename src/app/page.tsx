import Image from "next/image";
import Hero from "./component/Hero";
import StatisticsSection from "./component/StatisticsSection";

export default function Home() {
  return (
    <div>
      <Hero/>
      <StatisticsSection></StatisticsSection>
    </div>
  );
}
