// carousel by next and previous buttons
const buttons = document.querySelectorAll("[data-carousel-button]");
console.log("buttons: ", buttons);

buttons.forEach((button) => {
	button.addEventListener("click", () => {
		const offset = button.dataset.carouselButton === "next" ? 1 : -1;
		const slides = button.closest("[data-carousel]").querySelector("[data-slides]");

		const activeSlide = slides.querySelector("[data-active]");
		let newIndex = [...slides.children].indexOf(activeSlide) + offset;
		console.log(newIndex);
		if (newIndex < 0) newIndex = slides.children.length - 1;
		if (newIndex >= slides.children.length) newIndex = 0;

		slides.children[newIndex].dataset.active = true;
		delete activeSlide.dataset.active;
	});
});

// carousel by indicator
document.querySelectorAll(".carouseel").forEach((carouseel) => {
	const items = carouseel.querySelectorAll(".carouseel__item");
	const buttonsHtml = Array.from(items, () => {
		return `<button class="carouseel__button"></button>`;
	});

	carouseel.insertAdjacentHTML(
		"beforeend",
		`<span class="carouseel__nav">
	    ${buttonsHtml.join(" ")}
	  </span>
    `
	);

	const buttons = carouseel.querySelectorAll(".carouseel__button");

	buttons.forEach((button, i) => {
		button.addEventListener("click", () => {
			//un-select all the items
			items.forEach((item) => item.classList.remove("carouseel__item--selected"));
			buttons.forEach((button) => button.classList.remove("carouseel__button--selected"));

			items[i].classList.add("carouseel__item--selected");
			button.classList.add("carouseel__button--selected");
		});
	});
});
