import { gsap, ScrollTrigger } from "./gsap";

export function initTentangPageAnimations() {
	const page = document.querySelector<HTMLElement>('.route-stage[data-page-view="tentang"]');

	if (!page) {
		return () => {};
	}

	const mm = gsap.matchMedia();

	mm.add("(prefers-reduced-motion: no-preference)", () => {
		const sectionNavLinks = document.querySelectorAll<HTMLElement>(".section-nav-link");
		const sections = ["cerita", "misi", "nilai", "kepemimpinan", "kontak"];

		sections.forEach((id) => {
			const section = document.getElementById(id);
			const link = document.querySelector<HTMLElement>(`.section-nav-link[data-section="${id}"]`);
			if (!section || !link) {
				return;
			}

			ScrollTrigger.create({
				trigger: section,
				start: "top 40%",
				end: "bottom 40%",
				onEnter: () => {
					sectionNavLinks.forEach((item) => item.classList.remove("bg-teal", "text-white"));
					link.classList.add("bg-teal", "text-white");
				},
				onLeaveBack: () => {
					const index = sections.indexOf(id);
					const previous = sections[index - 1];
					sectionNavLinks.forEach((item) => item.classList.remove("bg-teal", "text-white"));
					if (previous) {
						const previousLink = document.querySelector<HTMLElement>(
							`.section-nav-link[data-section="${previous}"]`,
						);
						previousLink?.classList.add("bg-teal", "text-white");
					}
				},
			});
		});

		const heroTimeline = gsap.timeline({ delay: 0.2 });
		heroTimeline
			.from(".hero-tagline-label", {
				opacity: 0,
				duration: 0.6,
				ease: "power2.out",
			})
			.from(
				".hero-tagline",
				{
					opacity: 0,
					y: 24,
					duration: 0.8,
					ease: "power3.out",
				},
				"-=0.3",
			)
			.from(
				".hero-tagline-sub",
				{
					opacity: 0,
					y: 16,
					duration: 0.6,
					ease: "power2.out",
				},
				"-=0.4",
			)
			.from(
				".hero-thesis-block",
				{
					opacity: 0,
					y: 16,
					duration: 0.6,
					ease: "power2.out",
				},
				"-=0.3",
			)
			.from(
				".hero-scroll-indicator",
				{
					opacity: 0,
					duration: 0.5,
					ease: "power2.out",
				},
				"-=0.2",
			);

		const scrollLine = document.querySelector<HTMLElement>(".scroll-line");
		if (scrollLine) {
			gsap.fromTo(
				scrollLine,
				{ opacity: 0.25, scaleY: 1 },
				{
					opacity: 0.5,
					scaleY: 1.1,
					duration: 1,
					ease: "sine.inOut",
					repeat: -1,
					yoyo: true,
					delay: 1.5,
				},
			);
		}

		const ceritaBlocks = gsap.utils.toArray<HTMLElement>(".cerita-block");
		ceritaBlocks.forEach((block) => {
			gsap.from(block.querySelectorAll("p, h2"), {
				opacity: 0,
				y: 16,
				duration: 0.5,
				ease: "power2.out",
				stagger: 0.1,
				scrollTrigger: {
					trigger: block,
					start: "top 80%",
					once: true,
				},
				clearProps: "opacity,transform",
			});
		});

		gsap.from(".cerita-prose", {
			opacity: 0,
			scrollTrigger: {
				trigger: ".cerita-prose",
				start: "top 85%",
				once: true,
			},
			clearProps: "opacity",
		});

		gsap.from(".cerita-sidebar", {
			opacity: 0,
			scrollTrigger: {
				trigger: ".cerita-sidebar",
				start: "top 80%",
				once: true,
			},
			clearProps: "opacity",
		});

		gsap.from(".cerita-thesis", {
			opacity: 0,
			scrollTrigger: {
				trigger: ".cerita-thesis",
				start: "top 85%",
				once: true,
			},
			clearProps: "opacity",
		});

		const misiSection = document.querySelector<HTMLElement>("#misi");
		if (misiSection) {
			gsap.from(misiSection.querySelector("h2"), {
				opacity: 0,
				y: 16,
				duration: 0.5,
				ease: "power2.out",
				scrollTrigger: {
					trigger: misiSection,
					start: "top 80%",
					once: true,
				},
				clearProps: "opacity,transform",
			});

			gsap.from(misiSection.querySelectorAll(".misi-item"), {
				opacity: 0,
				y: 20,
				duration: 0.5,
				ease: "power2.out",
				stagger: 0.1,
				scrollTrigger: {
					trigger: misiSection.querySelector(".misi-item"),
					start: "top 85%",
					once: true,
				},
				clearProps: "opacity,transform",
			});
		}

		const nilaiSection = document.querySelector<HTMLElement>("#nilai");
		if (nilaiSection) {
			gsap.from(nilaiSection.querySelector("h2"), {
				opacity: 0,
				y: 16,
				duration: 0.5,
				ease: "power2.out",
				scrollTrigger: {
					trigger: nilaiSection,
					start: "top 80%",
					once: true,
				},
				clearProps: "opacity,transform",
			});

			gsap.from(nilaiSection.querySelectorAll(".nilai-item"), {
				opacity: 0,
				y: 20,
				duration: 0.5,
				ease: "power2.out",
				stagger: 0.08,
				scrollTrigger: {
					trigger: nilaiSection.querySelector(".nilai-item"),
					start: "top 85%",
					once: true,
				},
				clearProps: "opacity,transform",
			});
		}

		const leaderSection = document.querySelector<HTMLElement>("#kepemimpinan");
		if (leaderSection) {
			gsap.from(leaderSection.querySelector("h2"), {
				opacity: 0,
				y: 16,
				duration: 0.5,
				ease: "power2.out",
				scrollTrigger: {
					trigger: leaderSection,
					start: "top 80%",
					once: true,
				},
				clearProps: "opacity,transform",
			});

			gsap.from(leaderSection.querySelectorAll(".leader-card"), {
				opacity: 0,
				y: 24,
				duration: 0.55,
				ease: "power2.out",
				stagger: 0.1,
				scrollTrigger: {
					trigger: leaderSection.querySelector(".leader-card"),
					start: "top 85%",
					once: true,
				},
				clearProps: "opacity,transform",
			});
		}

		const kontakSection = document.querySelector<HTMLElement>("#kontak");
		if (kontakSection) {
			gsap.from(kontakSection.querySelectorAll(".kontak-content, .kontak-info"), {
				opacity: 0,
				y: 24,
				duration: 0.6,
				ease: "power2.out",
				stagger: 0.15,
				scrollTrigger: {
					trigger: kontakSection,
					start: "top 80%",
					once: true,
				},
				clearProps: "opacity,transform",
			});
		}
	});

	const updateSectionNav = () => {
		const sectionNav = document.getElementById("section-nav");
		const sectionNavLinks = document.querySelectorAll(".section-nav-link");
		if (window.scrollY > 20) {
			sectionNav?.classList.add("bg-white/95", "backdrop-blur-sm");
			sectionNavLinks.forEach((link) => {
				link.classList.remove("text-white/80", "hover:text-white", "hover:bg-white/10");
				link.classList.add("text-charcoal-mid", "hover:text-navy", "hover:bg-mist");
			});
			return;
		}

		sectionNav?.classList.remove("bg-white/95", "backdrop-blur-sm");
		sectionNavLinks.forEach((link) => {
			link.classList.remove("text-charcoal-mid", "hover:text-navy", "hover:bg-mist");
			link.classList.add("text-white/80", "hover:text-white", "hover:bg-white/10");
		});
	};

	window.addEventListener("scroll", updateSectionNav, { passive: true });
	updateSectionNav();

	return () => {
		window.removeEventListener("scroll", updateSectionNav);
		mm.revert();
	};
}
