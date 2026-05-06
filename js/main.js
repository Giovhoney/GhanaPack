const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");
const siteHeader = document.querySelector(".site-header");

if (navToggle && siteNav) {
  navToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
    navToggle.textContent = isOpen ? "Close" : "Menu";

    if (isOpen) {
      siteHeader?.classList.remove("is-hidden");
    }
  });
}

if (siteHeader) {
  let lastScrollY = window.scrollY;
  let ticking = false;

  const updateHeaderVisibility = () => {
    const currentScrollY = Math.max(window.scrollY, 0);
    const isMenuOpen = siteNav?.classList.contains("is-open");
    const scrollingDown = currentScrollY > lastScrollY;
    const scrollDistance = Math.abs(currentScrollY - lastScrollY);

    if (currentScrollY < 80 || isMenuOpen) {
      siteHeader.classList.remove("is-hidden");
    } else if (scrollDistance > 6 && scrollingDown) {
      siteHeader.classList.add("is-hidden");
    } else if (scrollDistance > 6) {
      siteHeader.classList.remove("is-hidden");
    }

    lastScrollY = currentScrollY;
    ticking = false;
  };

  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        window.requestAnimationFrame(updateHeaderVisibility);
        ticking = true;
      }
    },
    { passive: true }
  );
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
  ".hero-content, .hero-media, .proof-strip, .section-heading, .category-card, .feature, .split-section > *, .industry-row span, .service-card, .gallery-card, .faq-list details, .cta-band, .product-card, .store-panel, .store-card, .contact-panel, .quote-form"
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

const storeProducts = Array.from(document.querySelectorAll("[data-store-product]"));
const storeSearch = document.querySelector("#storeSearch");
const storeFilters = Array.from(document.querySelectorAll(".store-filter"));
const storeCount = document.querySelector("#storeCount");
const storeEmpty = document.querySelector(".store-empty");
const cartItemsWrap = document.querySelector("[data-cart-items]");
const storeCheckout = document.querySelector(".store-checkout");
const storeClear = document.querySelector(".store-clear");
const storeCustomerName = document.querySelector("#storeCustomerName");
const storeCustomerPhone = document.querySelector("#storeCustomerPhone");
const storeCustomerNote = document.querySelector("#storeCustomerNote");
const storeModal = document.querySelector(".store-modal");
const storeModalImage = document.querySelector(".store-modal-image");
const storeModalCategory = document.querySelector(".store-modal-category");
const storeModalTitle = document.querySelector("#storeModalTitle");
const storeModalDescription = document.querySelector(".store-modal-description");
const storeModalNote = document.querySelector(".store-modal-note");
const storeModalAdd = document.querySelector(".store-modal-add");
const quoteCart = [];

if (storeProducts.length) {
  let activeCategory = "all";
  let activeModalProduct;

  const normalise = (value) => value.toLowerCase().trim();

  const getProductData = (card) => ({
    name: card.dataset.name,
    category: card.dataset.category,
    keywords: card.dataset.keywords || "",
    description: card.querySelector("p")?.textContent.trim() || "",
    imageAlt: card.querySelector("img")?.alt || "",
    imageSrc: card.querySelector("img")?.getAttribute("src") || "",
    note: card.querySelector(".store-card-actions span")?.textContent.trim() || "Quote by quantity",
  });

  const addProductToCart = (product) => {
    const existingItem = quoteCart.find((item) => item.name === product.name);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      quoteCart.push({
        name: product.name,
        category: product.category,
        keywords: product.keywords,
        quantity: 1,
      });
    }

    renderCart();
  };

  const renderCart = () => {
    if (!cartItemsWrap || !storeCheckout) {
      return;
    }

    if (!quoteCart.length) {
      cartItemsWrap.innerHTML = '<p class="store-note">Your quote cart is empty. Add products to request availability and pricing.</p>';
    } else {
      cartItemsWrap.innerHTML = quoteCart
        .map(
          (item) =>
            `<div class="cart-line"><strong>${item.name}</strong><span>${item.category} • Qty: ${item.quantity}</span></div>`
        )
        .join("");
    }

    const name = storeCustomerName?.value.trim();
    const phone = storeCustomerPhone?.value.trim();
    const note = storeCustomerNote?.value.trim();
    const itemsText = quoteCart.length
      ? quoteCart.map((item) => `- ${item.name} (${item.category}) x ${item.quantity}`).join("\n")
      : "- I need help choosing packaging";
    const message = [
      "Hello GPS, I would like a quote from the website store.",
      name ? `Name: ${name}` : "",
      phone ? `Phone: ${phone}` : "",
      "",
      "Items:",
      itemsText,
      note ? `\nNotes: ${note}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    storeCheckout.href = `https://wa.me/233540645292?text=${encodeURIComponent(message)}`;
  };

  const filterProducts = () => {
    const searchTerm = normalise(storeSearch?.value || "");
    let visibleCount = 0;

    storeProducts.forEach((card) => {
      const product = getProductData(card);
      const haystack = normalise(`${product.name} ${product.category} ${product.keywords}`);
      const matchesCategory = activeCategory === "all" || product.category === activeCategory;
      const matchesSearch = !searchTerm || haystack.includes(searchTerm);
      const isVisible = matchesCategory && matchesSearch;

      card.hidden = !isVisible;
      if (isVisible) {
        visibleCount += 1;
      }
    });

    if (storeCount) {
      storeCount.textContent = String(visibleCount);
    }

    if (storeEmpty) {
      storeEmpty.hidden = visibleCount !== 0;
    }
  };

  storeFilters.forEach((button) => {
    button.addEventListener("click", () => {
      activeCategory = button.dataset.filter || "all";
      storeFilters.forEach((filterButton) => filterButton.classList.toggle("is-active", filterButton === button));
      filterProducts();
    });
  });

  storeSearch?.addEventListener("input", filterProducts);

  storeProducts.forEach((card) => {
    const addButton = card.querySelector(".store-add");

    addButton?.addEventListener("click", () => {
      const product = getProductData(card);
      addProductToCart(product);

      addButton.textContent = "Added";
      window.setTimeout(() => {
        addButton.textContent = "Add";
      }, 900);
    });

    card.addEventListener("click", (event) => {
      if (event.target.closest(".store-add")) {
        return;
      }

      const product = getProductData(card);
      activeModalProduct = product;

      if (storeModalImage) {
        storeModalImage.src = product.imageSrc;
        storeModalImage.alt = product.imageAlt;
      }

      if (storeModalCategory) {
        storeModalCategory.textContent = product.category;
      }

      if (storeModalTitle) {
        storeModalTitle.textContent = product.name;
      }

      if (storeModalDescription) {
        storeModalDescription.textContent = product.description;
      }

      if (storeModalNote) {
        storeModalNote.textContent = product.note;
      }

      storeModal?.removeAttribute("hidden");
      document.body.classList.add("modal-open");
    });
  });

  storeModalAdd?.addEventListener("click", () => {
    if (!activeModalProduct) {
      return;
    }

    addProductToCart(activeModalProduct);
    storeModalAdd.textContent = "Added to Quote";
    window.setTimeout(() => {
      storeModalAdd.textContent = "Add to Quote";
    }, 900);
  });

  document.querySelectorAll("[data-store-close]").forEach((button) => {
    button.addEventListener("click", () => {
      storeModal?.setAttribute("hidden", "");
      document.body.classList.remove("modal-open");
    });
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !storeModal?.hasAttribute("hidden")) {
      storeModal?.setAttribute("hidden", "");
      document.body.classList.remove("modal-open");
    }
  });

  [storeCustomerName, storeCustomerPhone, storeCustomerNote].forEach((field) => {
    field?.addEventListener("input", renderCart);
  });

  storeClear?.addEventListener("click", () => {
    quoteCart.splice(0, quoteCart.length);
    renderCart();
  });

  filterProducts();
  renderCart();
}
