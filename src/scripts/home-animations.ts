import { gsap, ScrollTrigger } from "./gsap";

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

	if (!window.matchMedia("(prefers-reduced-motion: no-preference)").matches) {
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
	const tabs = Array.from(section.querySelectorAll<HTMLAnchorElement>("[data-service-tab]"));
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

		const panelId = tab.getAttribute("href")?.slice(1);
		if (panelId) {
			tab.setAttribute("aria-controls", panelId);
		}
	});

	panels.forEach((panel) => {
		panel.setAttribute("role", "tabpanel");
	});

	section.querySelectorAll<HTMLButtonElement>(".service-expand-toggle").forEach((toggle) => {
		toggle.hidden = false;
	});

	const activateTab = (
		target: HTMLAnchorElement,
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

export function initHomeAnimations() {
	const heroElements = gsap.utils.toArray<HTMLElement>(".hero-reveal");
	const scrollLine = document.querySelector<HTMLElement>(".scroll-line");
	const serviceSections = Array.from(
		document.querySelectorAll<HTMLElement>("[data-service-section]"),
	);
	const cleanupHandlers = serviceSections.map((section) => initServiceSection(section));

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

		const visibleCategories = gsap.utils.toArray<HTMLElement>(".service-category:not([hidden])");
		visibleCategories.forEach((category) => {
			ScrollTrigger.create({
				trigger: category,
				start: "top 82%",
				once: true,
				onEnter: () => revealServiceCategory(category),
			});
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
				clearProps: "opacity,transform",
			});
		}

		const ctaButton = document.querySelector<HTMLElement>(".service-cta-btn");
		const ctaIcon = ctaButton?.querySelector<HTMLElement>(".service-cta-icon");
		if (ctaButton && ctaIcon) {
			const enter = () => {
				gsap.to(ctaButton, {
					y: -2,
					boxShadow: "0 8px 18px rgba(15,39,66,0.18)",
					duration: 0.22,
					ease: "power2.out",
				});
				gsap.to(ctaIcon, {
					x: 3,
					duration: 0.2,
					ease: "power2.out",
				});
			};
			const leave = () => {
				gsap.to(ctaButton, {
					y: 0,
					boxShadow: "0 0 0 rgba(15,39,66,0)",
					duration: 0.2,
					ease: "power2.out",
				});
				gsap.to(ctaIcon, {
					x: 0,
					duration: 0.18,
					ease: "power2.out",
				});
			};

			ctaButton.addEventListener("pointerenter", enter);
			ctaButton.addEventListener("pointerleave", leave);

			hoverCleanups.push(() => {
				ctaButton.removeEventListener("pointerenter", enter);
				ctaButton.removeEventListener("pointerleave", leave);
			});
		}

		return () => {
			hoverCleanups.forEach((cleanup) => cleanup());
		};
	});

	return () => {
		cleanupHandlers.forEach((cleanup) => cleanup());
		mm.revert();
	};
}
