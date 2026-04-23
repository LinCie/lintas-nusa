import { gsap, ScrollTrigger } from "./gsap";

export function initHomeAnimations() {
	const page = document.querySelector<HTMLElement>('.route-stage[data-page-view="home"]');
	if (!page) {
		return () => {};
	}

	const heroElements = gsap.utils.toArray<HTMLElement>("[data-home-hero]", page);
	const revealSections = gsap.utils.toArray<HTMLElement>("[data-home-reveal]", page);
	const hoverItems = gsap.utils.toArray<HTMLElement>("[data-home-hover]", page);
	const commandShell = page.querySelector<HTMLElement>("[data-home-map-shell]");
	const commandCards = commandShell
		? gsap.utils.toArray<HTMLElement>(".jangkauan-command-card", commandShell)
		: [];
	const commandHeader = commandShell?.querySelector<HTMLElement>(".jangkauan-command-header");
	const commandCaption = commandShell?.querySelector<HTMLElement>(".jangkauan-command-caption");
	const routePaths = commandShell
		? gsap.utils.toArray<SVGPathElement>(
				".jangkauan-route-primary, .jangkauan-route-support",
				commandShell,
			)
		: [];
	const controlRings = commandShell
		? gsap.utils.toArray<SVGCircleElement>(".jangkauan-control-ring", commandShell)
		: [];
	const nodePulses = commandShell
		? gsap.utils.toArray<SVGCircleElement>(".jangkauan-node-pulse", commandShell)
		: [];
	const networkNodes = commandShell
		? gsap.utils.toArray<SVGCircleElement>(".jangkauan-network-node", commandShell)
		: [];
	const networkLabels = commandShell
		? gsap.utils.toArray<SVGTextElement>(".jangkauan-network-label", commandShell)
		: [];
	const controlCore = commandShell?.querySelector<SVGCircleElement>(".jangkauan-control-core");

	const mm = gsap.matchMedia();

	mm.add("(prefers-reduced-motion: no-preference)", () => {
		const hoverCleanups: Array<() => void> = [];

		if (heroElements.length) {
			const heroTimeline = gsap.timeline({
				defaults: {
					duration: 0.7,
					ease: "power3.out",
				},
			});

			heroTimeline.from(heroElements, {
				y: 26,
				opacity: 0,
				stagger: 0.09,
				clearProps: "opacity,transform",
			});
		}

		revealSections.forEach((section) => {
			const revealItems = gsap.utils.toArray<HTMLElement>("[data-home-reveal-item]", section);
			if (!revealItems.length) {
				return;
			}

			gsap.from(revealItems, {
				scrollTrigger: {
					trigger: section,
					start: "top 82%",
					once: true,
				},
				y: 22,
				opacity: 0,
				duration: 0.62,
				stagger: 0.08,
				ease: "power3.out",
				clearProps: "opacity,transform",
			});
		});

		if (commandShell && routePaths.length) {
			routePaths.forEach((path) => {
				const length = path.getTotalLength();
				gsap.set(path, {
					strokeDasharray: length,
					strokeDashoffset: length,
				});
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
			gsap.set(networkNodes, {
				transformOrigin: "center center",
				scale: 0,
				opacity: 0,
			});
			gsap.set(networkLabels, {
				opacity: 0,
				y: 6,
			});
			if (controlCore) {
				gsap.set(controlCore, {
					transformOrigin: "center center",
					scale: 0.72,
				});
			}

			const commandIntro = gsap.timeline({ paused: true });

			if (commandHeader) {
				commandIntro.from(
					Array.from(commandHeader.children),
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

			commandIntro.to(
				networkNodes,
				{
					scale: 1,
					opacity: 1,
					duration: 0.34,
					ease: "power2.out",
					stagger: 0.04,
					clearProps: "opacity,transform",
				},
				0.58,
			);

			commandIntro.to(
				nodePulses,
				{
					scale: 1,
					opacity: 0.55,
					duration: 0.32,
					ease: "power2.out",
					stagger: 0.03,
					clearProps: "opacity,transform",
				},
				0.62,
			);

			commandIntro.to(
				networkLabels,
				{
					opacity: 1,
					y: 0,
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

			if (controlCore) {
				commandIntro.to(
					controlCore,
					{
						scale: 1,
						duration: 0.5,
						ease: "power2.out",
						clearProps: "transform",
					},
					0.58,
				);
			}

			if (commandCaption) {
				commandIntro.from(
					Array.from(commandCaption.children),
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

			ScrollTrigger.create({
				trigger: commandShell,
				start: "top 82%",
				once: true,
				onEnter: () => {
					commandIntro.restart();
				},
			});
		}

		hoverItems.forEach((item) => {
			const enter = () => {
				gsap.to(item, {
					y: -3,
					duration: 0.2,
					ease: "power2.out",
				});
			};
			const leave = () => {
				gsap.to(item, {
					y: 0,
					duration: 0.2,
					ease: "power2.out",
				});
			};

			item.addEventListener("pointerenter", enter);
			item.addEventListener("pointerleave", leave);

			hoverCleanups.push(() => {
				item.removeEventListener("pointerenter", enter);
				item.removeEventListener("pointerleave", leave);
			});
		});

		return () => {
			hoverCleanups.forEach((cleanup) => cleanup());
		};
	});

	return () => {
		mm.revert();
	};
}
