"use strict";

const canvas = document.getElementById("matrixCanvas");
const matrixContext = canvas ? canvas.getContext("2d") : null;
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const matrixFontSize = 16;
const maxPixelRatio = 1.5;
let matrixDrops = [];
let matrixFrame = 0;
let lastMatrixFrame = 0;
let matrixPixelRatio = 1;

function resizeMatrixCanvas() {
  if (!canvas || !matrixContext) {
    return;
  }

  matrixPixelRatio = Math.min(window.devicePixelRatio || 1, maxPixelRatio);
  canvas.width = Math.round(window.innerWidth * matrixPixelRatio);
  canvas.height = Math.round(window.innerHeight * matrixPixelRatio);
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  matrixContext.setTransform(matrixPixelRatio, 0, 0, matrixPixelRatio, 0, 0);

  const columnCount = Math.ceil(window.innerWidth / (matrixFontSize * 1.6));
  matrixDrops = Array.from(
    { length: columnCount },
    () => -Math.floor(Math.random() * (window.innerHeight / matrixFontSize))
  );

  if (reducedMotion.matches) {
    drawMatrix();
  }
}

function drawMatrix(timestamp = 0) {
  if (!matrixContext) {
    return;
  }

  matrixFrame = 0;
  if (!reducedMotion.matches && timestamp - lastMatrixFrame < 45) {
    matrixFrame = window.requestAnimationFrame(drawMatrix);
    return;
  }

  lastMatrixFrame = timestamp;
  matrixContext.globalCompositeOperation = "destination-out";
  matrixContext.fillStyle = "rgba(0, 0, 0, 0.2)";
  matrixContext.fillRect(0, 0, window.innerWidth, window.innerHeight);
  matrixContext.globalCompositeOperation = "source-over";
  matrixContext.font = `${matrixFontSize}px monospace`;
  matrixContext.textBaseline = "top";

  matrixDrops.forEach((drop, column) => {
    const x = column * (window.innerWidth / matrixDrops.length);
    const y = drop * matrixFontSize;

    matrixContext.fillStyle = "#aafbf0";
    matrixContext.globalAlpha = 0.24;
    matrixContext.fillText(Math.random() > 0.5 ? "1" : "0", x, y);
    matrixContext.fillStyle = "#38d9e8";
    matrixContext.globalAlpha = 0.08;
    matrixContext.fillText(Math.random() > 0.5 ? "1" : "0", x, y - matrixFontSize);

    if (!reducedMotion.matches) {
      if (y > window.innerHeight && Math.random() > 0.975) {
        matrixDrops[column] = 0;
      }
      matrixDrops[column] += 0.5 + Math.random() * 0.4;
    }
  });

  matrixContext.globalAlpha = 1;
  if (!reducedMotion.matches) {
    matrixFrame = window.requestAnimationFrame(drawMatrix);
  }
}

resizeMatrixCanvas();
window.addEventListener("resize", resizeMatrixCanvas);
reducedMotion.addEventListener("change", () => {
  if (matrixFrame) {
    window.cancelAnimationFrame(matrixFrame);
    matrixFrame = 0;
  }

  lastMatrixFrame = 0;
  resizeMatrixCanvas();
  if (!reducedMotion.matches && !matrixFrame) {
    matrixFrame = window.requestAnimationFrame(drawMatrix);
  }
});

if (!reducedMotion.matches && matrixContext) {
  matrixFrame = window.requestAnimationFrame(drawMatrix);
}

const scrollLocks = new Set();
let originalScrollStyles = null;

function setScrollLock(lockName, shouldLock) {
  if (shouldLock) {
    if (scrollLocks.has(lockName)) {
      return;
    }

    if (scrollLocks.size === 0) {
      originalScrollStyles = {
        htmlOverflow: document.documentElement.style.overflow,
        htmlOverscrollBehavior: document.documentElement.style.overscrollBehavior,
        bodyOverflow: document.body.style.overflow,
      };
      document.documentElement.style.overflow = "hidden";
      document.documentElement.style.overscrollBehavior = "none";
      document.body.style.overflow = "hidden";
    }

    scrollLocks.add(lockName);
    return;
  }

  if (!scrollLocks.delete(lockName) || scrollLocks.size > 0) {
    return;
  }

  document.documentElement.style.overflow = originalScrollStyles.htmlOverflow;
  document.documentElement.style.overscrollBehavior =
    originalScrollStyles.htmlOverscrollBehavior;
  document.body.style.overflow = originalScrollStyles.bodyOverflow;
  originalScrollStyles = null;
}

const readMoreButton = document.getElementById("readMoreBtn");
const closeStoryButton = document.getElementById("closeBtn");
const aboutText = document.getElementById("aboutText");
const aboutContent = document.querySelector(".about-content");
const aboutSection = document.querySelector(".about");

function setAboutExpanded(isExpanded) {
  if (!readMoreButton || !closeStoryButton || !aboutText || !aboutContent || !aboutSection) {
    return;
  }

  aboutText.classList.toggle("expanded", isExpanded);
  aboutContent.classList.toggle("hide-img", isExpanded);
  aboutSection.classList.toggle("reading-open", isExpanded);
  document.body.classList.toggle("story-open", isExpanded);
  readMoreButton.setAttribute("aria-expanded", String(isExpanded));
  closeStoryButton.hidden = !isExpanded;
  setScrollLock("about", isExpanded);
  (isExpanded ? closeStoryButton : readMoreButton).focus();
}

if (readMoreButton && closeStoryButton) {
  readMoreButton.addEventListener("click", () => setAboutExpanded(true));
  closeStoryButton.addEventListener("click", () => setAboutExpanded(false));
}

const projectGalleries = {
  "Face Detection": {
    name: "Face Detection",
    images: [
      "assets/face/face1.jpg",
      "assets/face/face2.jpg",
      "assets/face/face3.jpg",
      "assets/face/face4.jpg",
      "assets/face/face5.jpg",
      "assets/face/face6.jpg",
    ],
    description: `
      <strong>Face Detection</strong><br>
      This Flutter application allows users to detect faces in images using machine learning. It provides an interactive and user-friendly interface with the following main features:<br><br>
      <strong>Key Features:</strong><br>
      • Pick Image from the gallery<br>
      • Capture Image using the camera<br>
      • Clear the image and results<br>
      Once the user selects or captures an image, the app uses Google ML Kit to detect faces and draws green rectangles around each detected face.<br><br>
      <strong>Technologies Used:</strong><br>
      • Flutter – for building the cross-platform UI<br>
      • Google ML Kit – for face detection using on-device machine learning<br>
      • Image Picker – for selecting images from the gallery or capturing from the camera<br>
      • CustomPainter – to draw bounding boxes over detected faces<br>
      • SnackBar – to show the number of faces detected in a user-friendly way<br><br>
      <strong>Skills:</strong> Responsive UI Design · User Experience (UX) · Image Picker Integration · Custom Painting in Flutter · Google ML Kit · Image Processing
    `,
  },
  "Move App": {
    name: "Move App",
    images: [
      "assets/moive/moive1.jpg",
      "assets/moive/moive2.jpg",
      "assets/moive/moive3.jpg",
      "assets/moive/moive4.jpg",
      "assets/moive/moive5.jpg",
      "assets/moive/moive6.jpg",
    ],
    description: `
      <strong>Move App</strong><br>
      This Flutter application helps users discover and track movies. It features a beautiful UI, movie details, search functionality, and more.<br><br>
      <strong>Key Features:</strong><br>
      • Browse trending and popular movies<br>
      • Search for movies<br>
      • View detailed information and trailers<br>
      • Add movies to favorites<br><br>
      <strong>Technologies Used:</strong><br>
      • Flutter · REST API · Responsive UI · State Management
    `,
  },
  "Smart Garage": {
    name: "Smart Garage",
    images: [
      "assets/garag/garag1.jpg",
      "assets/garag/garag2.jpg",
      "assets/garag/garag3.jpg",
      "assets/garag/garag4.jpg",
      "assets/garag/garag5.jpg",
      "assets/garag/garag6.jpg",
      "assets/garag/garag7.jpg",
      "assets/garag/garag8.jpg",
      "assets/garag/garag9.jpg",
      "assets/garag/garag10.jpg",
    ],
    description: `
      <strong>Smart Garage</strong><br>
      This project provides a smart solution for managing parking spaces and reservations using a modern UI and real-time updates.<br><br>
      <strong>Key Features:</strong><br>
      • View available and occupied spaces<br>
      • Reserve and manage parking<br>
      • Payment integration<br>
      • User profile management<br><br>
      <strong>Technologies Used:</strong><br>
      • Flutter · Firebase · Responsive UI · State Management
    `,
  },
  "Chat App": {
    name: "Chat App",
    images: [
      "assets/chat/chat1.jpg",
      "assets/chat/chat2.jpg",
      "assets/chat/chat3.jpg",
    ],
    description: `
      <strong>Chat App</strong><br>
      A modern chat application built with Flutter, supporting real-time messaging, authentication, and media sharing.<br><br>
      <strong>Key Features:</strong><br>
      • Real-time chat<br>
      • User authentication<br>
      • Send images and files<br>
      • Responsive UI<br><br>
      <strong>Technologies Used:</strong><br>
      • Flutter · Firebase · Cloud Firestore · Authentication
    `,
  },
  "Weather App": {
    name: "Weather App",
    images: [
      "assets/weather/weather1.jpg",
      "assets/weather/weather2.jpg",
      "assets/weather/weather3.jpg",
      "assets/weather/weather4.jpg",
    ],
    description: `
      <strong>Weather App</strong><br>
      A Flutter application to display weather information for different cities with a modern and responsive UI.<br><br>
      <strong>Key Features:</strong><br>
      • Real-time weather data<br>
      • Search for cities<br>
      • Attractive weather icons<br>
      • Responsive design<br><br>
      <strong>Technologies Used:</strong><br>
      • Flutter · REST API · Responsive UI · State Management
    `,
  },
  "News App": {
    name: "News App",
    images: [
      "assets/news/news1.jpg",
      "assets/news/news2.jpg",
      "assets/news/news3.jpg",
      "assets/news/news4.jpg",
      "assets/news/news5.jpg",
    ],
    description: `
      <strong>News App</strong><br>
      A Flutter application for browsing the latest news articles with categories, search, and a modern UI.<br><br>
      <strong>Key Features:</strong><br>
      • Browse news by category<br>
      • Search for articles<br>
      • Responsive design<br>
      • Save favorite articles<br><br>
      <strong>Technologies Used:</strong><br>
      • Flutter · REST API · Responsive UI · State Management
    `,
  },
  "Notes App": {
    name: "Notes App",
    images: [
      "assets/note/note1.jpg",
      "assets/note/note2.jpg",
      "assets/note/note3.jpg",
      "assets/note/note4.jpg",
    ],
    description: `
      <strong>Notes App</strong><br>
      A Flutter application for creating, editing, and organizing notes with a simple and modern UI.<br><br>
      <strong>Key Features:</strong><br>
      • Create and edit notes<br>
      • Organize notes by category<br>
      • Responsive design<br>
      • Search notes<br><br>
      <strong>Technologies Used:</strong><br>
      • Flutter · Local Storage · Responsive UI
    `,
  },
  "AI Chat": {
    name: "AI Chat",
    plainImage: true,
    images: ["assets/ChatAi/chatai1.jpg"],
    description: `
      <strong>AI Chat</strong><br>
      A simple AI-powered chat application.<br><br>
      <strong>Key Features:</strong><br>
      • Chat with AI<br>
      • Simple UI<br>
      • Fast response<br><br>
      <strong>Technologies Used:</strong><br>
      • Flutter · AI API · Responsive UI
    `,
  },
  "Cure App": {
    name: "Cure App",
    images: [
      "assets/cure/cure1.jpg",
      "assets/cure/cure2.png",
      "assets/cure/cure3.png",
      "assets/cure/cure4.png",
      "assets/cure/cure5.png",
      "assets/cure/cure6.png",
      "assets/cure/cure7.png",
      "assets/cure/cure8.png",
      "assets/cure/cure9.png",
      "assets/cure/cure10.png",
      "assets/cure/cure11.png",
      "assets/cure/cure12.png",
      "assets/cure/cure13.png",
      "assets/cure/cure14.png",
      "assets/cure/cure15.png",
      "assets/cure/cure16.jpg",
      "assets/cure/cure17.jpg",
      "assets/cure/cure18.jpg",
      "assets/cure/cure19.jpg",
      "assets/cure/cure20.png",
      "assets/cure/cure21.png",
      "assets/cure/cure22.jpg",
      "assets/cure/cure23.png",
      "assets/cure/cure24.png",
      "assets/cure/cure25.jpg",
      "assets/cure/cure26.jpg",
      "assets/cure/cure27.jpg",
      "assets/cure/cure28.jpg",
      "assets/cure/cure29.jpg",
      "assets/cure/cure30.jpg",
    ],
    description: `
      <strong>Cure App</strong><br>
      A healthcare application built with Flutter featuring a modern and intuitive user interface.<br><br>
      <strong>Key Features:</strong><br>
      • Intuitive user interface<br>
      • Specialized medical features<br>
      • Responsive design<br><br>
      <strong>Technologies Used:</strong><br>
      • Flutter · UI/UX Design · State Management
    `,
  },
};

const imageModal = document.getElementById("imgModal");
const imageModalContent = imageModal
  ? imageModal.querySelector(".img-modal-content")
  : null;
const imageModalImage = document.getElementById("imgModalImg");
const imageModalText = document.getElementById("imgModalText");
const imageModalClose = document.getElementById("imgModalClose");
const imageModalPrevious = document.getElementById("imgModalPrev");
const imageModalNext = document.getElementById("imgModalNext");
let activeGallery = null;
let activeImageIndex = 0;
let lastFocusedElement = null;

function renderGalleryImage() {
  const imageSource = activeGallery.images[activeImageIndex];
  imageModalImage.src = imageSource;
  imageModalImage.alt = `${activeGallery.name} Example ${activeImageIndex + 1}`;
}

function openImageModal(image, gallery = null) {
  if (!imageModal || !imageModalImage || !imageModalText) {
    return;
  }

  activeGallery = gallery;
  activeImageIndex = 0;
  lastFocusedElement = document.activeElement;
  imageModal.classList.toggle("has-gallery", Boolean(gallery && gallery.images.length > 1));
  imageModal.classList.toggle("is-plain", Boolean(gallery && gallery.plainImage));

  if (gallery) {
    renderGalleryImage();
    imageModalText.innerHTML = gallery.description;
  } else {
    imageModalImage.src = image.currentSrc || image.src;
    imageModalImage.alt = image.alt || "Portfolio image";
    imageModalText.textContent = "";
  }

  imageModal.hidden = false;
  imageModal.setAttribute("aria-hidden", "false");
  setScrollLock("image-modal", true);
  imageModalClose.focus();
}

function closeImageModal() {
  if (!imageModal || imageModal.hidden) {
    return;
  }

  imageModal.hidden = true;
  imageModal.setAttribute("aria-hidden", "true");
  imageModal.classList.remove("has-gallery", "is-plain");
  setScrollLock("image-modal", false);
  activeGallery = null;

  if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
    lastFocusedElement.focus();
  }
}

function changeGalleryImage(direction) {
  if (!activeGallery || activeGallery.images.length < 2) {
    return;
  }

  const imageCount = activeGallery.images.length;
  activeImageIndex = (activeImageIndex + direction + imageCount) % imageCount;
  renderGalleryImage();
}

document.querySelectorAll(".achievement-card, .project-card").forEach((card) => {
  const image = card.querySelector("img");
  if (!image) {
    return;
  }

  function showCardImage() {
    openImageModal(image, projectGalleries[image.alt] || null);
  }

  card.addEventListener("click", showCardImage);
  card.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      showCardImage();
    }
  });
});

if (imageModalClose) {
  imageModalClose.addEventListener("click", closeImageModal);
}

if (imageModal) {
  imageModal.addEventListener("click", (event) => {
    if (event.target === imageModal) {
      closeImageModal();
    }
  });
}

if (imageModalPrevious) {
  imageModalPrevious.addEventListener("click", () => changeGalleryImage(-1));
}

if (imageModalNext) {
  imageModalNext.addEventListener("click", () => changeGalleryImage(1));
}

document.addEventListener("keydown", (event) => {
  if (aboutText && aboutText.classList.contains("expanded") && event.key === "Escape") {
    setAboutExpanded(false);
    return;
  }

  const mobileMenuOpen = document
    .getElementById("navLinks")
    ?.classList.contains("active");
  if (mobileMenuOpen && event.key === "Escape") {
    setMenuOpen(false);
    document.getElementById("menuIcon").focus();
    return;
  }

  if (!imageModal || imageModal.hidden) {
    return;
  }

  if (event.key === "Escape") {
    closeImageModal();
  } else if (event.key === "ArrowLeft") {
    changeGalleryImage(-1);
  } else if (event.key === "ArrowRight") {
    changeGalleryImage(1);
  } else if (event.key === "Tab" && imageModalContent) {
    const focusableElements = Array.from(
      imageModalContent.querySelectorAll("button:not([disabled])")
    ).filter((element) => element.getClientRects().length > 0);
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
    } else if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  }
});

function setMenuOpen(isOpen) {
  const menuButton = document.getElementById("menuIcon");
  const navLinks = document.getElementById("navLinks");
  if (!menuButton || !navLinks) {
    return;
  }

  navLinks.classList.toggle("active", isOpen);
  navLinks.inert = !isOpen && window.matchMedia("(max-width: 900px)").matches;
  navLinks.setAttribute("aria-hidden", String(!isOpen && navLinks.inert));
  menuButton.classList.toggle("active", isOpen);
  menuButton.setAttribute("aria-expanded", String(isOpen));
  menuButton.setAttribute(
    "aria-label",
    isOpen ? "Close navigation menu" : "Open navigation menu"
  );
  const menuIcon = menuButton.querySelector("i");
  if (menuIcon) {
    menuIcon.classList.toggle("fa-bars", !isOpen);
    menuIcon.classList.toggle("fa-xmark", isOpen);
  }
  setScrollLock("mobile-menu", isOpen);
}

const menuButton = document.getElementById("menuIcon");
const navLinks = document.getElementById("navLinks");
const mainNavigation = document.querySelector("body > nav");

if (menuButton && navLinks) {
  function updateTopNavigation() {
    const isAtPageTop = window.scrollY <= 12;
    const isHidden = !isAtPageTop;

    document.body.classList.toggle("is-page-scrolled", isHidden);
    menuButton.inert = isHidden;
    menuButton.setAttribute("aria-hidden", String(isHidden));
    menuButton.tabIndex = isHidden ? -1 : 0;

    if (mainNavigation) {
      mainNavigation.inert = isHidden;
      mainNavigation.setAttribute("aria-hidden", String(isHidden));
    }
  }

  updateTopNavigation();
  window.addEventListener("scroll", updateTopNavigation, { passive: true });
  window.addEventListener("pageshow", updateTopNavigation);

  menuButton.addEventListener("click", () => {
    setMenuOpen(!navLinks.classList.contains("active"));
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", (event) => {
      const target = document.querySelector(link.getAttribute("href"));
      if (!target) {
        return;
      }

      event.preventDefault();
      setMenuOpen(false);
      window.history.pushState(null, "", link.getAttribute("href"));
      window.requestAnimationFrame(() => {
        target.scrollIntoView({
          behavior: reducedMotion.matches ? "auto" : "smooth",
          block: "start",
        });
      });
    });
  });

  document.addEventListener("click", (event) => {
    if (
      navLinks.classList.contains("active") &&
      !navLinks.contains(event.target) &&
      !menuButton.contains(event.target)
    ) {
      setMenuOpen(false);
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 900 && navLinks.classList.contains("active")) {
      setMenuOpen(false);
    }
    navLinks.inert = window.innerWidth <= 900 && !navLinks.classList.contains("active");
    navLinks.setAttribute("aria-hidden", String(navLinks.inert));
  });

  navLinks.inert = window.innerWidth <= 900;
  navLinks.setAttribute("aria-hidden", String(navLinks.inert));
}

const contactForm = document.querySelector(".contact-form form");
if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(contactForm);
    const name = String(formData.get("fullname") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const message = String(formData.get("message") || "").trim();
    const subject = encodeURIComponent(`Portfolio Contact: ${name}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    );

    window.location.href =
      `mailto:iabdelrahmanmagdy802@gmail.com?subject=${subject}&body=${body}`;
  });
}
