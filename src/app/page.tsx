import Hero from "./component/Hero";
import StatisticsSection from "./component/StatisticsSection";
import QuestionsSection from "./component/QuestionsSection";
import WhyChooseUs from "./component/WhyChooseUs";
import Testimonials from "./component/Testimonials";
import Notice from "./component/Notice";
import FeaturedSection from "./component/FeaturedSection";
import AboutSchool from "./component/AboutSchool";


export default function Home() {
  return (
    <div>
      <Hero />
      <AboutSchool />
      <FeaturedSection />
      <StatisticsSection />
      <Notice />
      <WhyChooseUs/>
      <Testimonials/>
      <QuestionsSection />
    </div>
  );
}
