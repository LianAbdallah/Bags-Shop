// تأكد من وجود مكتبة jwt-decode في الصفحة أو أضفها في <script> في html
// <script src="https://cdn.jsdelivr.net/npm/jwt-decode@3.1.2/build/jwt-decode.min.js"></script>

const token = localStorage.getItem("token");

if (!token) {
  // لا يوجد توكن، يعيد التوجيه إلى صفحة تسجيل الدخول
  window.location.href = "../login/login.html";
} else {
  try {
    const decoded = jwt_decode(token);

    // تحقق من صلاحية التوكن (مثلاً وقت الانتهاء)
    const currentTime = Date.now() / 1000; // بالثواني
    if (decoded.exp < currentTime) {
      // التوكن منتهي الصلاحية
      localStorage.removeItem("token");
      alert("Session expired, please login again.");
      window.location.href = "../login/login.html";
    } else {
      // التوكن صالح، يمكن تحميل محتويات الصفحة أو بيانات المستخدم
      console.log("User is authenticated:", decoded);
      // تابع تنفيذ باقي الكود هنا
    }
  } catch (error) {
    console.error("Invalid token:", error);
    localStorage.removeItem("token");
    window.location.href = "../login/login.html";
  }
}

document.addEventListener('DOMContentLoaded', function () {
  const fadeElements = document.querySelectorAll('.fade-element');

  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.2,
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  fadeElements.forEach(element => {
    observer.observe(element);
  });
});

// تحقق من وجود زر العودة للأعلى قبل التعامل معه
const scrollTopBtn = document.getElementById("scrollTopBtn");

if (scrollTopBtn) {
  window.onscroll = function () {
    scrollTopBtn.style.display = window.pageYOffset > 100 ? "block" : "none";
  };

  scrollTopBtn.onclick = function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
}

function shopNow() {
  window.location.href = "products.html";
}
