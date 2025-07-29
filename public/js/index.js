// Navbar Scroll Behavior
window.addEventListener('scroll', () => {
  const navbar = document.getElementById('mainNavbar');
  if (window.scrollY > 50) { // Lowered threshold for quicker transition
    navbar.classList.add('navbar-solid');
    navbar.classList.remove('navbar-transparent');
  } else {
    navbar.classList.add('navbar-transparent');
    navbar.classList.remove('navbar-solid');
  }
});

// Swiper Initialization
const swiper = new Swiper('.mySwiper', {
  slidesPerView: 3,
  spaceBetween: 25,
  loop: true,
  grabCursor: true,
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
    dynamicBullets: true,
  },
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
  breakpoints: {
    0: { slidesPerView: 1 },
    768: { slidesPerView: 2 },
    1024: { slidesPerView: 3 },
  },
});

// AOS Initialization
AOS.init({
  duration: 800,
  easing: 'ease-in-out',
  once: true,
});

// MixItUp Initialization for Portfolio Filtering
document.addEventListener('DOMContentLoaded', () => {
  const mixer = mixitup('#portfolio-container', {
    selectors: {
      target: '.portfolio-item',
    },
    animation: {
      duration: 300,
      effects: 'fade translateZ(-100px)',
    },
  });
});

// Service Card Navigation
document.addEventListener('DOMContentLoaded', () => {
  const serviceCardLinks = {
    'celebrity_event': 'celebrity_events.html',
    'music_video': 'music_video_videography.html',
    'videography': 'music_video_videography.html',
    'marketing': 'marketing_and_product_prmotion.html',
    'product_promotion': 'marketing_and_product_prmotion.html',
    'advertisement': 'marketing_and_product_prmotion.html',
  };

  Object.keys(serviceCardLinks).forEach(id => {
    const element = document.getElementById(id);
    if (element) {
      element.setAttribute('role', 'button');
      element.setAttribute('tabindex', '0');
      element.addEventListener('click', () => {
        window.location.href = serviceCardLinks[id];
      });
      // Add keyboard support
      element.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          window.location.href = serviceCardLinks[id];
        }
      });
    }
  });
});

// Contact Form Validation and Submission
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.classList.add('was-validated');
        return;
      }

      const submitButton = form.querySelector('button[type="submit"]');
      const feedback = form.querySelector('.form-feedback');
      submitButton.disabled = true;
      submitButton.classList.add('submit-button-loading');
      feedback.classList.remove('d-none', 'success', 'error');

      // Simulate form submission (replace with actual API call)
      setTimeout(() => {
        feedback.classList.add('success');
        feedback.textContent = 'Message sent successfully!';
        form.reset();
        form.classList.remove('was-validated');
        submitButton.disabled = false;
        submitButton.classList.remove('submit-button-loading');
        setTimeout(() => feedback.classList.add('d-none'), 3000);
      }, 1000);
    });
  }
});

// Image Modal
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.clickable-img').forEach(img => {
    img.addEventListener('click', () => {
      const modalImg = document.getElementById('modalImg');
      modalImg.src = img.src;
      const modal = new bootstrap.Modal(document.getElementById('imgModal'));
      modal.show();
    });
  });
});


// Video Modal
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.btn-play').forEach(button => {
    button.addEventListener('click', () => {
      const videoSrc = button.getAttribute('data-video-src');
      const modalVideo = document.getElementById('modalVideo');
      modalVideo.querySelector('source').src = videoSrc;
      modalVideo.load();
      const modal = new bootstrap.Modal(document.getElementById('videoModal'));
      modal.show();
    });
  });
});




/**
 * Contact Form Handler
 * Handles form validation, submission, and user feedback for contact form
 */
class ContactFormHandler {
  constructor(formId) {
    this.form = document.getElementById(formId);
    this.submitButton = this.form?.querySelector("button[type='submit']");
    this.patterns = {
      email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      phone: /^[0-9]{10}$/,
      name: /^[a-zA-Z\s'-]{2,50}$/,
      subject: /^.{2,100}$/,
      message: /^.{10,500}$/,
    };
    this.errorMessages = {
      email: "Please enter a valid email address.",
      phone: "Please enter a valid 10-digit phone number.",
      name: "Name must be 2-50 characters and contain only letters, spaces, hyphens, or apostrophes.",
      subject: "Subject must be 2-100 characters long.",
      message: "Message must be 10-500 characters long.",
      required: "This field is required.",
    };
  }

  /**
   * Initialize the form handler
   */
  init() {
    if (!this.form) {
      console.error("Form element not found");
      return;
    }

    this.form.addEventListener("submit", this.handleSubmit.bind(this));
    this.injectSpinnerStyles();
  }

  /**
   * Inject CSS styles for the loading spinner
   */
  injectSpinnerStyles() {
    const style = document.createElement("style");
    style.textContent = `
      .spinner {
        display: inline-block;
        width: 1.5em;
        height: 1.5em;
        border: 3px solid rgba(22, 236, 22, 0.88);
        border-radius: 50%;
        border-top-color: #24d708ff;
        animation: spin 1s ease-in-out infinite;
        margin-right: 0.5em;
        vertical-align: middle;
      }
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
      .submit-button-loading {
        opacity: 0.8;
        cursor: not-allowed;
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * Sanitize input to prevent XSS
   * @param {string} input - Input string to sanitize
   * @returns {string} Sanitized input
   */
  sanitizeInput(input) {
    const div = document.createElement("div");
    div.textContent = input;
    return div.innerHTML;
  }

  /**
   * Validate form data
   * @param {Object} formData - Form input data
   * @returns {Object} Validation result with errors
   */
  validateForm(formData) {
    const errors = {};

    for (const [key, value] of Object.entries(formData)) {
      if (!value) {
        errors[key] = this.errorMessages.required;
        continue;
      }

      if (this.patterns[key] && !this.patterns[key].test(value)) {
        errors[key] = this.errorMessages[key];
      }
    }

    return errors;
  }

  /**
   * Show user feedback
   * @param {string} message - Message to display
   * @param {boolean} isError - Whether the message is an error
   */
  showFeedback(message, isError = false) {
    const feedbackDiv = document.createElement("div");
    feedbackDiv.className = `form-feedback ${isError ? "error" : "success"}`;
    feedbackDiv.textContent = message;
    this.form.appendChild(feedbackDiv);

    setTimeout(() => feedbackDiv.remove(), 5000);
  }

  /**
   * Get CSRF token from meta tag
   * @returns {string|null} CSRF token
   */
  getCsrfToken() {
    const token = document.querySelector('meta[name="csrf-token"]')?.content;
    if (!token) {
      console.warn("CSRF token not found");
    }
    return token;
  }

  /**
   * Update submit button UI for submission state
   */
  setLoadingState() {
    this.submitButton.disabled = true;
    this.submitButton.classList.add("submit-button-loading");
    this.submitButton.innerHTML = '<span class="spinner" aria-hidden="true"></span> Sending...';
    this.submitButton.setAttribute("aria-busy", "true");
  }

  /**
   * Reset submit button UI after submission
   */
  resetLoadingState() {
    this.submitButton.disabled = false;
    this.submitButton.classList.remove("submit-button-loading");
    this.submitButton.textContent = "Send Message";
    this.submitButton.removeAttribute("aria-busy");
  }

  /**
   * Handle form submission
   * @param {Event} event - Form submit event
   */
  async handleSubmit(event) {
    event.preventDefault();

    // Collect and sanitize form data
    const formData = {
      name: this.sanitizeInput(this.form.name.value.trim()),
      email: this.sanitizeInput(this.form.email.value.trim()),
      phone: this.sanitizeInput(this.form.phone.value.trim()),
      subject: this.sanitizeInput(this.form.subject.value.trim()),
      message: this.sanitizeInput(this.form.message.value.trim()),
    };

    // Validate form
    const errors = this.validateForm(formData);
    if (Object.keys(errors).length > 0) {
      this.showFeedback(Object.values(errors)[0], true);
      return;
    }

    // Update UI for submission
    this.setLoadingState();

    try {
      const headers = {
        "Content-Type": "application/json",
        "X-CSRF-Token": this.getCsrfToken(),
      };

      const response = await fetch("/submit-form", {
        method: "POST",
        headers,
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        this.showFeedback(result.message || "Message sent successfully!");
        this.form.reset();
      } else {
        throw new Error(result.message || "Submission failed");
      }
    } catch (error) {
      console.error("Form submission error:", error);
      this.showFeedback("An error occurred. Please try again later.", true);
    } finally {
      this.resetLoadingState();
    }
  }
}

// Initialize form handler when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  const formHandler = new ContactFormHandler("contactForm");
  formHandler.init();
});





// $(function() {
//   // Image modal
//   $('.clickable-img').on('click', function() {
//     $('#modalImg').attr('src', this.src);
//     $('#imgModal').modal('show');
//   });

//   // Video modal - local mp4

//   $('.btn-play').on('click', function() {
//     const videoSrc = $(this).data('video-src');
//     const video = $('#modalVideo')[0];
//     $('#modalVideo source').attr('src', videoSrc);
//     video.load();
//     video.play();
//     $('#videoModal').modal('show');
//   });

//   $('#videoModal').on('hidden.bs.modal', function() {
//     const video = $('#modalVideo')[0];
//     video.pause();
//     video.currentTime = 0;
//     $('#modalVideo source').attr('src', '');
//     $('#modalVideo')[0].load();
//   });

//   // MixItUp filtering
//   let mixer = mixitup('#portfolio-container', {
//     selectors: { target: '.portfolio-item' },
//     animation: { duration: 400 }
//   });

//   $('#portfolio-filters button').on('click', function() {
//     $('#portfolio-filters button').removeClass('active');
//     $(this).addClass('active');
//   });
// });

