// ===== CONFIGURATION - CHỈNH SỬA THÔNG TIN TẠI ĐÂY =====
const CONFIG = {
  // URL Google Maps (thay đổi theo địa chỉ thật)
  mapUrl:
    "https://maps.google.com/maps?q=Nguyen+Van+Qua,+District+12,+Ho+Chi+Minh+City",

  // URL nhạc nền (thay bằng link nhạc của bạn)
  musicUrl: "./assets/music/Kho Báu.mp3",

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
  initMusicControl();
  initRSVPForm();
});

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
    slides.forEach((slide) => slide.classList.remove("active"));
    dots.forEach((dot) => dot.classList.remove("active"));

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

// ===== MUSIC CONTROL =====
// Music Control with Auto-play
let isPlaying = false;
let music;

function initMusicControl() {
  // Create audio element
  music = document.createElement("audio");
  music.loop = true;
  music.volume = 0.3;
  // Replace with your music URL
  music.src = CONFIG.musicUrl;
  document.body.appendChild(music);

  const musicControl = document.getElementById("musicControl");
  const musicIcon = document.getElementById("musicIcon");

  // Try auto-play
  forceAutoPlay(musicIcon);

  // Toggle music on click
  musicControl.addEventListener("click", () => {
    if (isPlaying) {
      music.pause();
      musicIcon.textContent = "🎵";
      isPlaying = false;
      showToast("Đã tắt nhạc nền");
    } else {
      music
        .play()
        .then(() => {
          musicIcon.textContent = "⏸️";
          isPlaying = true;
          showToast("Đang phát nhạc nền");
        })
        .catch((e) => {
          console.error("Cannot play music:", e);
          showToast("Không thể phát nhạc nền");
        });
    }
  });

  // Keyboard support
  musicControl.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      musicControl.click();
    }
  });
}

function forceAutoPlay(musicIcon) {
  // Method 1: Try direct play immediately
  const playPromise = music.play();

  if (playPromise !== undefined) {
    playPromise
      .then(() => {
        // Auto-play successful
        isPlaying = true;
        musicIcon.textContent = "⏸️";
      })
      .catch((error) => {
        // Method 2: Play on FIRST interaction of ANY type
        const playOnInteraction = () => {
          music
            .play()
            .then(() => {
              isPlaying = true;
              musicIcon.textContent = "⏸️";
            })
            .catch((e) => console.error("Play error:", e));
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

// ===== RSVP FORM =====
function initRSVPForm() {
  const rsvpForm = document.getElementById("rsvpForm");
  if (!rsvpForm) {
    console.warn("RSVP form not found");
    return;
  }

  rsvpForm.addEventListener("submit", handleRSVPSubmit);
}

// Toast Notification
function showToast(message) {
  const toast = document.getElementById("toast");
  const toastMessage = document.getElementById("toastMessage");
  toastMessage.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 3500);
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
    name: formData.get("name")?.trim(),
    attend: formData.get("attend")?.trim(),
    quantity: formData.get("quantity"),
    message: formData.get("message")?.trim(),
    invitedBy: formData.get("invitedBy")?.trim(),
    timestamp: new Date().toISOString(),
    ip: await getUserIP(),
  };
  // Validate required fields
  if (!rsvpData.name) {
    showToast("Vui lòng điền đầy đủ thông tin họ tên!", "error");
    resetSubmitButton(submitBtn, originalBtnText);
    return;
  }

  // Validate phone number
  // const phoneRegex = /^[0-9]{10,11}$/;
  // if (!phoneRegex.test(rsvpData.phone)) {
  //   showToast("Số điện thoại không hợp lệ!", "error");
  //   resetSubmitButton(submitBtn, originalBtnText);
  //   return;
  // }

  try {
    // Gửi đến Google Sheets
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
        attend: data.attend,
        quantity: data.quantity,
        message: data.message,
        invitedBy: data.invitedBy,
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
