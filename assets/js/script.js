// ===== CONFIGURATION - CHỈNH SỬA THÔNG TIN TẠI ĐÂY =====
const CONFIG = {
  // URL Google Maps (thay đổi theo địa chỉ thật)
  mapUrl:
    "https://maps.google.com/maps?q=Nguyen+Van+Qua,+District+12,+Ho+Chi+Minh+City",

  // URL nhạc nền (thay bằng link nhạc của bạn)
  musicUrl: "./assets/music/một-đời.wav",

  // URL Google Apps Script Web App (sau khi deploy)
  googleSheetsUrl:
    "https://script.google.com/macros/s/AKfycbxB9Dp7Toh6MFJovZ4-Ycr4I9gqKwQRwnLTyLlB2YF7mm7YM22LBkYu6cDT55GvwzVX/exec",

  // ID Google Sheets (lấy từ URL sheets)
  googleSheetsId: "1UTJaIhmdPYQznCw_i29xrv-7Yv-6LuPxgLs83Dt9OdM",

  // Bật/tắt chế độ offline (lưu localStorage khi không kết nối được Sheets)
  offlineMode: true,
};

// ===== WAIT FOR DOM TO BE FULLY LOADED =====
document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM fully loaded and parsed");
  // Initialize all functionality after DOM is ready
  // initCountdown();
  // initFloatingHearts();
  initScrollAnimations();
  initMusicControl();
  initRSVPForm();
  initLazyLoading();
  initSmoothScrolling();
  initAccessibility();
  initTitle();
});

// // ===== COUNTDOWN FUNCTIONALITY =====
// let countdownInterval;

// function initCountdown() {
//   updateCountdown(); // Initial call
//   countdownInterval = setInterval(updateCountdown, 1000);
// }

// function updateCountdown() {
//   const countdownElement = document.getElementById("countdown");
//   if (!countdownElement) {
//     console.warn("Countdown element not found");
//     return;
//   }

//   const now = new Date().getTime();
//   const weddingTime = new Date(CONFIG.weddingDate).getTime();
//   const distance = weddingTime - now;

//   if (distance < 0) {
//     countdownElement.innerHTML = "<p>Đám cưới đã diễn ra!</p>";
//     clearInterval(countdownInterval);
//     return;
//   }

//   const days = Math.floor(distance / (1000 * 60 * 60 * 24));
//   const hours = Math.floor(
//     (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
//   );
//   const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
//   const seconds = Math.floor((distance % (1000 * 60)) / 1000);

//   // Check if elements exist before updating
//   const daysEl = document.getElementById("days");
//   const hoursEl = document.getElementById("hours");
//   const minutesEl = document.getElementById("minutes");
//   const secondsEl = document.getElementById("seconds");

//   if (daysEl) daysEl.textContent = String(days).padStart(2, "0");
//   if (hoursEl) hoursEl.textContent = String(hours).padStart(2, "0");
//   if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, "0");
//   if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, "0");
// }

// ===== SCROLL ANIMATIONS =====
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  }, observerOptions);

  // Observe all elements with fade-in class
  const fadeElements = document.querySelectorAll(".fade-in");
  fadeElements.forEach((el) => observer.observe(el));
}

// ===== MUSIC CONTROL =====
let isPlaying = false;
let music;
let musicControl;
let musicIcon;

function initMusicControl() {
  music = document.getElementById("backgroundMusic");
  musicControl = document.getElementById("musicControl");
  musicIcon = document.getElementById("musicIcon");

  if (!music || !musicControl || !musicIcon) {
    console.warn("Music control elements not found");
    return;
  }

  // Set music source
  music.src = CONFIG.musicUrl;
  music.volume = 0.5; // Set comfortable volume
  music.loop = true;

  // AUTO-PLAY: Try immediately
  forceAutoPlay();

  musicControl.addEventListener("click", toggleMusic);

  // Add keyboard support for music control
  musicControl.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleMusic();
    }
  });
}

function forceAutoPlay() {
  // Method 1: Try direct play immediately
  const playPromise = music.play();

  if (playPromise !== undefined) {
    playPromise
      .then(() => {
        // Auto-play successful
        isPlaying = true;
        musicIcon.textContent = "⏸️";
        console.log("✓ Music auto-playing on page load");
      })
      .catch((error) => {
        console.log("Browser blocked auto-play, enabling on first interaction");

        // Method 2: Play on FIRST interaction of ANY type
        const playOnInteraction = () => {
          music
            .play()
            .then(() => {
              isPlaying = true;
              musicIcon.textContent = "⏸️";
              console.log("✓ Music started");
            })
            .catch((e) => console.log("Play error:", e));
        };

        // Add one-time listeners for any interaction
        document.addEventListener("click", playOnInteraction, { once: true });
        document.addEventListener("touchstart", playOnInteraction, {
          once: true,
        });
        document.addEventListener("keydown", playOnInteraction, { once: true });
        document.addEventListener("scroll", playOnInteraction, {
          once: true,
          passive: true,
        });
      });
  }
}

function toggleMusic() {
  if (!music) return;

  if (isPlaying) {
    music.pause();
    musicIcon.textContent = "🎵";
    isPlaying = false;
  } else {
    music.play().catch((e) => {
      console.log("Cannot play music:", e);
      showToast("Không thể phát nhạc nền");
    });
    musicIcon.textContent = "⏸️";
    isPlaying = true;
  }
}

// ===== RSVP FORM =====
document.getElementById("rsvpForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const formData = {
    name: document.getElementById("name").value,
    phone: document.getElementById("phone").value,
    message: document.getElementById("message").value,
    guests: document.getElementById("guests").value,
    timestamp: new Date().toISOString(),
  };

  // Save to localStorage
  const rsvps = JSON.parse(localStorage.getItem("wedding-rsvps") || "[]");
  rsvps.push(formData);
  localStorage.setItem("wedding-rsvps", JSON.stringify(rsvps));

  alert("Cảm ơn bạn đã xác nhận tham dự! 💕");
  this.reset();
});

// Smooth scroll for all sections
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  });
});

// Show/hide scroll up button
const scrollUpBtn = document.querySelector(".scroll-up");
window.addEventListener("scroll", () => {
  if (window.scrollY > 300) {
    scrollUpBtn.style.display = "flex";
  } else {
    scrollUpBtn.style.display = "none";
  }
});
scrollUpBtn.style.display = "none";

// ===== TOAST NOTIFICATION =====
function showToast(message) {
  const toast = document.getElementById("toast");
  const toastMessage = document.getElementById("toastMessage");

  if (!toast || !toastMessage) {
    console.warn("Toast elements not found");
    alert(message); // Fallback to alert
    return;
  }

  toastMessage.textContent = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

// ===== LAZY LOADING FOR IMAGES =====
function initLazyLoading() {
  if ("loading" in HTMLImageElement.prototype) {
    // Browser supports lazy loading natively
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach((img) => {
      img.src = img.src;
    });
  } else {
    // Fallback for browsers that don't support lazy loading
    const script = document.createElement("script");
    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js";
    document.body.appendChild(script);
  }
}

// ===== SMOOTH SCROLLING =====
function initSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });
}

// ===== ACCESSIBILITY ENHANCEMENTS =====
function initAccessibility() {
  // Add focus indicators for better accessibility
  const focusableElements = document.querySelectorAll(
    "button, input, select, textarea, a[href]"
  );
  focusableElements.forEach((element) => {
    element.addEventListener("focus", () => {
      element.style.outline = "3px solid var(--primary-pink)";
    });
    element.addEventListener("blur", () => {
      element.style.outline = "";
    });
  });
}

// ===== UTILITY FUNCTIONS =====
function getRSVPData() {
  try {
    return JSON.parse(localStorage.getItem("wedding-rsvps") || "[]");
  } catch (error) {
    console.error("Error getting RSVP data:", error);
    return [];
  }
}

function clearRSVPData() {
  try {
    localStorage.removeItem("wedding-rsvps");
    showToast("Đã xóa dữ liệu RSVP");
  } catch (error) {
    console.error("Error clearing RSVP data:", error);
    showToast("Có lỗi xảy ra khi xóa dữ liệu");
  }
}

// ===== DYNAMIC TITLE UPDATE =====
function initTitle() {
  const titleElement = document.getElementById("brideGroomTitle");
  if (titleElement) {
    titleElement.textContent = CONFIG.brideGroomTitle;
  }
}

// ===== CẬP NHẬT HÀM XỬ LÝ RSVP =====
async function handleRSVPSubmit(e) {
  e.preventDefault();

  const submitBtn = e.target.querySelector('button[type="submit"]');
  const originalBtnText = submitBtn.textContent;

  // Disable button và hiển thị loading
  submitBtn.disabled = true;
  submitBtn.textContent = "⏳ Đang gửi...";

  const formData = new FormData(e.target);
  const rsvpData = {
    name: formData.get("guestName")?.trim(),
    phone: formData.get("guestPhone")?.trim(),
    count: formData.get("guestCount"),
    message: formData.get("message")?.trim(),
    timestamp: new Date().toISOString(),
    ip: await getUserIP(),
  };

  // Validate required fields
  if (!rsvpData.name || !rsvpData.phone) {
    showToast("Vui lòng điền đầy đủ thông tin bắt buộc!", "error");
    resetSubmitButton(submitBtn, originalBtnText);
    return;
  }

  // Validate phone number
  const phoneRegex = /^[0-9]{10,11}$/;
  if (!phoneRegex.test(rsvpData.phone)) {
    showToast("Số điện thoại không hợp lệ!", "error");
    resetSubmitButton(submitBtn, originalBtnText);
    return;
  }

  try {
    // Gửi đến Google Sheets
    console.log(rsvpData);
    const success = await sendToGoogleSheets(rsvpData);

    if (success) {
      // Lưu backup vào localStorage
      saveToLocalStorage(rsvpData);

      showToast("✅ Cảm ơn bạn đã xác nhận tham dự!", "success");
      e.target.reset();

      // Analytics tracking (optional)
      trackRSVPSubmission(rsvpData);
    } else {
      throw new Error("Không thể gửi đến Google Sheets");
    }
  } catch (error) {
    console.error("RSVP submission error:", error);

    if (CONFIG.offlineMode) {
      // Lưu vào localStorage nếu offline
      saveToLocalStorage(rsvpData);
      showToast("⚠️ Đã lưu tạm thời. Sẽ đồng bộ khi có mạng!", "warning");
      e.target.reset();
    } else {
      showToast("❌ Có lỗi xảy ra, vui lòng thử lại!", "error");
    }
  } finally {
    resetSubmitButton(submitBtn, originalBtnText);
  }
}

// ===== FUNCTION GỬI DỮ LIỆU ĐẾN GOOGLE SHEETS =====
async function sendToGoogleSheets(data) {
  try {
    const response = await fetch(CONFIG.googleSheetsUrl, {
      method: "POST",
      mode: "no-cors", // Important for Google Apps Script
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    // no-cors mode không trả về response, assume success
    return true;
  } catch (error) {
    console.error("Google Sheets error:", error);

    // Fallback: thử gửi qua GET method
    try {
      const params = new URLSearchParams({
        name: data.name,
        phone: data.phone,
        count: data.count,
        message: data.message,
        timestamp: data.timestamp,
      });

      await fetch(`${CONFIG.googleSheetsUrl}?${params}`, {
        method: "GET",
        mode: "no-cors",
      });

      return true;
    } catch (fallbackError) {
      console.error("Fallback method failed:", fallbackError);
      return false;
    }
  }
}

// ===== FUNCTION LƯU VÀO LOCALSTORAGE =====
function saveToLocalStorage(data) {
  try {
    const existingRSVPs = JSON.parse(
      localStorage.getItem("wedding-rsvps") || "[]"
    );
    existingRSVPs.push({
      ...data,
      synced: false,
      localId: Date.now(),
    });
    localStorage.setItem("wedding-rsvps", JSON.stringify(existingRSVPs));
  } catch (error) {
    console.error("localStorage save error:", error);
  }
}

// ===== FUNCTION LẤY IP ADDRESS =====
async function getUserIP() {
  try {
    const response = await fetch("https://api.ipify.org?format=json");
    const data = await response.json();

    return data.ip;
  } catch (error) {
    return "Unknown";
  }
}

// ===== FUNCTION RESET NÚT SUBMIT =====
function resetSubmitButton(button, originalText) {
  button.disabled = false;
  button.textContent = originalText;
}

// ===== CẬP NHẬT FUNCTION TOAST VỚI LOẠI THÔNG BÁO =====
function showToast(message, type = "success") {
  const toast = document.getElementById("toast");
  const toastMessage = document.getElementById("toastMessage");

  if (!toast || !toastMessage) {
    alert(message);
    return;
  }

  // Xóa class cũ
  toast.className = "toast";

  // Thêm class theo loại
  switch (type) {
    case "success":
      toast.classList.add("toast-success");
      break;
    case "error":
      toast.classList.add("toast-error");
      break;
    case "warning":
      toast.classList.add("toast-warning");
      break;
  }

  toastMessage.textContent = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 4000);
}

// ===== FUNCTION ĐỒNG BỘ DỮ LIỆU OFFLINE =====
async function syncOfflineData() {
  try {
    const offlineData = JSON.parse(
      localStorage.getItem("wedding-rsvps") || "[]"
    );
    const unsyncedData = offlineData.filter((item) => !item.synced);

    if (unsyncedData.length === 0) return;

    let syncedCount = 0;

    for (const data of unsyncedData) {
      const success = await sendToGoogleSheets(data);
      if (success) {
        // Đánh dấu đã sync
        const index = offlineData.findIndex(
          (item) => item.localId === data.localId
        );
        if (index !== -1) {
          offlineData[index].synced = true;
        }
        syncedCount++;
      }
    }

    if (syncedCount > 0) {
      localStorage.setItem("wedding-rsvps", JSON.stringify(offlineData));
      showToast(`🔄 Đã đồng bộ ${syncedCount} dữ liệu offline!`, "success");
    }
  } catch (error) {
    console.error("Sync offline data error:", error);
  }
}

// ===== FUNCTION TRACKING ANALYTICS (TÙY CHỌN) =====
function trackRSVPSubmission(data) {
  // Google Analytics 4 (nếu có)
  if (typeof gtag !== "undefined") {
    gtag("event", "rsvp_submit", {
      custom_parameter_1: "wedding_rsvp",
      value: 1,
    });
  }

  // Facebook Pixel (nếu có)
  if (typeof fbq !== "undefined") {
    fbq("track", "SubmitApplication");
  }
}

// ===== FUNCTION EXPORT DỮ LIỆU =====
function exportRSVPData() {
  try {
    const data = JSON.parse(localStorage.getItem("wedding-rsvps") || "[]");
    const csvContent = convertToCSV(data);
    downloadCSV(csvContent, "wedding-rsvp-data.csv");
  } catch (error) {
    console.error("Export error:", error);
    showToast("Lỗi khi xuất dữ liệu!", "error");
  }
}

function convertToCSV(data) {
  const headers = [
    "Thời gian",
    "Họ tên",
    "Số điện thoại",
    "Số người",
    "Lời chúc",
    "Đã đồng bộ",
  ];
  const rows = data.map((item) => [
    new Date(item.timestamp).toLocaleString("vi-VN"),
    item.name,
    item.phone,
    item.count,
    item.message || "",
    item.synced ? "Có" : "Chưa",
  ]);

  const csvContent = [headers, ...rows]
    .map((row) => row.map((field) => `"${field}"`).join(","))
    .join("\n");

  return csvContent;
}

function downloadCSV(content, filename) {
  const blob = new Blob(["\uFEFF" + content], {
    type: "text/csv;charset=utf-8;",
  });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// ===== CLEANUP ON PAGE UNLOAD =====
window.addEventListener("beforeunload", () => {
  if (countdownInterval) {
    clearInterval(countdownInterval);
  }
  if (heartsInterval) {
    clearInterval(heartsInterval);
  }
});

// ===== EXPORT FOR DEBUGGING =====
window.WeddingApp = {
  CONFIG,
  getRSVPData,
  clearRSVPData,
  showToast,
};

// ===== AUTO SYNC KHI CÓ INTERNET =====
window.addEventListener("online", () => {
  console.log("Connection restored, syncing offline data...");
  setTimeout(syncOfflineData, 2000);
});

// ===== DEBUG FUNCTIONS =====
window.WeddingRSVP = {
  exportData: exportRSVPData,
  syncOffline: syncOfflineData,
  clearData: () => {
    localStorage.removeItem("wedding-rsvps");
    showToast("Đã xóa dữ liệu local!", "success");
  },
  viewData: () => {
    console.table(JSON.parse(localStorage.getItem("wedding-rsvps") || "[]"));
  },
};

// ===== DISABLE RIGHT-CLICK =====
document.addEventListener("contextmenu", (e) => {
  e.preventDefault();
});

// ===== ALBUM MODAL FUNCTIONALITY =====
document.addEventListener("DOMContentLoaded", function () {
  const albumItems = document.querySelectorAll(".album-item img");
  const modal = document.getElementById("albumModal");
  const modalImg = document.getElementById("modalImage");
  const modalCaption = document.getElementById("modalCaption");
  const closeBtn = document.querySelector(".album-modal .close");
  const prevBtn = document.querySelector(".album-modal .prev");
  const nextBtn = document.querySelector(".album-modal .next");

  let currentIndex = 0;

  // Hàm hiển thị ảnh trong modal
  function showImage(index) {
    if (index < 0) index = albumItems.length - 1;
    if (index >= albumItems.length) index = 0;
    currentIndex = index;
    modalImg.src = albumItems[currentIndex].src;
    modalCaption.innerText = albumItems[currentIndex].alt;
  }

  // Click ảnh trong album
  albumItems.forEach((img, i) => {
    img.addEventListener("click", () => {
      modal.style.display = "block";
      showImage(i);
    });
  });

  // Đóng modal
  closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });

  // Next/Prev
  nextBtn.addEventListener("click", () => {
    showImage(currentIndex + 1);
  });

  prevBtn.addEventListener("click", () => {
    showImage(currentIndex - 1);
  });

  // Đóng khi click ra ngoài
  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });

  // Dùng phím mũi tên trái/phải
  document.addEventListener("keydown", (e) => {
    if (modal.style.display === "block") {
      if (e.key === "ArrowRight") showImage(currentIndex + 1);
      if (e.key === "ArrowLeft") showImage(currentIndex - 1);
      if (e.key === "Escape") modal.style.display = "none";
    }
  });
});
