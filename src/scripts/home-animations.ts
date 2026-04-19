import { gsap } from "gsap";

export function initHomeAnimations() {
	const heroElements = gsap.utils.toArray<HTMLElement>(".hero-reveal");
	const scrollLine = document.querySelector<HTMLElement>(".scroll-line");

	if (!heroElements.length) {
		return () => {};
	}

	const mm = gsap.matchMedia();

	mm.add("(prefers-reduced-motion: no-preference)", () => {
		const timeline = gsap.timeline({
			defaults: {
				duration: 0.7,
				ease: "power3.out",
			},
		});

		timeline.from(heroElements, {
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
	});

	return () => {
		mm.revert();
	};
}
