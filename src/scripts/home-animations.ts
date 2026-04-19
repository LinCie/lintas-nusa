import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function initHomeAnimations() {
	const heroElements = gsap.utils.toArray<HTMLElement>(".hero-reveal");
	const scrollLine = document.querySelector<HTMLElement>(".scroll-line");

	const mm = gsap.matchMedia();

	mm.add("(prefers-reduced-motion: no-preference)", () => {
		if (heroElements.length) {
			const heroTimeline = gsap.timeline({
				defaults: {
					duration: 0.7,
					ease: "power3.out",
				},
			});

			heroTimeline.from(heroElements, {
				y: 24,
				opacity: 0,
				stagger: 0.1,
				clearProps: "opacity,transform",
			});

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
						delay: 0.45,
					},
				);
			}
		}

		// Service cards — reveal each layanan group with one trigger for reliable staggered entry.
		const categories = gsap.utils.toArray<HTMLElement>(".service-category");

		categories.forEach((category) => {
			const cards = Array.from(category.querySelectorAll<HTMLElement>(".service-card"));
			const header = category.querySelector<HTMLElement>(".service-category-header");

			if (!header && cards.length === 0) {
				return;
			}

			const categoryTimeline = gsap.timeline({
				scrollTrigger: {
					trigger: category,
					start: "top 82%",
					once: true,
				},
			});

			if (header) {
				categoryTimeline.from(header, {
					opacity: 0,
					y: 16,
					duration: 0.4,
					ease: "power2.out",
					clearProps: "opacity,transform",
				});
			}

			if (cards.length) {
				categoryTimeline.from(
					cards,
					{
						opacity: 0,
						y: 24,
						duration: 0.55,
						ease: "power3.out",
						stagger: 0.08,
						clearProps: "opacity,transform",
					},
					header ? "-=0.15" : 0,
				);
			}
		});

		// CTA block
		const ctaBlock = document.querySelector<HTMLElement>(".service-cta-block");
		if (ctaBlock) {
			gsap.from(ctaBlock, {
				scrollTrigger: {
					trigger: ctaBlock,
					start: "top 85%",
					once: true,
				},
				opacity: 0,
				y: 16,
				duration: 0.5,
				ease: "power3.out",
			});
		}
	});

	return () => {
		mm.revert();
	};
}
