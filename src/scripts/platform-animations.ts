import { gsap } from "./gsap";

export function initPlatformAnimations() {
	const section = document.getElementById("platform");

	if (!section) {
		return () => {};
	}

	const mm = gsap.matchMedia();

	mm.add("(prefers-reduced-motion: no-preference)", () => {
		const header = document.querySelector<HTMLElement>(".platform-header");
		const pillars = gsap.utils.toArray<HTMLElement>(".platform-pillar");
		const proofItems = gsap.utils.toArray<HTMLElement>(".platform-proof-item");
		const featureItems = gsap.utils.toArray<HTMLElement>(".platform-feature-item");

		if (header) {
			gsap.from(header.children, {
				opacity: 0,
				y: 20,
				duration: 0.55,
				ease: "power3.out",
				stagger: 0.1,
				clearProps: "opacity,transform",
			});
		}

		if (pillars.length) {
			gsap.from(pillars, {
				opacity: 0,
				y: 28,
				duration: 0.6,
				ease: "power3.out",
				stagger: 0.12,
				scrollTrigger: {
					trigger: pillars[0],
					start: "top 82%",
					once: true,
				},
				clearProps: "opacity,transform",
			});
		}

		if (proofItems.length) {
			const proofData = JSON.parse(section.dataset.proof || "[]") as {
				label: string;
				suffix: string;
				value: string;
			}[];

			gsap.from(proofItems, {
				opacity: 0,
				y: 14,
				duration: 0.4,
				ease: "power2.out",
				stagger: 0.07,
				scrollTrigger: {
					trigger: proofItems[0],
					start: "top 84%",
					once: true,
				},
				clearProps: "opacity,transform",
			});

			proofItems.forEach((item, index) => {
				const rawValue = parseFloat(proofData[index].value.replace(/\./g, "").replace(",", "."));
				const dd = item.querySelector("dd");

				if (!dd) {
					return;
				}

				const counter = { value: 0 };
				gsap.to(counter, {
					value: rawValue,
					duration: 1.4,
					ease: "power2.out",
					delay: 0.1 + index * 0.07,
					onUpdate() {
						const value = counter.value;
						const formatted = Number.isInteger(rawValue)
							? Math.round(value).toLocaleString("id-ID")
							: value.toFixed(1).replace(".", ",");
						dd.childNodes[0].textContent = formatted;
					},
					scrollTrigger: {
						trigger: item,
						start: "top 84%",
						once: true,
					},
				});
			});
		}

		if (featureItems.length) {
			gsap.from(featureItems, {
				opacity: 0,
				y: 12,
				duration: 0.32,
				ease: "power2.out",
				stagger: 0.04,
				scrollTrigger: {
					trigger: featureItems[0],
					start: "top 86%",
					once: true,
				},
				clearProps: "opacity,transform",
			});
		}
	});

	return () => {
		mm.revert();
	};
}
