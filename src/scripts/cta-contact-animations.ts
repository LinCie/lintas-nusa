import { gsap } from "./gsap";

export function initCtaContactAnimations() {
	const section = document.getElementById("kontak");

	if (!section) {
		return () => {};
	}

	const mm = gsap.matchMedia();

	mm.add("(prefers-reduced-motion: no-preference)", () => {
		const contentItems = gsap.utils.toArray<HTMLElement>(
			".cta-content, .cta-contact, .cta-contact-item",
		);

		if (!contentItems.length) {
			return;
		}

		gsap.from(contentItems, {
			opacity: 0,
			y: 24,
			duration: 0.6,
			ease: "power2.out",
			stagger: 0.1,
			scrollTrigger: {
				trigger: ".cta-content",
				start: "top 82%",
				once: true,
			},
			clearProps: "opacity,transform",
		});
	});

	return () => {
		mm.revert();
	};
}
