
import {StatisticsSection} from "./component/StatisticsSection";
import QuestionsSection from "./component/QuestionsSection";
import {WhyChooseUs} from "./component/WhyChooseUs";
import {Testimonials} from "./component/Testimonials";
import Hero from "./component/Hero";
import { AboutSchool } from "./component/AboutSchool";
import { FeaturedSection } from "./component/FeaturedSection";
import { NoticeAndBlog } from "./component/Notice";


export default function Home() {
  return (
    <div>
      <Hero></Hero>
      <AboutSchool></AboutSchool>
      <FeaturedSection></FeaturedSection>
      <StatisticsSection />
      <NoticeAndBlog></NoticeAndBlog>
      <WhyChooseUs/>
      <Testimonials/>
      <QuestionsSection />
    </div>
  );
}
