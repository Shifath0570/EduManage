import Hero from "./component/Hero";
import StatisticsSection from "./component/StatisticsSection";
import QuestionsSection from "./component/QuestionsSection";
import WhyChooseUs from "./component/WhyChooseUs";
import Testimonials from "./component/Testimonials";
import Notice from "./component/Notice";


export default function Home() {
  return (
    <div>
      <Hero />
      <StatisticsSection />
      <Notice />
      <WhyChooseUs/>
      <Testimonials/>
      <QuestionsSection />
    </div>
  );
}
