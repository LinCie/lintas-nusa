export function initHeader() {
	const mobileMenu = document.getElementById("mobile-menu");
	const mobileMenuToggle = document.querySelector<HTMLButtonElement>(".mobile-menu-toggle");

	if (!mobileMenu || !mobileMenuToggle) {
		return () => {};
	}

	const closeMobileMenu = () => {
		mobileMenu.classList.remove("open");
		mobileMenuToggle.setAttribute("aria-expanded", "false");
		mobileMenu.setAttribute("aria-hidden", "true");
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

	mobileMenuToggle.addEventListener("click", toggleMobileMenu);
	links.forEach((link) => link.addEventListener("click", closeMobileMenu));
	window.addEventListener("resize", closeMobileMenu);

	return () => {
		mobileMenuToggle.removeEventListener("click", toggleMobileMenu);
		links.forEach((link) => link.removeEventListener("click", closeMobileMenu));
		window.removeEventListener("resize", closeMobileMenu);
	};
}
