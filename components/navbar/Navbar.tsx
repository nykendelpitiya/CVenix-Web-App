"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

const LOGO_IMAGE = "/cvenix-logo.png";

const navItems = [
  { label: "Home", href: "/", sectionId: "home" },
  { label: "Features", href: "/features", sectionId: "features" },
  { label: "How It Works", href: "/how-it-works", sectionId: "how-it-works" },
  { label: "About", href: "/about", sectionId: "about" },
];

export default function Navbar() {
  const pathname = usePathname();

  const [open, setOpen] = useState(false);
  const [scrollActiveSection, setScrollActiveSection] = useState("home");

  const activeSection =
    pathname === "/features"
      ? "features"
      : pathname === "/how-it-works"
        ? "how-it-works"
        : pathname === "/about"
          ? "about"
          : pathname === "/"
            ? scrollActiveSection
            : "";

  useEffect(() => {
    if (pathname !== "/") {
      return;
    }

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 160;

      const sections = navItems
        .map((item) => item.sectionId)
        .map((id) => document.getElementById(id))
        .filter(Boolean) as HTMLElement[];

      let currentSection = "home";

      sections.forEach((section) => {
        if (scrollPosition >= section.offsetTop) {
          currentSection = section.id;
        }
      });

      setScrollActiveSection(currentSection);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  const handleNavClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    href: string,
    sectionId: string
  ) => {
    setOpen(false);

    if (pathname === "/" && href.startsWith("#")) {
      event.preventDefault();

      const section = document.getElementById(sectionId);

      if (section) {
        section.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }
  };

  return (
    <header className="fixed left-0 top-4 z-50 w-full px-3 sm:top-5 sm:px-4">
      <div className="mx-auto flex max-w-6xl items-center justify-between rounded-full border border-white/15 bg-[#050816]/95 px-3 py-3 shadow-2xl shadow-black/50 ring-1 ring-white/10 backdrop-blur-xl sm:px-4">
        <Link
          href="/"
          prefetch={true}
          scroll={false}
          onClick={() => setOpen(false)}
          className="flex items-center gap-3"
        >
          <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-white shadow-lg shadow-white/20 sm:h-12 sm:w-12">
            <Image
              src={LOGO_IMAGE}
              alt="CVenix Logo"
              width={44}
              height={44}
              className="h-10 w-10 object-cover sm:h-11 sm:w-11"
              unoptimized
            />
          </div>

          <h1 className="text-base font-semibold tracking-wide text-white sm:text-lg">
            CVenix
          </h1>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => {
            const isActive = activeSection === item.sectionId;

            return (
              <Link
                key={item.label}
                href={item.href}
                prefetch={true}
                scroll={false}
                onClick={(event) =>
                  handleNavClick(event, item.href, item.sectionId)
                }
                className={`relative rounded-full px-5 py-2 text-sm font-medium transition-all duration-300 ease-out active:scale-[0.98] ${
                  isActive
                    ? "bg-white/10 text-cyan-300 shadow-lg shadow-cyan-500/10"
                    : "text-white hover:bg-white/10 hover:text-blue-300"
                }`}
              >
                {item.label}

                {isActive && (
                  <span className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-cyan-300 shadow-[0_0_14px_rgba(103,232,249,0.9)]" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link
            href="/login"
            prefetch={true}
            scroll={false}
            className="rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm font-medium text-white transition duration-200 ease-out hover:bg-white/10 hover:text-blue-300 active:scale-[0.98]"
          >
            Login
          </Link>

          <Link
            href="/register"
            prefetch={true}
            scroll={false}
            className="rounded-full bg-white px-6 py-2 text-sm font-semibold text-black shadow-lg shadow-white/20 transition duration-200 ease-out hover:scale-[1.02] hover:bg-gray-200 active:scale-[0.98]"
          >
            Get Started
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white transition duration-200 ease-out hover:bg-white/10 active:scale-[0.95] lg:hidden"
          aria-label="Toggle navigation menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="mx-auto mt-3 w-full max-w-sm rounded-3xl border border-white/10 bg-[#050816]/95 p-4 shadow-2xl shadow-black/50 backdrop-blur-xl lg:hidden">
          <div className="flex flex-col gap-2">
            {navItems.map((item) => {
              const isActive = activeSection === item.sectionId;

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  prefetch={true}
                  scroll={false}
                  onClick={(event) =>
                    handleNavClick(event, item.href, item.sectionId)
                  }
                  className={`rounded-2xl px-5 py-3 text-left text-sm font-medium transition-all duration-200 ease-out active:scale-[0.98] ${
                    isActive
                      ? "border border-cyan-300/20 bg-cyan-300/10 text-cyan-300"
                      : "text-white hover:bg-white/10 hover:text-blue-300"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}

            <div className="mt-2 h-px bg-white/10" />

            <Link
              href="/login"
              prefetch={true}
              scroll={false}
              onClick={() => setOpen(false)}
              className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-left text-sm font-medium text-white transition duration-200 ease-out hover:bg-white/10 hover:text-blue-300 active:scale-[0.98]"
            >
              Login
            </Link>

            <Link
              href="/register"
              prefetch={true}
              scroll={false}
              onClick={() => setOpen(false)}
              className="rounded-2xl bg-white px-5 py-3 text-center text-sm font-semibold text-black transition duration-200 ease-out hover:bg-gray-200 active:scale-[0.98]"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}