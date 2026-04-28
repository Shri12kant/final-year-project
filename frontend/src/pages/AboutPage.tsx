export function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <header className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
        <h1 className="text-2xl font-semibold tracking-tight text-[var(--text)]">
          About CommunityHub
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-[var(--text-muted)]">
          CommunityHub is a student-first discussion platform with a Reddit-style experience.
          Its goal is to help students share doubts, project updates, resources, and ideas in a
          safe and organized space.
        </p>
      </header>

      <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
        <h2 className="text-base font-semibold text-[var(--text)]">Why CommunityHub is important</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-[var(--text-muted)]">
          <li>Students get quick help without waiting for formal sessions.</li>
          <li>Peer-to-peer learning improves practical understanding.</li>
          <li>Discussion threads preserve useful knowledge over time.</li>
          <li>A healthy and moderated space builds collaborative culture.</li>
        </ul>
      </section>

      <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
        <h2 className="text-base font-semibold text-[var(--text)]">Key advantages</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-[var(--text-muted)]">
          <li>Topic-wise communities for focused and relevant conversations.</li>
          <li>Voting system helps surface useful and high-quality content.</li>
          <li>Threaded comments make problem-solving clear and structured.</li>
          <li>Authentication and protected actions improve platform trust.</li>
          <li>Scalable architecture: frontend + backend APIs ready for future features.</li>
        </ul>
      </section>
    </div>
  )
}
