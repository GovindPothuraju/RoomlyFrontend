const companies = [
  "Google",
  "Microsoft",
  "Slack",
  "Spotify",
  "Dropbox",
  "Notion",
  "Stripe",
  "Zoom",
];

export default function TrustedCompanies() {
  return (
    <section className="bg-white py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h3 className="text-3xl font-bold text-slate-900">
          Trusted By{" "}
          <span className="text-cyan-400">
            100+ Users
          </span>
        </h3>

        <p className="mt-3 text-slate-500">
          Growing teams rely on RoomLY for productive meetings
          and smarter collaboration.
        </p>

        <div className="mt-12 overflow-hidden">
          <div className="flex animate-marquee whitespace-nowrap gap-16">
            {[...companies, ...companies].map(
              (company, index) => (
                <span
                  key={index}
                  className="
                    text-2xl
                    font-semibold
                    text-slate-400
                    grayscale
                    hover:grayscale-0
                    hover:text-slate-900
                    transition-all
                    cursor-pointer
                  "
                >
                  {company}
                </span>
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
}