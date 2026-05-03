const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");

if (navToggle && siteNav) {
  navToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
    navToggle.textContent = isOpen ? "Close" : "Menu";
  });
}

const quoteForm = document.querySelector(".quote-form");

if (quoteForm) {
  quoteForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(quoteForm);
    const interest = formData.get("interest") || "Packaging";
    const details = formData.get("message") || "";
    const phone = "233540645292";
    const message = encodeURIComponent(`Hello GPS, I would like a quote for ${interest}. ${details}`);
    window.location.href = `https://wa.me/${phone}?text=${message}`;
  });
}

document.querySelectorAll(".hero-slider").forEach((slider) => {
  const slides = Array.from(slider.querySelectorAll(".hero-slide"));
  const dotsWrap = slider.querySelector(".hero-slider-dots");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let activeIndex = slides.findIndex((slide) => slide.classList.contains("is-active"));
  let timer;

  if (slides.length < 2) {
    return;
  }

  if (activeIndex < 0) {
    activeIndex = 0;
    slides[activeIndex].classList.add("is-active");
  }

  const dots = dotsWrap
    ? slides.map((_, index) => {
        const dot = document.createElement("span");
        dot.className = index === activeIndex ? "is-active" : "";
        dotsWrap.appendChild(dot);
        return dot;
      })
    : [];

  const showSlide = (nextIndex) => {
    slides[activeIndex].classList.remove("is-active");
    dots[activeIndex]?.classList.remove("is-active");
    activeIndex = nextIndex;
    slides[activeIndex].classList.add("is-active");
    dots[activeIndex]?.classList.add("is-active");
  };

  const startSlider = () => {
    if (reduceMotion) {
      return;
    }

    stopSlider();
    timer = window.setInterval(() => {
      showSlide((activeIndex + 1) % slides.length);
    }, 3600);
  };

  const stopSlider = () => {
    window.clearInterval(timer);
  };

  slider.addEventListener("mouseenter", stopSlider);
  slider.addEventListener("mouseleave", startSlider);
  slider.addEventListener("focusin", stopSlider);
  slider.addEventListener("focusout", startSlider);

  if (!reduceMotion) {
    window.setTimeout(() => {
      showSlide((activeIndex + 1) % slides.length);
      startSlider();
    }, 900);
  }
});

const revealTargets = document.querySelectorAll(
  ".hero-content, .hero-media, .proof-strip, .section-heading, .category-card, .feature, .split-section > *, .industry-row span, .service-card, .faq-list details, .cta-band, .product-card, .contact-panel, .quote-form"
);

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14 }
  );

  revealTargets.forEach((target, index) => {
    target.classList.add("reveal");
    target.style.transitionDelay = `${Math.min(index % 6, 5) * 70}ms`;
    revealObserver.observe(target);
  });
} else {
  revealTargets.forEach((target) => target.classList.add("is-visible"));
}

document.querySelectorAll("img[data-swap-src]").forEach((image) => {
  const originalSrc = image.getAttribute("src");
  const swapSrc = image.dataset.swapSrc;
  const parent = image.closest("a, article, figure");

  if (!parent || !swapSrc) {
    return;
  }

  parent.addEventListener("mouseenter", () => {
    image.setAttribute("src", swapSrc);
  });

  parent.addEventListener("mouseleave", () => {
    image.setAttribute("src", originalSrc);
  });

  parent.addEventListener("focusin", () => {
    image.setAttribute("src", swapSrc);
  });

  parent.addEventListener("focusout", () => {
    image.setAttribute("src", originalSrc);
  });
});
