"use script";

document.addEventListener("DOMContentLoaded", () => {
  const signupForm = document.getElementById("signup-form");
  const loginForm = document.getElementById("login-form");
  const logoutForm = document.getElementById("logout-form");

  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(signupForm);
    const username = formData.get("username");
    const password = formData.get("password");
    const email = formData.get("email");
    const full_name = formData.get("full_name");

    try {
      const response = await fetch("/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password, email, full_name }),
      });
      if (response.ok) {
        alert("Signup successful.");
      } else {
        alert("Signup failed, try again!");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  });

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(loginForm);
    const username = formData.get("username");
    const password = formData.get("password");
    try {
      const response = await fetch("/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
      if (response.ok) {
        alert("Login Successful");
      } else {
        alert("Wrong password or username");
      }
    } catch (error) {
      console.error("Error", error);
    }
  });

  logoutForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/logout", {
        method: "POST",
      });
      if (response.ok) {
        alert("Logout successful");
      } else {
        alert("failed");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  });

  serviceForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(serviceForm);
    const selectedServices = formData.getAll("service");
    try {
      const response = await fetch("/select-services", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ selectedServices }),
      });
      if (response.ok) {
        alert("Service selection successful");
      } else {
        alert("Service selection failed");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  });

  //fetch and display selected services
  fetchSelectedServices();
});

async function fetchSelectedServices() {
  try {
    const response = await fetch("/selected-services");
    if (response.ok) {
      const selectedServices = await response.json();
      displaySelectedServices(selectedServices);
    } else {
      console.error("Failed to fetch selected services");
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

function displaySelectedServices(selectedServices) {
  const selectedServicesList = document.getElementById(
    "selected-services-list"
  );
  selectedServicesList.innerHTML = "";

  selectedServices.forEach((service) => {
    const listItem = document.createElement("li");
    listItem.textContent = service.name;
    selectedServicesList.appendChild(listItem);
  });
}

if (window.location.pathname === "/service-content") {
  fetchSelectedServices();
}

function fetchServiceContent() {
  const urlParams = new URLSearchParams(window.location.search);
  const serviceId = urlParams.get("id");

  fetch(`/service/${serviceId}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      displaySelectedServices(data);
    })
    .catch((error) => {
      console.error("Error fetching service content:", error);
    });
}

function displayServiceContent(serviceContent) {
  const serviceNameElement = document.getElementById("service-name");

  serviceNameElement.textContent = serviceContent.name;
  const serviceContentElement = document.getElementById("service-content");
  serviceContentElement.innerHTML = "";

  serviceContent.select.forEach((selected) => {
    const selectedSection = document.createElement("section");
    selectedSection.innerHTML = `<h2>${selected.title} </h2>
  <p>${selected.description}</p>
  `;
    serviceContentElement.appendChild(selectedSection);
  });
}

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
const form = document.querySelector("#signup-form");

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

// Service order form submission

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
