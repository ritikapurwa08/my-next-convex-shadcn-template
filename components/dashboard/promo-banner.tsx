import Image from "next/image";

export function PromoBanner() {
  return (
    <section className="mt-12 overflow-hidden rounded-xl bg-primary relative h-48 flex items-center px-12">
      <div className="absolute right-0 top-0 h-full w-1/2 opacity-20 pointer-events-none overflow-hidden">
        {/* Using a standard img tag here to avoid next/image domain config issues for now */}
        <Image
          alt="Library Books"
          width={100}
          height={100}
          className="object-cover w-full h-full grayscale mix-blend-overlay"
          src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=2000&auto=format&fit=crop"
        />
      </div>
      <div className="relative z-10 max-w-lg">
        <h4 className="text-2xl font-headline font-bold text-white mb-2">
          Mock Test Series 2024
        </h4>
        <p className="text-primary-fixed-dim text-sm font-label">
          Challenge yourself with timed simulated exams designed by academic
          experts.
        </p>
        <button className="mt-4 px-6 py-2 bg-white text-primary font-bold rounded-lg text-sm hover:bg-opacity-90 transition-all">
          Enroll Now
        </button>
      </div>
    </section>
  );
}
