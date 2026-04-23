export function initHeader() {
	const mobileMenu = document.getElementById("mobile-menu");
	const mobileMenuToggle = document.querySelector<HTMLButtonElement>(".mobile-menu-toggle");

	if (!mobileMenu || !mobileMenuToggle) {
		return () => {};
	}

	const closeMobileMenu = (options: { restoreFocus?: boolean } = {}) => {
		mobileMenu.classList.remove("open");
		mobileMenuToggle.setAttribute("aria-expanded", "false");
		mobileMenu.setAttribute("aria-hidden", "true");

		if (options.restoreFocus) {
			mobileMenuToggle.focus({ preventScroll: true });
		}
	};

	const toggleMobileMenu = () => {
		const isOpen = mobileMenu.classList.contains("open");
		mobileMenu.classList.toggle("open");
		mobileMenuToggle.setAttribute("aria-expanded", String(!isOpen));
		mobileMenu.setAttribute("aria-hidden", String(isOpen));
		if (!isOpen) {
			mobileMenu.querySelector<HTMLAnchorElement>("a")?.focus();
		}
	};

	const links = Array.from(mobileMenu.querySelectorAll<HTMLAnchorElement>("a"));
	const onKeyDown = (event: KeyboardEvent) => {
		if (event.key !== "Escape" || !mobileMenu.classList.contains("open")) {
			return;
		}

		event.preventDefault();
		closeMobileMenu({ restoreFocus: true });
	};

	mobileMenuToggle.addEventListener("click", toggleMobileMenu);
	links.forEach((link) => link.addEventListener("click", closeMobileMenu));
	window.addEventListener("resize", closeMobileMenu);
	document.addEventListener("keydown", onKeyDown);

	return () => {
		mobileMenuToggle.removeEventListener("click", toggleMobileMenu);
		links.forEach((link) => link.removeEventListener("click", closeMobileMenu));
		window.removeEventListener("resize", closeMobileMenu);
		document.removeEventListener("keydown", onKeyDown);
	};
}
