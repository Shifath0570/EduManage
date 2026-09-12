
import {StatisticsSection} from "./component/StatisticsSection";
import QuestionsSection from "./component/QuestionsSection";
import {WhyChooseUs} from "./component/WhyChooseUs";
import {Testimonials} from "./component/Testimonials";
import Hero from "./component/Hero";
import { AboutSchool } from "./component/AboutSchool";
import { FeaturedSection } from "./component/FeaturedSection";
import Notice from "./component/Notice";
import NoticeMarquee from "./component/NoticeMarquee";


export default function Home() {
  return (
    <div>
      <Hero></Hero>
      <NoticeMarquee></NoticeMarquee>
      <AboutSchool></AboutSchool>
      <FeaturedSection></FeaturedSection>
      <StatisticsSection />
      <Notice></Notice>
      <WhyChooseUs/>
      <Testimonials/>
      <QuestionsSection />
    </div>
  );
}
