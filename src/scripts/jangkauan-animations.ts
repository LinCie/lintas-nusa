import { gsap, ScrollTrigger } from "./gsap";

function formatMetric(value: number, isDecimal: boolean, suffix: string) {
	const formatted = isDecimal
		? value.toFixed(1).replace(".", ",")
		: Math.round(value).toLocaleString("id-ID");

	return `${formatted}${suffix}`;
}

export function initJangkauanAnimations() {
	const section = document.getElementById("jangkauan");

	if (!section) {
		return () => {};
	}

	const mm = gsap.matchMedia();

	mm.add("(prefers-reduced-motion: no-preference)", () => {
		const numbers = gsap.utils.toArray<HTMLElement>(".jangkauan-number");

		numbers.forEach((el) => {
			const target = parseFloat(el.dataset.target || "0");
			const suffix = el.dataset.suffix || "";
			const isDecimal = el.dataset.decimal === "true";
			const counter = { value: 0 };

			gsap.fromTo(
				counter,
				{ value: 0 },
				{
					value: target,
					duration: 1.4,
					ease: "power2.out",
					scrollTrigger: {
						trigger: el,
						start: "top 85%",
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

		const revealGroups = [
			".jangkauan-map-shell",
			".jangkauan-network-row",
			".jangkauan-role-item",
			".jangkauan-lane-item",
			".jangkauan-proof-item",
		];

		revealGroups.forEach((selector) => {
			const items = gsap.utils.toArray<HTMLElement>(selector);

			if (!items.length) {
				return;
			}

			gsap.from(items, {
				opacity: 0,
				y: 18,
				duration: 0.45,
				ease: "power2.out",
				stagger: 0.08,
				scrollTrigger: {
					trigger: items[0],
					start: "top 82%",
					once: true,
				},
				clearProps: "opacity,transform",
			});
		});

		const networkElements = gsap.utils.toArray<SVGElement>(
			".jangkauan-network-line, .jangkauan-network-node, .jangkauan-network-label, .jangkauan-control-glow, .jangkauan-control-core",
		);

		if (networkElements.length) {
			gsap.from(networkElements, {
				opacity: 0,
				duration: 0.35,
				ease: "power2.out",
				stagger: 0.03,
				scrollTrigger: {
					trigger: networkElements[0],
					start: "top 84%",
					once: true,
				},
			});
		}

		const commandShell = document.querySelector<HTMLElement>(".jangkauan-command-shell");
		const scanBeam = commandShell?.querySelector<HTMLElement>(".jangkauan-scan-beam");
		const scanLine = commandShell?.querySelector<HTMLElement>(".jangkauan-scan-line");
		const commandCards = gsap.utils.toArray<HTMLElement>(".jangkauan-command-card");
		const commandPills = gsap.utils.toArray<HTMLElement>(".jangkauan-command-pill");
		const commandHeader = commandShell?.querySelector<HTMLElement>(".jangkauan-command-header");
		const commandCaption = commandShell?.querySelector<HTMLElement>(".jangkauan-command-caption");
		const routePaths = gsap.utils.toArray<SVGPathElement>(
			".jangkauan-route-primary, .jangkauan-route-support, .jangkauan-route-glow",
		);
		const routeSignals = gsap.utils.toArray<SVGPathElement>(".jangkauan-route-signal");
		const controlRings = gsap.utils.toArray<SVGCircleElement>(".jangkauan-control-ring");
		const nodePulses = gsap.utils.toArray<SVGCircleElement>(".jangkauan-node-pulse");

		if (commandShell && routePaths.length) {
			routePaths.forEach((path) => {
				const length = path.getTotalLength();
				gsap.set(path, {
					strokeDasharray: length,
					strokeDashoffset: length,
				});
			});

			gsap.set(routeSignals, {
				strokeDashoffset: 0,
				opacity: 0,
			});
			gsap.set(controlRings, {
				transformOrigin: "center center",
				scale: 0.7,
				opacity: 0,
			});
			gsap.set(nodePulses, {
				transformOrigin: "center center",
				scale: 0.6,
				opacity: 0,
			});
			gsap.set(".jangkauan-control-core", {
				transformOrigin: "center center",
				scale: 0.72,
			});

			const commandIntro = gsap.timeline({ paused: true });

			if (commandHeader) {
				commandIntro.from(
					commandHeader.children,
					{
						opacity: 0,
						y: 22,
						duration: 0.55,
						ease: "power3.out",
						stagger: 0.08,
						clearProps: "opacity,transform",
					},
					0,
				);
			}

			if (commandPills.length) {
				commandIntro.from(
					commandPills,
					{
						opacity: 0,
						y: 14,
						duration: 0.4,
						ease: "power2.out",
						stagger: 0.05,
						clearProps: "opacity,transform",
					},
					0.08,
				);
			}

			commandIntro.to(
				routePaths,
				{
					strokeDashoffset: 0,
					duration: 1.05,
					ease: "power2.out",
					stagger: 0.06,
					clearProps: "strokeDasharray,strokeDashoffset",
				},
				0.15,
			);
			commandIntro.from(
				".jangkauan-network-node",
				{
					scale: 0,
					opacity: 0,
					duration: 0.34,
					ease: "back.out(1.35)",
					stagger: 0.04,
					transformOrigin: "center center",
					clearProps: "opacity,transform",
				},
				0.58,
			);
			commandIntro.from(
				".jangkauan-network-label",
				{
					opacity: 0,
					y: 6,
					duration: 0.34,
					ease: "power2.out",
					stagger: 0.03,
					clearProps: "opacity,transform",
				},
				0.68,
			);
			commandIntro.to(
				controlRings,
				{
					scale: 1,
					opacity: (_, target) => (target.classList.contains("stroke-teal/24") ? 0.42 : 0.25),
					duration: 0.6,
					ease: "power2.out",
					stagger: 0.08,
				},
				0.48,
			);
			commandIntro.to(
				".jangkauan-control-core",
				{
					scale: 1,
					duration: 0.5,
					ease: "power2.out",
					clearProps: "transform",
				},
				0.58,
			);

			if (commandCaption) {
				commandIntro.from(
					commandCaption.children,
					{
						opacity: 0,
						y: 18,
						duration: 0.45,
						ease: "power2.out",
						stagger: 0.08,
						clearProps: "opacity,transform",
					},
					0.7,
				);
			}

			if (commandCards.length) {
				commandIntro.from(
					commandCards,
					{
						opacity: 0,
						y: 18,
						duration: 0.42,
						ease: "power2.out",
						stagger: 0.07,
						clearProps: "opacity,transform",
					},
					0.86,
				);
			}

			const ambientTweens: gsap.core.Tween[] = [
				gsap.to(routeSignals, {
					strokeDashoffset: -44,
					opacity: 0.92,
					duration: 1.45,
					ease: "none",
					repeat: -1,
					paused: true,
					stagger: {
						each: 0.1,
						from: "start",
					},
				}),
				gsap.to(controlRings, {
					scale: (index) => (index === 0 ? 1.35 : 1.58),
					opacity: 0,
					duration: 2.3,
					ease: "power1.out",
					repeat: -1,
					paused: true,
					stagger: 0.4,
				}),
				gsap.to(nodePulses, {
					scale: 2.4,
					opacity: 0,
					duration: 1.7,
					ease: "power1.out",
					repeat: -1,
					paused: true,
					stagger: {
						each: 0.14,
						from: "random",
					},
				}),
				gsap.fromTo(
					scanBeam,
					{
						xPercent: -135,
						opacity: 0,
					},
					{
						xPercent: 190,
						opacity: 0.95,
						duration: 2.5,
						ease: "none",
						repeat: -1,
						paused: true,
					},
				),
				gsap.fromTo(
					scanLine,
					{
						xPercent: -140,
						opacity: 0,
					},
					{
						xPercent: 560,
						opacity: 0.72,
						duration: 2.5,
						ease: "none",
						repeat: -1,
						paused: true,
					},
				),
				gsap.to(".jangkauan-command-aura", {
					opacity: 0.75,
					scale: 1.08,
					duration: 2.8,
					ease: "sine.inOut",
					repeat: -1,
					yoyo: true,
					paused: true,
					stagger: 0.3,
					transformOrigin: "center center",
				}),
			];

			ScrollTrigger.create({
				trigger: commandShell,
				start: "top 76%",
				end: "bottom top",
				onEnter: () => {
					commandIntro.restart();
					ambientTweens.forEach((tween) => tween.play(0));
				},
				onLeave: () => {
					ambientTweens.forEach((tween) => tween.pause());
				},
				onEnterBack: () => {
					ambientTweens.forEach((tween) => tween.play());
				},
				onLeaveBack: () => {
					ambientTweens.forEach((tween) => tween.pause(0));
				},
			});
		}
	});

	return () => {
		mm.revert();
	};
}
