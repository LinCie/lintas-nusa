import { gsap, ScrollTrigger } from "./gsap";

const allScrollTriggers: ScrollTrigger[] = [];

function killAllScrollTriggers() {
	allScrollTriggers.forEach((st) => st.kill());
	allScrollTriggers.length = 0;
}

function updateExpandToggle(toggle: HTMLButtonElement, isExpanded: boolean) {
	toggle.setAttribute("aria-expanded", String(isExpanded));

	const label = toggle.querySelector<HTMLElement>(".toggle-label");
	if (label) {
		label.textContent = isExpanded
			? (toggle.dataset.labelExpanded ?? "")
			: (toggle.dataset.labelDefault ?? "");
	}
}

function collapseExpandGroup(panel: HTMLElement) {
	const toggle = panel.querySelector<HTMLButtonElement>(".service-expand-toggle");
	if (!toggle) {
		return;
	}

	const expandId = toggle.getAttribute("aria-controls");
	if (!expandId) {
		return;
	}

	const expandGroup = panel.querySelector<HTMLElement>(`#${expandId}`);
	if (!expandGroup) {
		return;
	}

	gsap.killTweensOf(expandGroup);
	gsap.killTweensOf(toggle.querySelector(".toggle-chevron"));
	gsap.set(expandGroup, { clearProps: "all" });
	gsap.set(toggle.querySelector(".toggle-chevron"), { clearProps: "transform" });

	expandGroup.hidden = true;
	updateExpandToggle(toggle, false);
}

function revealServiceCategory(category: HTMLElement) {
	if (category.dataset.revealed === "true") {
		return;
	}

	category.dataset.revealed = "true";

	if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
		return;
	}

	const header = category.querySelector<HTMLElement>(".service-category-header");
	const cards = Array.from(category.querySelectorAll<HTMLElement>(".service-card"));

	const timeline = gsap.timeline({
		defaults: {
			ease: "power3.out",
		},
	});

	if (header) {
		timeline.from(header, {
			opacity: 0,
			y: 18,
			duration: 0.45,
			clearProps: "opacity,transform",
		});
	}

	if (cards.length) {
		timeline.from(
			cards,
			{
				opacity: 0,
				y: 24,
				duration: 0.55,
				stagger: 0.08,
				clearProps: "opacity,transform",
			},
			header ? "-=0.2" : 0,
		);
	}
}

function initServiceSection(section: HTMLElement) {
	const tabList = section.querySelector<HTMLElement>(".service-tab-list");
	const tabs = Array.from(section.querySelectorAll<HTMLButtonElement>("[data-service-tab]"));
	const panels = Array.from(section.querySelectorAll<HTMLElement>("[data-service-panel]"));

	if (tabs.length === 0 || panels.length === 0) {
		return () => {};
	}

	section.dataset.enhanced = "true";
	tabList?.setAttribute("role", "tablist");
	tabList?.setAttribute("aria-orientation", "horizontal");

	tabs.forEach((tab) => {
		tab.setAttribute("role", "tab");
		tab.setAttribute("aria-selected", "false");
		tab.setAttribute("tabindex", "-1");

		const panelId = tab.id.replace(/^tab-/, "");
		tab.setAttribute("aria-controls", panelId);
	});

	panels.forEach((panel) => {
		panel.setAttribute("role", "tabpanel");
	});

	section.querySelectorAll<HTMLButtonElement>(".service-expand-toggle").forEach((toggle) => {
		toggle.hidden = false;
	});

	const activateTab = (
		target: HTMLButtonElement,
		options: { focus?: boolean; reveal?: boolean } = {},
	) => {
		const { focus = true, reveal = true } = options;

		tabs.forEach((tab) => {
			const isActive = tab === target;
			tab.classList.toggle("active", isActive);
			tab.setAttribute("aria-selected", String(isActive));
			tab.setAttribute("tabindex", isActive ? "0" : "-1");
			if (isActive) {
				tab.setAttribute("aria-current", "true");
			} else {
				tab.removeAttribute("aria-current");
			}

			if (isActive && focus) {
				tab.focus();
			}
		});

		panels.forEach((panel) => {
			const isTarget = panel.getAttribute("aria-labelledby") === target.id;
			panel.hidden = !isTarget;
			panel.setAttribute("aria-hidden", String(!isTarget));

			if (!isTarget) {
				collapseExpandGroup(panel);
			}
		});

		if (reveal) {
			const panelId = target.getAttribute("aria-controls");
			if (!panelId) {
				return;
			}

			const targetPanel = section.querySelector<HTMLElement>(`#${panelId}`);
			if (targetPanel) {
				revealServiceCategory(targetPanel);
			}
		}
	};

	const listeners: Array<() => void> = [];

	tabs.forEach((tab) => {
		const clickHandler = (event: MouseEvent) => {
			event.preventDefault();
			activateTab(tab);
		};
		const keyHandler = (event: KeyboardEvent) => {
			const currentIndex = tabs.indexOf(tab);

			if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
				event.preventDefault();
				const nextIndex =
					event.key === "ArrowRight"
						? (currentIndex + 1) % tabs.length
						: (currentIndex - 1 + tabs.length) % tabs.length;
				activateTab(tabs[nextIndex]);
			}

			if (event.key === "Home") {
				event.preventDefault();
				activateTab(tabs[0]);
			}

			if (event.key === "End") {
				event.preventDefault();
				activateTab(tabs[tabs.length - 1]);
			}
		};

		tab.addEventListener("click", clickHandler);
		tab.addEventListener("keydown", keyHandler);

		listeners.push(() => {
			tab.removeEventListener("click", clickHandler);
			tab.removeEventListener("keydown", keyHandler);
		});
	});

	section.querySelectorAll<HTMLButtonElement>(".service-expand-toggle").forEach((toggle) => {
		const clickHandler = () => {
			const expandId = toggle.getAttribute("aria-controls");
			if (!expandId) {
				return;
			}

			const panel = toggle.closest<HTMLElement>("[data-service-panel]");
			const expandGroup = panel?.querySelector<HTMLElement>(`#${expandId}`);
			const chevron = toggle.querySelector<HTMLElement>(".toggle-chevron");

			if (!panel || !expandGroup) {
				return;
			}

			const isExpanded = toggle.getAttribute("aria-expanded") === "true";
			const shouldExpand = !isExpanded;
			const canAnimate = window.matchMedia("(prefers-reduced-motion: no-preference)").matches;

			updateExpandToggle(toggle, shouldExpand);

			if (!canAnimate) {
				expandGroup.hidden = !shouldExpand;
				return;
			}

			gsap.killTweensOf(expandGroup);
			gsap.killTweensOf(chevron);

			if (shouldExpand) {
				expandGroup.hidden = false;
				gsap.fromTo(
					expandGroup,
					{ height: 0, opacity: 0 },
					{
						height: "auto",
						opacity: 1,
						duration: 0.32,
						ease: "power2.out",
						clearProps: "height,opacity",
					},
				);
				if (chevron) {
					gsap.to(chevron, {
						rotate: 180,
						duration: 0.22,
						ease: "power2.out",
					});
				}
				return;
			}

			gsap.to(expandGroup, {
				height: 0,
				opacity: 0,
				duration: 0.24,
				ease: "power2.inOut",
				onComplete: () => {
					expandGroup.hidden = true;
					gsap.set(expandGroup, { clearProps: "height,opacity" });
				},
			});
			if (chevron) {
				gsap.to(chevron, {
					rotate: 0,
					duration: 0.2,
					ease: "power2.out",
				});
			}
		};

		toggle.addEventListener("click", clickHandler);
		listeners.push(() => toggle.removeEventListener("click", clickHandler));
	});

	panels.forEach((panel) => collapseExpandGroup(panel));

	const activeTab = tabs.find((tab) => tab.dataset.defaultActive === "true") ?? tabs[0];
	activateTab(activeTab, { focus: false, reveal: false });

	return () => {
		listeners.forEach((removeListener) => removeListener());
	};
}

export function initLayananAnimations() {
	const page = document.querySelector<HTMLElement>('.route-stage[data-page-view="layanan"]');

	if (!page) {
		return () => {};
	}

	const heroLabel = page.querySelector<HTMLElement>(".hero-tagline-label");
	const heroHeading = page.querySelector<HTMLElement>(".hero-tagline");
	const heroCopy = page.querySelector<HTMLElement>(".layanan-hero-copy");
	const heroStatsGroup = page.querySelector<HTMLElement>(".layanan-stats");
	const heroStats = gsap.utils.toArray<HTMLElement>(".layanan-stat", page);
	const heroScrollIndicator = page.querySelector<HTMLElement>(".hero-scroll-indicator");
	const heroSection = page.querySelector<HTMLElement>("#hero");
	const scrollLine = page.querySelector<HTMLElement>(".scroll-line");
	const serviceSections = Array.from(page.querySelectorAll<HTMLElement>("[data-service-section]"));
	const cleanupHandlers = serviceSections.map((section) => initServiceSection(section));

	const mm = gsap.matchMedia();

	mm.add("(prefers-reduced-motion: no-preference)", () => {
		const hoverCleanups: Array<() => void> = [];

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

		const ekosistemSection = page.querySelector<HTMLElement>("#ekosistem");
		if (ekosistemSection) {
			const prose = ekosistemSection.querySelector<HTMLElement>(".ekosistem-prose");
			const sidebar = ekosistemSection.querySelector<HTMLElement>(".ekosistem-sidebar");

			if (prose) {
				gsap.fromTo(
					prose,
					{
						opacity: 0,
						y: 36,
					},
					{
						opacity: 1,
						y: 0,
						ease: "none",
						scrollTrigger: {
							trigger: ekosistemSection,
							start: "top bottom-=6%",
							end: "top 58%",
							scrub: 0.8,
						},
					},
				);
			}

			if (sidebar) {
				gsap.fromTo(
					sidebar,
					{
						opacity: 0,
						y: 44,
					},
					{
						opacity: 1,
						y: 0,
						ease: "none",
						scrollTrigger: {
							trigger: ekosistemSection,
							start: "top bottom-=2%",
							end: "top 52%",
							scrub: 0.85,
						},
					},
				);
			}
		}

		const visibleCategories = gsap.utils.toArray<HTMLElement>(".service-category:not([hidden])");
		visibleCategories.forEach((category) => {
			const st = ScrollTrigger.create({
				trigger: category,
				start: "top 82%",
				once: true,
				onEnter: () => revealServiceCategory(category),
			});
			allScrollTriggers.push(st);
		});

		serviceSections.forEach((section) => {
			section.querySelectorAll<HTMLElement>(".service-card").forEach((card) => {
				const surface = card.querySelector<HTMLElement>(".service-card-surface");

				if (!surface) {
					return;
				}

				const enter = () => {
					gsap.to(surface, {
						y: -4,
						boxShadow: "0 10px 24px rgba(15,39,66,0.08)",
						duration: 0.22,
						ease: "power2.out",
					});
				};

				const leave = () => {
					gsap.to(surface, {
						y: 0,
						boxShadow: "0 0 0 rgba(15,39,66,0)",
						duration: 0.2,
						ease: "power2.out",
					});
				};

				card.addEventListener("pointerenter", enter);
				card.addEventListener("pointerleave", leave);

				hoverCleanups.push(() => {
					card.removeEventListener("pointerenter", enter);
					card.removeEventListener("pointerleave", leave);
				});
			});

			section.querySelectorAll<HTMLButtonElement>(".service-expand-toggle").forEach((toggle) => {
				const enter = () => {
					gsap.to(toggle, {
						x: 4,
						duration: 0.18,
						ease: "power2.out",
					});
				};
				const leave = () => {
					gsap.to(toggle, {
						x: 0,
						duration: 0.18,
						ease: "power2.out",
					});
				};

				toggle.addEventListener("pointerenter", enter);
				toggle.addEventListener("pointerleave", leave);

				hoverCleanups.push(() => {
					toggle.removeEventListener("pointerenter", enter);
					toggle.removeEventListener("pointerleave", leave);
				});
			});
		});

		const ctaSection = page.querySelector<HTMLElement>("#kontak");
		if (ctaSection) {
			const ctaContent = ctaSection.querySelector<HTMLElement>(".cta-content");
			const ctaActions = ctaSection.querySelector<HTMLElement>(".cta-actions");

			if (ctaContent) {
				gsap.from(ctaContent, {
					scrollTrigger: {
						trigger: ctaSection,
						start: "top 80%",
						once: true,
					},
					opacity: 0,
					y: 20,
					duration: 0.5,
					ease: "power3.out",
					clearProps: "opacity,transform",
				});
			}

			if (ctaActions) {
				gsap.from(ctaActions, {
					scrollTrigger: {
						trigger: ctaSection,
						start: "top 75%",
						once: true,
					},
					opacity: 0,
					y: 20,
					duration: 0.5,
					delay: 0.15,
					ease: "power3.out",
					clearProps: "opacity,transform",
				});
			}
		}

		return () => {
			hoverCleanups.forEach((cleanup) => cleanup());
		};
	});

	return () => {
		cleanupHandlers.forEach((cleanup) => cleanup());
		killAllScrollTriggers();
		mm.revert();
	};
}
