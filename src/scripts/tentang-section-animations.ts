import { gsap } from "./gsap";

function formatMetric(value: number, isDecimal: boolean, suffix: string) {
	const formatted = isDecimal
		? value.toFixed(1).replace(".", ",")
		: Math.round(value).toLocaleString("id-ID");
	return `${formatted}${suffix}`;
}

export function initTentangSectionAnimations() {
	const section = document.getElementById("tentang");

	if (!section) {
		return () => {};
	}

	const mm = gsap.matchMedia();

	mm.add("(prefers-reduced-motion: no-preference)", () => {
		const revealGroups = [
			".tentang-vision-block",
			".tentang-mission-item",
			".tentang-value-item",
			".tentang-leader-item",
			".tentang-metrics-block",
		];

		revealGroups.forEach((selector) => {
			const items = gsap.utils.toArray<HTMLElement>(selector);
			if (!items.length) {
				return;
			}

			gsap.from(items, {
				opacity: 0,
				y: 20,
				duration: 0.5,
				ease: "power2.out",
				stagger: 0.08,
				scrollTrigger: {
					trigger: items[0],
					start: "top 84%",
					once: true,
				},
				clearProps: "opacity,transform",
			});
		});

		const metrics = gsap.utils.toArray<HTMLElement>(".tentang-metric-value");
		metrics.forEach((el) => {
			const target = parseFloat(el.dataset.target || "0");
			const suffix = el.dataset.suffix || "";
			const isDecimal = el.dataset.decimal === "true";
			const counter = { value: 0 };

			gsap.fromTo(
				counter,
				{ value: 0 },
				{
					value: target,
					duration: 1.2,
					ease: "power2.out",
					scrollTrigger: {
						trigger: el,
						start: "top 88%",
						once: true,
					},
					onStart: () => {
						el.textContent = formatMetric(0, isDecimal, suffix);
					},
					onUpdate: () => {
						el.textContent = formatMetric(counter.value, isDecimal, suffix);
					},
					onComplete: () => {
						el.textContent = formatMetric(target, isDecimal, suffix);
					},
				},
			);
		});
	});

	return () => {
		mm.revert();
	};
}
