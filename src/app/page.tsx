import Hero from "./component/Hero";
import StatisticsSection from "./component/StatisticsSection";
import QuestionsSection from "./component/QuestionsSection";
import WhyChooseUs from "./component/WhyChooseUs";
import Testimonials from "./component/Testimonials";

export default function Home() {
  return (
    <div>
      <Hero />
      <StatisticsSection />
      <QuestionsSection />
      <WhyChooseUs/>
      <Testimonials/>
    </div>
  );
}
