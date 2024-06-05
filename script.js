"use script";

const header1 = document.querySelector(".header1");

function displayText() {
  let text = document.getElementById("textField");
  text.style.display = "none";
}

const message = document.createElement("div");
message.classList.add("cookie-message");
//message.textContent ="We use cookies for  improved functionality and analytics";
message.innerHTML =
  'We use cookies for improved functionality and analytics. <button class="btn btn--close-cookie">Got it!</button';

header1.append(message);

document
  .querySelector(".btn--close-cookie")
  .addEventListener("click", function () {
    message.remove();
  });

message.style.backgroundColor = "#37383d";
message.style.width = "100%";
message.style.height =
  Number.parseFloat(getComputedStyle(message).height, 10) + 30 + "px";
console.log(message.style.backgroundColor);

const bookService = document.querySelector(".btn--book");
const form = document.querySelector(".form");

bookService.addEventListener("click", function (e) {
  const s1coords = form.getBoundingClientRect();
  console.log(s1coords);

  form.scrollIntoView({ behavior: "smooth" });
});

document.querySelectorAll(".link").forEach(function (el) {
  el.addEventListener("click", function (e) {
    e.preventDefault();
    const id = this.getAttribute("href");
    document.querySelector(id).scrollIntoView({ behavior: "smooth" });
  });
});

/*
document.querySelector(".link").addEventListener("click", function (e) {
  console.log(e.target);

  if (e.target.classList.contains("links")) {
    const id = e.target.getAttribute("href");
    console.log(id);
    document.querySelector(id).scrollIntoView({ behavior: "smooth" });
  }
});
*/
const headerChild = document.querySelector(".header-child");

const handleHover = function (e) {
  if (e.target.classList.contains("link")) {
    const link = e.target;
    const siblings = link.closest(".header-child").querySelectorAll(".link");
    const logo = link.closest(".header-child").querySelector(".left");

    siblings.forEach((el) => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

headerChild.addEventListener("mouseover", handleHover.bind(0.5));
headerChild.addEventListener("mouseout", handleHover.bind(1));
