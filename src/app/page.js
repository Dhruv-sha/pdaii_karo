import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-teal-500/30">
      <nav className="absolute top-0 z-50 flex w-full items-center justify-between px-6 py-6 md:px-12">
        <div className="font-serif text-2xl font-bold tracking-tight text-slate-900">
          Padai<span className="text-teal-600">Karo</span>.
        </div>
        <a
          href="/dashboard"
          className="rounded-full bg-slate-900 px-6 py-2 text-sm font-medium text-white transition hover:bg-slate-800 shadow-sm"
        >
          Go to Dashboard
        </a>
      </nav>

      {/* Hero Section */}
      <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden pt-20 text-center">
        {/* Glow Effects */}
        <div className="absolute top-1/4 -left-32 h-96 w-96 rounded-full bg-teal-200/50 blur-[120px]" />
        <div className="absolute bottom-1/4 -right-32 h-96 w-96 rounded-full bg-purple-200/50 blur-[120px]" />

        <div className="relative z-10 mx-auto max-w-4xl px-6 pt-12">
          <h1 className="mb-8 font-serif text-5xl font-medium tracking-tight md:text-7xl lg:text-8xl">
            Study smarter, <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-purple-600">not harder.</span>
          </h1>
          <p className="mx-auto mb-12 max-w-2xl text-lg text-slate-600 md:text-xl">
            Upload your syllabus and past papers. Our AI analyzes them to tell you exactly what topics to focus on, generating a personalized study plan that actually sticks.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="/dashboard/upload"
              className="group flex items-center justify-center gap-2 rounded-full bg-teal-600 px-8 py-4 text-base font-semibold text-white transition hover:bg-teal-500 shadow-md"
            >
              Start Learning Now
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transition-transform group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </a>
            <a
              href="#how-it-works"
              className="rounded-full border border-slate-300 bg-white/80 px-8 py-4 text-base font-semibold text-slate-700 backdrop-blur transition hover:bg-slate-100 shadow-sm"
            >
              See how it works
            </a>
          </div>
        </div>
      </main>

      {/* How it Works */}
      <section id="how-it-works" className="relative z-10 border-t border-slate-200 bg-white py-24 md:py-32">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-16 text-center">
            <h2 className="font-serif text-3xl font-medium md:text-5xl text-slate-900">Three steps to success</h2>
            <p className="mt-4 text-slate-600 md:text-lg">Skip the guesswork and dive straight into what matters.</p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {/* Step 1 */}
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 transition hover:bg-slate-100 shadow-sm hover:shadow-md">
              <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-100 text-xl font-bold text-teal-600">
                1
              </div>
              <h3 className="mb-3 text-2xl font-semibold text-slate-900">Upload Materials</h3>
              <p className="text-slate-600">
                Provide your syllabus and a few past question papers (PDF or Images). We'll handle the text extraction and cleaning.
              </p>
            </div>

            {/* Step 2 */}
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 transition hover:bg-slate-100 shadow-sm hover:shadow-md">
              <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-100 text-xl font-bold text-purple-600">
                2
              </div>
              <h3 className="mb-3 text-2xl font-semibold text-slate-900">AI Analysis</h3>
              <p className="text-slate-600">
                Our engine scores every topic based on how frequently it appears in exams and its overall coverage weight.
              </p>
            </div>

            {/* Step 3 */}
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 transition hover:bg-slate-100 shadow-sm hover:shadow-md">
              <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-xl font-bold text-blue-600">
                3
              </div>
              <h3 className="mb-3 text-2xl font-semibold text-slate-900">Get Results</h3>
              <p className="text-slate-600">
                View your dashboard to see your personalized study roadmap, highlighted weak areas, and practice quizzes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-slate-50 py-8 text-center text-sm text-slate-500">
        <p>© {new Date().getFullYear()} Padai Karo. Built for smarter students.</p>
      </footer>
    </div>
  );
}
