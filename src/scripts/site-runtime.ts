import { initCtaContactAnimations } from "./cta-contact-animations";
import { initFooter } from "./footer";
import { initHeader } from "./header";
import { initHomeAnimations } from "./home-animations";
import { initJangkauanAnimations } from "./jangkauan-animations";
import { initLayananAnimations } from "./layanan-animations";
import { initPlatformAnimations } from "./platform-animations";
import { setupSwupRuntime } from "./swup-runtime";
import { initTentangPageAnimations } from "./tentang-page";
import { initTentangSectionAnimations } from "./tentang-section-animations";

let cleanup = () => {};

function disposeCurrentPage() {
	const dispose = cleanup;
	cleanup = () => {};
	dispose();
}

function runInitializers() {
	disposeCurrentPage();

	const cleanups: Array<() => void> = [initHeader(), initFooter()];
	const page = document.querySelector<HTMLElement>("[data-page-view]")?.dataset.pageView;

	if (page === "home") {
		cleanups.push(
			initHomeAnimations(),
			initJangkauanAnimations(),
			initPlatformAnimations(),
			initTentangSectionAnimations(),
			initCtaContactAnimations(),
		);
	}

	if (page === "jangkauan") {
		cleanups.push(initJangkauanAnimations());
	}

	if (page === "tentang") {
		cleanups.push(initTentangPageAnimations());
	}

	if (page === "layanan") {
		cleanups.push(initLayananAnimations());
	}

	cleanup = () => {
		[...cleanups].reverse().forEach((dispose) => dispose());
	};
}

function bootstrap() {
	setupSwupRuntime();

	document.addEventListener("astro:before-swap", disposeCurrentPage);
	document.addEventListener("astro:page-load", runInitializers);

	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", runInitializers, { once: true });
		return;
	}

	runInitializers();
}

bootstrap();
