const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function initFooter() {
	const forms = Array.from(document.querySelectorAll<HTMLFormElement>(".newsletter-form"));

	if (!forms.length) {
		return () => {};
	}

	const cleanups = forms.map((form) => {
		const input = form.querySelector<HTMLInputElement>(".newsletter-input");
		const errorEl = form.querySelector<HTMLElement>(".newsletter-error");
		const successEl = form.querySelector<HTMLElement>(".newsletter-success");
		const btn = form.querySelector<HTMLButtonElement>(".newsletter-btn");

		if (!input || !errorEl || !successEl || !btn) {
			return () => {};
		}

		const onSubmit = (event: SubmitEvent) => {
			event.preventDefault();
			errorEl.classList.add("hidden");
			successEl.classList.add("hidden");

			const email = input.value.trim();

			if (!email) {
				errorEl.textContent = "Mohon masukkan alamat email Anda.";
				errorEl.classList.remove("hidden");
				return;
			}

			if (!EMAIL_REGEX.test(email)) {
				errorEl.textContent = "Format email tidak valid. Periksa kembali penulisan email Anda.";
				errorEl.classList.remove("hidden");
				return;
			}

			btn.textContent = "Mengirim...";
			btn.disabled = true;

			input.value = "";
			btn.textContent = "Berlangganan";
			btn.disabled = false;
			successEl.textContent = "Berhasil! Anda sudah terdaftar di newsletter LintasNusa.";
			successEl.classList.remove("hidden");
		};

		const onInput = () => {
			if (!errorEl.classList.contains("hidden")) {
				errorEl.classList.add("hidden");
			}
		};

		form.addEventListener("submit", onSubmit);
		input.addEventListener("input", onInput);

		return () => {
			form.removeEventListener("submit", onSubmit);
			input.removeEventListener("input", onInput);
		};
	});

	return () => {
		cleanups.forEach((cleanup) => cleanup());
	};
}
