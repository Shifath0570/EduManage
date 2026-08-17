import Hero from "./component/Hero";
import StatisticsSection from "./component/StatisticsSection";
import QuestionsSection from "./component/QuestionsSection";

export default function Home() {
  return (
    <div>
      <Hero />
      <StatisticsSection />
      <QuestionsSection />
    </div>
  );
}
