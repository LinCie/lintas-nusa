import type Swup from "swup";
import { gsap } from "./gsap";

declare global {
	interface Window {
		swup?: Swup;
	}
}

let isSetup = false;

const ROUTE_ORDER = new Map([
	["/", 0],
	["/tentang", 1],
]);

function tweenToPromise(tween: gsap.core.Tween | gsap.core.Timeline) {
	return new Promise<void>((resolve) => {
		tween.eventCallback("onComplete", () => resolve());
	});
}

function normalizePath(value: string) {
	const pathname = value.replace(/\/+$/, "");
	return pathname === "" ? "/" : pathname;
}

function getDirection(nextUrl?: string) {
	if (!nextUrl) {
		return 1;
	}

	const current = ROUTE_ORDER.get(normalizePath(window.location.pathname)) ?? 0;
	const target =
		ROUTE_ORDER.get(normalizePath(new URL(nextUrl, window.location.origin).pathname)) ?? 1;
	return target >= current ? 1 : -1;
}

function getTransitionElements() {
	return {
		shell: document.getElementById("route-transition"),
		grid: document.querySelector<HTMLElement>(".route-transition__grid"),
		label: document.querySelector<HTMLElement>(".route-transition__label"),
		path: document.querySelector<HTMLElement>(".route-transition__path"),
		beam: document.querySelector<HTMLElement>(".route-transition__beam"),
		line: document.querySelector<HTMLElement>(".route-transition__line"),
		pulse: document.querySelector<HTMLElement>(".route-transition__pulse"),
	};
}

function getMainContainer() {
	return document.querySelector<HTMLElement>('main[data-swup-container="true"], main');
}

function getAnimatedContainer() {
	return document.querySelector<HTMLElement>(".route-stage") ?? getMainContainer();
}

async function animateOut(url?: string) {
	const main = getAnimatedContainer();
	const { shell, grid, label, path, beam, line, pulse } = getTransitionElements();

	if (!main || !shell || !grid || !label || !path || !beam || !line || !pulse) {
		return;
	}

	const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
	const direction = getDirection(url);
	const destination = new URL(url ?? window.location.href, window.location.origin);

	path.textContent = normalizePath(destination.pathname) === "/" ? "Beranda" : destination.pathname;
	shell.classList.add("is-active");

	if (prefersReducedMotion) {
		await tweenToPromise(
			gsap.to(main, {
				opacity: 0,
				duration: 0.12,
				ease: "power2.out",
			}),
		);
		return;
	}

	gsap.killTweensOf([main, shell, grid, label, beam, line, pulse]);
	gsap.set(shell, { autoAlpha: 1 });
	gsap.set([grid, label, beam, line, pulse], { clearProps: "all" });
	gsap.set(grid, {
		opacity: 0,
		scaleX: 0.84,
		transformOrigin: direction > 0 ? "left center" : "right center",
	});
	gsap.set(label, { opacity: 0, x: direction * -28 });
	gsap.set(beam, { xPercent: direction > 0 ? -130 : 130, opacity: 0.12 });
	gsap.set(line, {
		scaleX: 0.14,
		xPercent: direction > 0 ? -24 : 24,
		transformOrigin: direction > 0 ? "left center" : "right center",
	});
	gsap.set(pulse, { xPercent: direction > 0 ? -32 : 32, opacity: 0 });

	const timeline = gsap.timeline();
	timeline
		.to(
			main,
			{
				xPercent: direction * -3,
				scale: 0.988,
				opacity: 0.18,
				duration: 0.52,
				ease: "expo.inOut",
			},
			0,
		)
		.to(
			grid,
			{
				opacity: 0.52,
				scaleX: 1,
				duration: 0.44,
				ease: "expo.out",
			},
			0,
		)
		.to(
			label,
			{
				opacity: 1,
				x: 0,
				duration: 0.36,
				ease: "power3.out",
			},
			0.08,
		)
		.to(
			line,
			{
				scaleX: 1,
				xPercent: 0,
				duration: 0.5,
				ease: "expo.inOut",
			},
			0.06,
		)
		.to(
			beam,
			{
				xPercent: direction > 0 ? 118 : -118,
				opacity: 0.88,
				duration: 0.6,
				ease: "expo.inOut",
			},
			0,
		)
		.to(
			pulse,
			{
				xPercent: 0,
				opacity: 1,
				duration: 0.38,
				ease: "power2.out",
			},
			0.14,
		);

	await tweenToPromise(timeline);
}

async function animateIn() {
	const main = getAnimatedContainer();
	const { shell, grid, label, beam, line, pulse } = getTransitionElements();

	if (!main || !shell || !grid || !label || !beam || !line || !pulse) {
		return;
	}

	const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
	const direction = shell.dataset.direction === "backward" ? -1 : 1;

	if (prefersReducedMotion) {
		gsap.set(main, { opacity: 0 });
		await tweenToPromise(
			gsap.to(main, {
				opacity: 1,
				duration: 0.14,
				ease: "power2.out",
				clearProps: "opacity",
			}),
		);
		shell.classList.remove("is-active");
		gsap.set(shell, { clearProps: "all" });
		return;
	}

	gsap.killTweensOf([main, shell, grid, label, beam, line, pulse]);
	gsap.set(main, { xPercent: direction * 3.4, scale: 0.992, opacity: 0.28 });

	const timeline = gsap.timeline({
		onComplete: () => {
			shell.classList.remove("is-active");
			gsap.set([main, shell, grid, label, beam, line, pulse], { clearProps: "all" });
		},
	});

	timeline
		.to(
			main,
			{
				xPercent: 0,
				scale: 1,
				opacity: 1,
				duration: 0.56,
				ease: "expo.out",
				clearProps: "opacity,transform",
			},
			0,
		)
		.to(
			label,
			{
				opacity: 0,
				y: -12,
				duration: 0.24,
				ease: "power2.in",
			},
			0,
		)
		.to(
			grid,
			{
				opacity: 0,
				scaleX: 1.08,
				duration: 0.3,
				ease: "power2.out",
			},
			0.12,
		)
		.to(
			line,
			{
				scaleX: 1.08,
				opacity: 0,
				duration: 0.28,
				ease: "power2.out",
			},
			0.1,
		)
		.to(
			pulse,
			{
				scale: 1.22,
				opacity: 0,
				duration: 0.26,
				ease: "power2.out",
			},
			0.08,
		)
		.to(
			beam,
			{
				xPercent: direction > 0 ? 168 : -168,
				opacity: 0,
				duration: 0.42,
				ease: "expo.out",
			},
			0,
		)
		.to(
			shell,
			{
				autoAlpha: 0,
				duration: 0.2,
				ease: "power1.out",
			},
			0.24,
		);

	await tweenToPromise(timeline);
}

function attach(swup: Swup) {
	if (isSetup) {
		return;
	}

	isSetup = true;

	swup.hooks.on("visit:start", (visit) => {
		const direction = getDirection(visit.to.url);
		const shell = document.getElementById("route-transition");
		shell?.setAttribute("data-direction", direction > 0 ? "forward" : "backward");
	});

	swup.hooks.replace("animation:out:await", async (visit) => {
		await animateOut(visit.to.url);
	});

	swup.hooks.replace("animation:in:await", async () => {
		await animateIn();
	});

	swup.hooks.on("visit:end", () => {
		const shell = document.getElementById("route-transition");
		if (!shell?.classList.contains("is-active")) {
			return;
		}

		shell.classList.remove("is-active");
		gsap.set(
			"#route-transition, .route-transition__grid, .route-transition__label, .route-transition__beam, .route-transition__line, .route-transition__pulse, main",
			{
				clearProps: "all",
			},
		);
	});
}

export function setupSwupRuntime() {
	if (window.swup) {
		attach(window.swup);
		return;
	}

	document.addEventListener(
		"swup:enable",
		() => {
			if (window.swup) {
				attach(window.swup);
			}
		},
		{ once: true },
	);
}
