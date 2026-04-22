import { gsap, ScrollTrigger } from "./gsap";

const allScrollTriggers: ScrollTrigger[] = [];

function killAllScrollTriggers() {
	allScrollTriggers.forEach((st) => st.kill());
	allScrollTriggers.length = 0;
}

export function initPlatformAnimations() {
	const page = document.querySelector<HTMLElement>('.route-stage[data-page-view="platform"]');

	if (!page) {
		return () => {};
	}

	const heroLabel = page.querySelector<HTMLElement>(".hero-tagline-label");
	const heroHeading = page.querySelector<HTMLElement>(".hero-tagline");
	const heroCopy = page.querySelector<HTMLElement>(".platform-hero-copy");
	const heroStatsGroup = page.querySelector<HTMLElement>(".platform-stats");
	const heroStats = gsap.utils.toArray<HTMLElement>(".platform-stat", page);
	const heroScrollIndicator = page.querySelector<HTMLElement>(".hero-scroll-indicator");
	const heroSection = page.querySelector<HTMLElement>("#hero");
	const scrollLine = page.querySelector<HTMLElement>(".scroll-line");

	const ekosistemSection = page.querySelector<HTMLElement>("#ekosistem");
	const pelangganSection = page.querySelector<HTMLElement>("#pelanggan");
	const merchantSection = page.querySelector<HTMLElement>("#merchant");
	const enterpriseSection = page.querySelector<HTMLElement>("#enterprise");
	const trustSection = page.querySelector<HTMLElement>("#trust");
	const ctaSection = page.querySelector<HTMLElement>("#demo");

	const mm = gsap.matchMedia();

	mm.add("(prefers-reduced-motion: no-preference)", () => {
		if (heroLabel || heroHeading || heroCopy || heroStats.length || heroScrollIndicator) {
			const heroTimeline = gsap.timeline({
				defaults: {
					ease: "power3.out",
				},
			});

			if (heroLabel) {
				heroTimeline.from(heroLabel, {
					opacity: 0,
					y: 12,
					duration: 0.4,
					clearProps: "opacity,transform",
				});
			}

			if (heroHeading) {
				heroTimeline.from(
					heroHeading,
					{
						opacity: 0,
						y: 20,
						duration: 0.58,
						clearProps: "opacity,transform",
					},
					heroLabel ? "-=0.16" : 0,
				);
			}

			if (heroCopy) {
				heroTimeline.from(
					heroCopy,
					{
						opacity: 0,
						y: 16,
						duration: 0.42,
						clearProps: "opacity,transform",
					},
					heroLabel || heroHeading ? "-=0.28" : 0,
				);
			}

			if (heroStats.length) {
				heroTimeline.from(
					heroStats,
					{
						opacity: 0,
						y: 18,
						duration: 0.42,
						stagger: 0.06,
						clearProps: "opacity,transform",
					},
					heroLabel || heroHeading || heroCopy ? "-=0.18" : 0,
				);
			}

			if (heroScrollIndicator) {
				heroTimeline.from(
					heroScrollIndicator,
					{
						opacity: 0,
						y: 10,
						duration: 0.34,
						clearProps: "opacity,transform",
					},
					heroStats.length ? "-=0.14" : 0,
				);
			}

			if (scrollLine) {
				gsap.fromTo(
					scrollLine,
					{
						opacity: 0.25,
						scaleY: 1,
					},
					{
						opacity: 0.5,
						scaleY: 1.1,
						duration: 1,
						ease: "sine.inOut",
						repeat: -1,
						yoyo: true,
						delay: 0.2,
					},
				);
			}
		}

		if (heroSection && heroStatsGroup) {
			gsap.to(heroStatsGroup, {
				yPercent: -4,
				opacity: 0.72,
				ease: "none",
				scrollTrigger: {
					trigger: heroSection,
					start: "top top",
					end: "bottom top",
					scrub: 0.75,
				},
			});
		}

		if (heroSection && heroScrollIndicator) {
			gsap.to(heroScrollIndicator, {
				y: -22,
				opacity: 0,
				ease: "none",
				scrollTrigger: {
					trigger: heroSection,
					start: "top 15%",
					end: "bottom top",
					scrub: 0.55,
				},
			});
		}

		const revealOnScroll = (
			trigger: HTMLElement | null,
			elements: HTMLElement[],
			staggerAmount = 0.08,
		) => {
			if (!trigger) return;

			const st = ScrollTrigger.create({
				trigger,
				start: "top 82%",
				once: true,
				onEnter: () => {
					gsap.fromTo(
						elements,
						{ opacity: 0, y: 24 },
						{
							opacity: 1,
							y: 0,
							duration: 0.55,
							stagger: staggerAmount,
							ease: "power3.out",
							clearProps: "opacity,transform",
						},
					);
				},
			});
			allScrollTriggers.push(st);
		};

		const revealSectionHeader = (section: HTMLElement | null) => {
			if (!section) return;
			const header = section.querySelector<HTMLElement>(".platform-section-header");
			if (!header) return;

			const st = ScrollTrigger.create({
				trigger: header,
				start: "top 85%",
				once: true,
				onEnter: () => {
					gsap.fromTo(
						header.children,
						{ opacity: 0, y: 20 },
						{
							opacity: 1,
							y: 0,
							duration: 0.5,
							stagger: 0.1,
							ease: "power3.out",
							clearProps: "opacity,transform",
						},
					);
				},
			});
			allScrollTriggers.push(st);
		};

		revealSectionHeader(ekosistemSection);
		revealSectionHeader(pelangganSection);
		revealSectionHeader(merchantSection);
		revealSectionHeader(enterpriseSection);
		revealSectionHeader(trustSection);

		const ekosistemProse = ekosistemSection?.querySelector<HTMLElement>(".ekosistem-prose");
		const ekosistemSidebar = ekosistemSection?.querySelector<HTMLElement>(".ekosistem-sidebar");

		if (ekosistemProse) {
			const st = ScrollTrigger.create({
				trigger: ekosistemProse,
				start: "top 80%",
				once: true,
				onEnter: () => {
					gsap.fromTo(
						ekosistemProse,
						{ opacity: 0, y: 32 },
						{
							opacity: 1,
							y: 0,
							duration: 0.6,
							ease: "power3.out",
							clearProps: "opacity,transform",
						},
					);
				},
			});
			allScrollTriggers.push(st);
		}

		if (ekosistemSidebar) {
			const st = ScrollTrigger.create({
				trigger: ekosistemSidebar,
				start: "top 80%",
				once: true,
				onEnter: () => {
					gsap.fromTo(
						ekosistemSidebar,
						{ opacity: 0, y: 40 },
						{
							opacity: 1,
							y: 0,
							duration: 0.65,
							delay: 0.15,
							ease: "power3.out",
							clearProps: "opacity,transform",
						},
					);
				},
			});
			allScrollTriggers.push(st);
		}

		const customerCards = pelangganSection?.querySelectorAll<HTMLElement>(".platform-feature-card");
		if (customerCards?.length) {
			revealOnScroll(pelangganSection, Array.from(customerCards), 0.07);
		}

		const dashboardMockup = merchantSection?.querySelector<HTMLElement>(
			".platform-dashboard-mockup",
		);
		if (dashboardMockup) {
			const st = ScrollTrigger.create({
				trigger: dashboardMockup,
				start: "top 80%",
				once: true,
				onEnter: () => {
					gsap.fromTo(
						dashboardMockup,
						{ opacity: 0, y: 36, scale: 0.98 },
						{
							opacity: 1,
							y: 0,
							scale: 1,
							duration: 0.7,
							ease: "power3.out",
							clearProps: "opacity,transform",
						},
					);
				},
			});
			allScrollTriggers.push(st);
		}

		const merchantCaps = merchantSection?.querySelectorAll<HTMLElement>(
			".platform-capability-card",
		);
		if (merchantCaps?.length) {
			revealOnScroll(merchantSection, Array.from(merchantCaps), 0.06);
		}

		const enterpriseCards = enterpriseSection?.querySelectorAll<HTMLElement>(
			".platform-enterprise-card",
		);
		if (enterpriseCards?.length) {
			revealOnScroll(enterpriseSection, Array.from(enterpriseCards), 0.08);
		}

		const trustCards = trustSection?.querySelectorAll<HTMLElement>(".platform-trust-card");
		if (trustCards?.length) {
			revealOnScroll(trustSection, Array.from(trustCards), 0.07);
		}

		const ctaContent = ctaSection?.querySelector<HTMLElement>(".cta-content");
		const ctaActions = ctaSection?.querySelector<HTMLElement>(".cta-actions");

		if (ctaContent) {
			const st = ScrollTrigger.create({
				trigger: ctaSection,
				start: "top 80%",
				once: true,
				onEnter: () => {
					gsap.fromTo(
						ctaContent,
						{ opacity: 0, y: 20 },
						{
							opacity: 1,
							y: 0,
							duration: 0.5,
							ease: "power3.out",
							clearProps: "opacity,transform",
						},
					);
				},
			});
			allScrollTriggers.push(st);
		}

		if (ctaActions) {
			const st = ScrollTrigger.create({
				trigger: ctaSection,
				start: "top 75%",
				once: true,
				onEnter: () => {
					gsap.fromTo(
						ctaActions,
						{ opacity: 0, y: 20 },
						{
							opacity: 1,
							y: 0,
							duration: 0.5,
							delay: 0.15,
							ease: "power3.out",
							clearProps: "opacity,transform",
						},
					);
				},
			});
			allScrollTriggers.push(st);
		}

		return () => {
			killAllScrollTriggers();
		};
	});

	return () => {
		killAllScrollTriggers();
		mm.revert();
	};
}
