// JavaScript for Toggle Button
document.addEventListener('DOMContentLoaded', function () {
  const toggleBtn = document.querySelector('.toggle-btn');
  const menu = document.querySelector('.menu');

  toggleBtn.addEventListener('click', function () {
    menu.classList.toggle('active');
  });
});

// JavaScript for Navbar Scroll Effect
document.addEventListener('DOMContentLoaded', function () {
  const nav = document.querySelector('.nav');

  window.addEventListener('scroll', function () {
    if (window.scrollY > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  });
});

// JavaScript for Review Form
document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('review-form');
  const starRating = document.querySelectorAll('.star-rating i');
  const ratingInput = document.getElementById('rating');

  // Star Rating Logic
  starRating.forEach((star) => {
    star.addEventListener('click', function () {
      const rating = this.getAttribute('data-rating');
      ratingInput.value = rating;

      starRating.forEach((s) => s.classList.remove('active'));
      this.classList.add('active');
      for (let i = 0; i < rating; i++) {
        starRating[i].classList.add('active');
      }
    });
  });

  // Form Submission Logic
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const rating = ratingInput.value;
    const comment = document.getElementById('comment').value;

    if (!name || !rating || !comment) {
      alert('Please fill all fields.');
      return;
    }

    // Create New Review Card
    const reviewCard = document.createElement('div');
    reviewCard.classList.add('review-card');

    reviewCard.innerHTML = `
      <div class="review-header">
        <div class="review-info">
          <h3>${name}</h3>
          <div class="stars">
            ${'<i class="fas fa-star"></i>'.repeat(rating)}
          </div>
        </div>
      </div>
      <p>${comment}</p>
    `;

    // Append New Review to Reviews Section
    document.querySelector('.review-cards').appendChild(reviewCard);

    // Reset Form
    form.reset();
    starRating.forEach((s) => s.classList.remove('active'));
    ratingInput.value = '';
  });

    // زر الصعود إلى الأعلى
    const scrollToTopBtn = document.getElementById("scrollToTopBtn");

    if (scrollToTopBtn) {
        window.onscroll = function() {
            if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
                scrollToTopBtn.style.display = "block";
            } else {
                scrollToTopBtn.style.display = "none";
            }
        };

        scrollToTopBtn.onclick = function() {
            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;
        };
    }

    document.addEventListener("DOMContentLoaded", function () {
      const toggleBtn = document.querySelector(".toggle-btn");
      const menu = document.querySelector(".menu");
      const dropdowns = document.querySelectorAll(".dropdown");
  
      if (toggleBtn && menu) {
          toggleBtn.addEventListener("click", function () {
              menu.classList.toggle("active");
          });
      }
  
      // تفعيل القائمة المنسدلة على الشاشات الصغيرة
      dropdowns.forEach(dropdown => {
          dropdown.addEventListener("click", function () {
              this.classList.toggle("active");
          });
      });
  });

  
});

// تفعيل ScrollReveal
ScrollReveal().reveal('.about-us', {
  delay: 200,
  origin: 'top',
  distance: '50px',
  duration: 1000,
});

ScrollReveal().reveal('.feature-card', {
  delay: 300,
  origin: 'bottom',
  distance: '50px',
  duration: 1000,
  interval: 200,
});

ScrollReveal().reveal('.review-card', {
  delay: 300,
  origin: 'left',
  distance: '50px',
  duration: 1000,
  interval: 200,
});

ScrollReveal().reveal('.add-review', {
  delay: 300,
  origin: 'right',
  distance: '50px',
  duration: 1000,
});

ScrollReveal().reveal('.footer', {
  delay: 300,
  origin: 'bottom',
  distance: '50px',
  duration: 1000,
});


document.addEventListener("DOMContentLoaded", function () {
  gsap.registerPlugin(ScrollTrigger);

  gsap.utils.toArray(".animate").forEach((section) => {
    gsap.from(section, {
      opacity: 0,
      y: 50,
      duration: 1,
      ease: "power2.out",
      scrollTrigger: {
        trigger: section,
        start: "top 80%", 
        toggleActions: "play none none none",
      },
    });
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const scrollToTopBtn = document.getElementById("scrollToTopBtn");

  window.addEventListener("scroll", function () {
    if (window.scrollY > 300) {
      scrollToTopBtn.classList.add("show");
      scrollToTopBtn.classList.remove("hide");
    } else {
      scrollToTopBtn.classList.add("hide");
      scrollToTopBtn.classList.remove("show");
    }
  });

  scrollToTopBtn.addEventListener("click", function () {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
});