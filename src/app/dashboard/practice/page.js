import ChatBox from "@/components/practice/ChatBox";
import QuizBox from "@/components/practice/QuizBox";
import SectionHeader from "@/components/ui/SectionHeader";

export default function PracticePage() {
  return (
    <div className="space-y-8">
      <SectionHeader
        title="Practice"
        description="Chat with your AI tutor or run a quick quiz session."
      />
      <div className="grid gap-6 lg:grid-cols-2">
        <ChatBox />
        <QuizBox />
      </div>
    </div>
  );
}
