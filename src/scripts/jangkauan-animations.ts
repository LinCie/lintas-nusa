import { gsap, ScrollTrigger } from "./gsap";

function formatMetric(value: number, isDecimal: boolean, suffix: string) {
	const formatted = isDecimal
		? value.toFixed(1).replace(".", ",")
		: Math.round(value).toLocaleString("id-ID");

	return `${formatted}${suffix}`;
}

function initJangkauanExplorerInteractions(section: HTMLElement) {
	const explorer = section.matches("[data-coverage-explorer]")
		? section
		: section.querySelector<HTMLElement>("[data-coverage-explorer]");

	if (!explorer) {
		return () => {};
	}

	const tabList = explorer.querySelector<HTMLElement>("[data-coverage-tablist]");
	const tabButtons = gsap.utils.toArray<HTMLAnchorElement>("[data-coverage-region-tab]", explorer);
	const panels = gsap.utils.toArray<HTMLElement>("[data-coverage-region-panel]", explorer);

	if (!tabButtons.length || !panels.length) {
		return () => {};
	}

	const panelById = new Map<string, HTMLElement>();
	panels.forEach((panel) => {
		const id = panel.dataset.coverageRegionPanel;
		if (id) {
			panelById.set(id, panel);
		}
	});

	const searchInput = explorer.querySelector<HTMLInputElement>("[data-coverage-search]");
	const emptyState = explorer.querySelector<HTMLElement>("[data-coverage-empty]");
	const liveRegion = explorer.querySelector<HTMLElement>("[data-coverage-live]");
	const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
	const controller = new AbortController();
	const initialHashRegion = window.location.hash.startsWith("#coverage-panel-")
		? window.location.hash.replace("#coverage-panel-", "")
		: "";

	let activeRegionId =
		((initialHashRegion && panelById.has(initialHashRegion) ? initialHashRegion : "") ||
			tabButtons.find((button) => button.dataset.active === "true")?.dataset.regionId) ??
		tabButtons[0]?.dataset.regionId ??
		"";

	tabList?.setAttribute("role", "tablist");
	tabList?.setAttribute("aria-orientation", "vertical");

	tabButtons.forEach((button) => {
		button.setAttribute("role", "tab");
		const panelId = button.getAttribute("href")?.replace(/^#/, "");
		if (panelId) {
			button.setAttribute("aria-controls", panelId);
		}
	});

	function visibleButtons() {
		return tabButtons.filter((button) => !button.hidden);
	}

	function updateTabStates() {
		tabButtons.forEach((button) => {
			const regionId = button.dataset.regionId || "";
			const isActive = regionId === activeRegionId;

			button.dataset.active = isActive ? "true" : "false";
			button.setAttribute("aria-selected", isActive ? "true" : "false");
			button.tabIndex = isActive ? 0 : -1;
		});
	}

	function announceRegion(regionId: string, fallback = "") {
		if (!liveRegion) {
			return;
		}

		const panel = panelById.get(regionId);
		liveRegion.textContent = panel?.dataset.summary || fallback;
	}

	function hidePanel(panel: HTMLElement, animate: boolean) {
		const runHide = () => {
			panel.hidden = true;
			panel.setAttribute("aria-hidden", "true");
			gsap.set(panel, { clearProps: "all" });
		};

		gsap.killTweensOf(panel);

		if (!animate || reduceMotion) {
			runHide();
			return;
		}

		gsap.to(panel, {
			opacity: 0,
			y: 14,
			duration: 0.22,
			ease: "power2.out",
			onComplete: runHide,
		});
	}

	function showPanel(panel: HTMLElement, animate: boolean) {
		panel.hidden = false;
		panel.setAttribute("aria-hidden", "false");

		gsap.killTweensOf(panel);

		if (!animate || reduceMotion) {
			gsap.set(panel, { clearProps: "all" });
			return;
		}

		gsap.fromTo(
			panel,
			{ opacity: 0, y: 14 },
			{
				opacity: 1,
				y: 0,
				duration: 0.32,
				ease: "power2.out",
				clearProps: "opacity,transform",
			},
		);

		const laneItems = panel.querySelectorAll<HTMLElement>(".jangkauan-lane-item");

		if (laneItems.length) {
			gsap.fromTo(
				laneItems,
				{ opacity: 0, y: 12 },
				{
					opacity: 1,
					y: 0,
					duration: 0.28,
					ease: "power2.out",
					stagger: 0.05,
					clearProps: "opacity,transform",
				},
			);
		}
	}

	function activateRegion(
		regionId: string,
		options: { animate?: boolean; focus?: boolean; syncUrl?: boolean } = {},
	) {
		const nextPanel = panelById.get(regionId);
		const nextButton = tabButtons.find((button) => button.dataset.regionId === regionId);

		if (!nextPanel || !nextButton) {
			return;
		}

		activeRegionId = regionId;
		updateTabStates();

		const shouldAnimate = options.animate !== false;

		panels.forEach((panel) => {
			if (panel !== nextPanel && !panel.hidden) {
				hidePanel(panel, shouldAnimate);
			}
		});

		showPanel(nextPanel, shouldAnimate);
		announceRegion(regionId);
		emptyState?.setAttribute("hidden", "");

		if (options.syncUrl !== false) {
			const nextHash = `#coverage-panel-${regionId}`;
			if (window.location.hash !== nextHash) {
				window.history.replaceState(null, "", nextHash);
			}
		}

		if (options.focus) {
			nextButton.focus({ preventScroll: true });
		}
	}

	function filterRegions(query: string) {
		const needle = query.trim().toLowerCase();
		let firstVisibleId = "";

		tabButtons.forEach((button) => {
			const searchable = [
				button.dataset.regionId || "",
				button.dataset.keywords || "",
				button.textContent || "",
			]
				.join(" ")
				.toLowerCase();
			const visible = !needle || searchable.includes(needle);

			button.hidden = !visible;

			if (visible && !firstVisibleId) {
				firstVisibleId = button.dataset.regionId || "";
			}
		});

		if (!firstVisibleId) {
			panels.forEach((panel) => {
				panel.hidden = true;
				panel.setAttribute("aria-hidden", "true");
				gsap.set(panel, { clearProps: "all" });
			});

			if (emptyState) {
				emptyState.hidden = false;
			}

			announceRegion("", "Tidak ada wilayah yang cocok dengan pencarian.");
			updateTabStates();
			return;
		}

		emptyState?.setAttribute("hidden", "");

		const activeStillVisible = tabButtons.find(
			(button) => button.dataset.regionId === activeRegionId && !button.hidden,
		);
		const nextActiveId = activeStillVisible?.dataset.regionId || firstVisibleId;

		if (nextActiveId) {
			activateRegion(nextActiveId, { animate: false, syncUrl: false });
		}
	}

	function handleTabKeydown(event: KeyboardEvent) {
		if (!["ArrowRight", "ArrowLeft", "ArrowUp", "ArrowDown", "Home", "End"].includes(event.key)) {
			return;
		}

		const available = visibleButtons();

		if (!available.length) {
			return;
		}

		const currentIndex = available.indexOf(event.currentTarget as HTMLAnchorElement);

		if (currentIndex === -1) {
			return;
		}

		event.preventDefault();

		let nextIndex = currentIndex;

		if (event.key === "ArrowRight" || event.key === "ArrowDown") {
			nextIndex = (currentIndex + 1) % available.length;
		} else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
			nextIndex = (currentIndex - 1 + available.length) % available.length;
		} else if (event.key === "Home") {
			nextIndex = 0;
		} else if (event.key === "End") {
			nextIndex = available.length - 1;
		}

		const nextButton = available[nextIndex];
		const nextRegionId = nextButton?.dataset.regionId;

		if (nextRegionId) {
			activateRegion(nextRegionId, { animate: true, focus: true });
		}
	}

	tabButtons.forEach((button) => {
		button.addEventListener(
			"click",
			() => {
				const regionId = button.dataset.regionId;
				if (regionId) {
					activateRegion(regionId, { animate: true });
				}
			},
			{ signal: controller.signal },
		);

		button.addEventListener("keydown", handleTabKeydown, { signal: controller.signal });
	});

	searchInput?.addEventListener(
		"input",
		() => {
			filterRegions(searchInput?.value ?? "");
		},
		{ signal: controller.signal },
	);

	filterRegions(searchInput?.value ?? "");

	return () => {
		controller.abort();
	};
}

export function initJangkauanAnimations() {
	const section = document.getElementById("jangkauan");

	if (!section) {
		return () => {};
	}

	const explorerCleanup = initJangkauanExplorerInteractions(section);
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
						opacity: 0.18,
					},
					{
						xPercent: 190,
						opacity: 0.95,
						duration: 3.1,
						ease: "sine.inOut",
						repeat: -1,
						yoyo: true,
						paused: true,
					},
				),
				gsap.fromTo(
					scanLine,
					{
						xPercent: -140,
						opacity: 0.2,
					},
					{
						xPercent: 560,
						opacity: 0.72,
						duration: 3.1,
						ease: "sine.inOut",
						repeat: -1,
						yoyo: true,
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
		explorerCleanup();
		mm.revert();
	};
}
