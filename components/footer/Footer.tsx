// Inline SVG icons used for social links

function IconGithub({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 .5a12 12 0 00-3.79 23.4c.6.1.82-.26.82-.58v-2.03c-3.34.73-4.04-1.6-4.04-1.6-.55-1.4-1.34-1.77-1.34-1.77-1.09-.75.08-.74.08-.74 1.2.08 1.83 1.24 1.83 1.24 1.07 1.82 2.8 1.29 3.48.99.11-.78.42-1.29.77-1.59-2.66-.3-5.46-1.33-5.46-5.92 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.17 0 0 1.01-.32 3.3 1.23a11.4 11.4 0 016 0c2.28-1.55 3.29-1.23 3.29-1.23.66 1.65.24 2.87.12 3.17.77.84 1.24 1.9 1.24 3.22 0 4.6-2.8 5.61-5.47 5.91.43.37.81 1.1.81 2.22v3.29c0 .32.22.69.83.57A12 12 0 0012 .5z"
        fill="currentColor"
      />
    </svg>
  );
}

function IconLinkedin({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4.98 3.5a2.5 2.5 0 11-.01 5.001A2.5 2.5 0 014.98 3.5zM3 8.99h4v12H3v-12zM9 8.99h3.84v1.64h.05c.54-1 1.86-2.05 3.83-2.05 4.1 0 4.86 2.7 4.86 6.21v7.2h-4v-6.38c0-1.52-.03-3.47-2.11-3.47-2.11 0-2.43 1.64-2.43 3.36v6.49H9v-12z"
        fill="currentColor"
      />
    </svg>
  );
}

function IconTwitter({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M20 6.54c-.54.24-1.12.4-1.73.48.62-.37 1.09-.96 1.31-1.66-.58.34-1.22.59-1.9.73A3.27 3.27 0 0013.5 6c0 .28.03.55.09.81-2.72-.14-5.13-1.44-6.74-3.42-.28.5-.44 1.08-.44 1.7 0 1.17.6 2.2 1.51 2.8-.5-.02-.97-.15-1.38-.38v.04c0 1.64 1.17 3.01 2.72 3.32-.28.08-.58.12-.89.12-.22 0-.43-.02-.64-.06.44 1.36 1.7 2.35 3.2 2.38A6.56 6.56 0 015 18.14c.74.47 1.62.75 2.57.75 6.15 0 9.52-5.1 9.52-9.52v-.43c.65-.47 1.22-1.06 1.67-1.73-.59.26-1.22.44-1.88.52z"
        fill="currentColor"
      />
    </svg>
  );
}

function IconMail({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M3 8.5v7A2.5 2.5 0 005.5 18h13a2.5 2.5 0 002.5-2.5v-7"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M21 6.5l-9 6-9-6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-blue-500/10 bg-gradient-to-b from-[#020617] via-black to-[#050816] px-4 py-16 sm:px-6">
      {/* Top Blue Glow */}
      <div className="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-blue-500/10 blur-3xl" />

      {/* Bottom Blue Glow */}
      <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-blue-400/5 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-lg font-bold text-black shadow-lg shadow-white/20">
                C
              </div>

              <h2 className="text-2xl font-bold text-white">CVenix</h2>
            </div>

            <p className="mt-5 max-w-md text-sm leading-relaxed text-gray-400">
              Build professional resumes with modern templates, live preview,
              PDF export, and portfolio-ready layouts designed for students and
              professionals.
            </p>

            <div className="mt-6 flex items-center gap-4">
              <button className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-gray-300 transition duration-300 hover:border-blue-400/40 hover:bg-blue-500/10 hover:text-blue-300">
                <IconGithub />
              </button>

              <button className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-gray-300 transition duration-300 hover:border-blue-400/40 hover:bg-blue-500/10 hover:text-blue-300">
                <IconLinkedin />
              </button>

              <button className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-gray-300 transition duration-300 hover:border-blue-400/40 hover:bg-blue-500/10 hover:text-blue-300">
                <IconTwitter />
              </button>

              <button className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-gray-300 transition duration-300 hover:border-blue-400/40 hover:bg-blue-500/10 hover:text-blue-300">
                <IconMail />
              </button>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white">Quick Links</h3>

            <div className="mt-5 flex flex-col gap-3">
              {["Home", "Templates", "Features", "About"].map((item) => (
                <button
                  key={item}
                  className="w-fit text-sm text-gray-400 transition duration-300 hover:text-blue-400"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white">Resources</h3>

            <div className="mt-5 flex flex-col gap-3">
              {["Privacy Policy", "Terms & Conditions", "Support", "Contact"].map(
                (item) => (
                  <button
                    key={item}
                    className="w-fit text-sm text-gray-400 transition duration-300 hover:text-blue-400"
                  >
                    {item}
                  </button>
                )
              )}
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-blue-500/10 pt-6 text-center md:flex-row md:text-left">
          <p className="text-sm text-gray-500">
            © 2026 CVenix. All rights reserved.
          </p>

          <p className="text-sm text-gray-500">
            Designed & Developed with ❤️ using Next.js & Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  );
}