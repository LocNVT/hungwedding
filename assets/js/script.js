// Countdown timer
const weddingDate = new Date("2025-12-27T18:00:00").getTime();

function updateCountdown() {
  const now = new Date().getTime();
  const distance = weddingDate - now;

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  document.getElementById("countdown").innerHTML = `${days} : ${hours
    .toString()
    .padStart(2, "0")} : ${minutes.toString().padStart(2, "0")} : ${seconds
    .toString()
    .padStart(2, "0")}`;

  if (distance < 0) {
    document.getElementById("countdown").innerHTML = "The Wedding Day!";
  }
}

updateCountdown();
setInterval(updateCountdown, 1000);

// Image slider
document.addEventListener("DOMContentLoaded", () => {
  const slides = document.querySelectorAll(".slide");
  const dotsContainer = document.querySelector(".dots");
  const prevBtn = document.querySelector(".prev");
  const nextBtn = document.querySelector(".next");

  let index = 0;
  let interval;

  // Create dots
  slides.forEach((_, i) => {
    const dot = document.createElement("span");
    dot.classList.add("dot");
    if (i === 0) dot.classList.add("active");
    dot.addEventListener("click", () => goToSlide(i));
    dotsContainer.appendChild(dot);
  });

  const dots = document.querySelectorAll(".dot");

  function showSlide(i) {
    slides.forEach(slide => slide.classList.remove("active"));
    dots.forEach(dot => dot.classList.remove("active"));

    slides[i].classList.add("active");
    dots[i].classList.add("active");
  }

  function nextSlide() {
    index = (index + 1) % slides.length;
    showSlide(index);
  }

  function prevSlide() {
    index = (index - 1 + slides.length) % slides.length;
    showSlide(index);
  }

  function goToSlide(i) {
    index = i;
    showSlide(index);
    restartAutoPlay();
  }

  // Auto play
  function startAutoPlay() {
    interval = setInterval(nextSlide, 3000);
  }

  function stopAutoPlay() {
    clearInterval(interval);
  }

  function restartAutoPlay() {
    stopAutoPlay();
    startAutoPlay();
  }

  // Button events
  nextBtn.addEventListener("click", () => {
    nextSlide();
    restartAutoPlay();
  });

  prevBtn.addEventListener("click", () => {
    prevSlide();
    restartAutoPlay();
  });

  // Start slider
  startAutoPlay();
});

