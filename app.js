/**
 * DÉDÉ KARINE ORNELLA BENISSANH - ONLINE CV & PORTFOLIO
 * High-performance Vanilla JavaScript Application Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  // --------------------------------------------------------------------------
  // 1. Theme Management (Dark Luxe / Light Mode)
  // --------------------------------------------------------------------------
  const themeToggleBtn = document.getElementById('theme-toggle');
  const htmlElement = document.documentElement;
  
  // Check persisted theme or system preference
  const savedTheme = localStorage.getItem('karine_cv_theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (savedTheme) {
    htmlElement.setAttribute('data-theme', savedTheme);
  } else if (!systemPrefersDark) {
    // Default is dark, but if user explicitly prefers light, we can respect it
    htmlElement.setAttribute('data-theme', 'dark'); // Luxe dark default
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = htmlElement.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      htmlElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('karine_cv_theme', newTheme);
      
      const metaThemeColor = document.querySelector('meta[name="theme-color"]');
      if (metaThemeColor) {
        metaThemeColor.setAttribute('content', newTheme === 'dark' ? '#0c060a' : '#faf5ef');
      }
      
      showToast(newTheme === 'dark' ? 'Mode Bordeaux & Or activé' : 'Mode Champagne & Amande activé');
    });
  }

  // --------------------------------------------------------------------------
  // 2. Scroll Progress & Sticky Header
  // --------------------------------------------------------------------------
  const scrollProgressBar = document.getElementById('scroll-progress');
  const siteHeader = document.getElementById('site-header');
  const backToTopBtn = document.getElementById('btn-back-to-top');

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    
    // Progress bar width
    if (scrollProgressBar && scrollHeight > 0) {
      const scrollPercent = (scrollTop / scrollHeight) * 100;
      scrollProgressBar.style.width = `${scrollPercent}%`;
    }

    // Header styling
    if (siteHeader) {
      if (scrollTop > 40) {
        siteHeader.classList.add('scrolled');
      } else {
        siteHeader.classList.remove('scrolled');
      }
    }

    // Back to top button
    if (backToTopBtn) {
      if (scrollTop > 450) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }

    // Active Section Spy
    highlightActiveSection();
  }, { passive: true });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // --------------------------------------------------------------------------
  // 3. Navigation Active Link Spy
  // --------------------------------------------------------------------------
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function highlightActiveSection() {
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  // --------------------------------------------------------------------------
  // 4. Mobile Navigation Drawer
  // --------------------------------------------------------------------------
  const menuToggleBtn = document.getElementById('menu-toggle');
  const mobileNavDrawer = document.getElementById('mobile-nav');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  if (menuToggleBtn && mobileNavDrawer) {
    menuToggleBtn.addEventListener('click', () => {
      const isExpanded = menuToggleBtn.getAttribute('aria-expanded') === 'true';
      menuToggleBtn.setAttribute('aria-expanded', !isExpanded);
      mobileNavDrawer.classList.toggle('open');
      mobileNavDrawer.setAttribute('aria-hidden', isExpanded);
    });

    mobileNavLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileNavDrawer.classList.remove('open');
        mobileNavDrawer.setAttribute('aria-hidden', 'true');
        menuToggleBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // --------------------------------------------------------------------------
  // 5. Experience Category Filter
  // --------------------------------------------------------------------------
  const filterBtns = document.querySelectorAll('.filter-btn');
  const timelineItems = document.querySelectorAll('.timeline-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active button state
      filterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const filterValue = btn.getAttribute('data-filter');

      timelineItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        
        if (filterValue === 'all' || itemCategory === filterValue) {
          item.classList.remove('hidden');
          item.style.opacity = '0';
          item.style.transform = 'translateY(12px)';
          setTimeout(() => {
            item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
          }, 40);
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });

  // --------------------------------------------------------------------------
  // 6. Print & PDF Actions
  // --------------------------------------------------------------------------
  const printCvBtn = document.getElementById('btn-print-cv');
  const heroDownloadCvBtn = document.getElementById('hero-download-cv');

  function triggerPrint() {
    showToast('Génération du document en cours...');
    setTimeout(() => {
      window.print();
    }, 250);
  }

  if (printCvBtn) printCvBtn.addEventListener('click', triggerPrint);
  if (heroDownloadCvBtn) heroDownloadCvBtn.addEventListener('click', triggerPrint);

  // --------------------------------------------------------------------------
  // 7. Copy to Clipboard Functionality
  // --------------------------------------------------------------------------
  const copyBtns = document.querySelectorAll('.btn-copy-action');

  copyBtns.forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      const textToCopy = btn.getAttribute('data-copy');
      if (!textToCopy) return;

      try {
        await navigator.clipboard.writeText(textToCopy);
        showToast(`Copié : ${textToCopy}`);
      } catch (err) {
        // Fallback
        const textarea = document.createElement('textarea');
        textarea.value = textToCopy;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showToast(`Copié : ${textToCopy}`);
      }
    });
  });

  // --------------------------------------------------------------------------
  // 8. Animated Counters for Stats
  // --------------------------------------------------------------------------
  const statNumbers = document.querySelectorAll('.stat-number');
  let animated = false;

  const countUpObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        statNumbers.forEach(stat => {
          const target = parseInt(stat.getAttribute('data-target'), 10);
          const suffix = stat.getAttribute('data-suffix') || '';
          const prefix = target === 25 ? '+' : '';
          
          if (isNaN(target)) return;

          let start = 0;
          const duration = 1600;
          const stepTime = Math.max(Math.floor(duration / target), 30);
          
          const timer = setInterval(() => {
            start += Math.ceil(target / (duration / stepTime));
            if (start >= target) {
              stat.textContent = `${prefix}${target}${suffix}`;
              clearInterval(timer);
            } else {
              stat.textContent = `${prefix}${start}${suffix}`;
            }
          }, stepTime);
        });
        observer.disconnect();
      }
    });
  }, { threshold: 0.3 });

  const statsSection = document.querySelector('.hero-stats-container');
  if (statsSection) {
    countUpObserver.observe(statsSection);
  }

  // --------------------------------------------------------------------------
  // 9. Interactive Contact Form Handler
  // --------------------------------------------------------------------------
  const contactForm = document.getElementById('contact-form');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('sender-name').value.trim();
      const email = document.getElementById('sender-email').value.trim();
      const subject = document.getElementById('sender-subject').value;
      const message = document.getElementById('sender-message').value.trim();

      if (!name || !email || !subject || !message) {
        showToast('Veuillez renseigner tous les champs obligatoires.');
        return;
      }

      // Compose mailto body
      const emailSubject = encodeURIComponent(`[Contact Portfolio] ${subject} - de ${name}`);
      const emailBody = encodeURIComponent(
        `Bonjour Karine,\n\n` +
        `Nom / Entreprise : ${name}\n` +
        `Email de contact : ${email}\n` +
        `Objet : ${subject}\n\n` +
        `Message :\n${message}\n\n` +
        `---\nEnvoyé depuis le CV en ligne de Karine Benissanh`
      );

      const mailtoUrl = `mailto:karineornella@gmail.com?subject=${emailSubject}&body=${emailBody}`;

      // Show user feedback
      showToast('Ouverture de votre messagerie pour confirmation...');
      
      // Open client email
      window.location.href = mailtoUrl;

      // Reset form
      contactForm.reset();
    });
  }

  // --------------------------------------------------------------------------
  // 10. Dynamic Current Year
  // --------------------------------------------------------------------------
  const yearElement = document.getElementById('current-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // --------------------------------------------------------------------------
  // 11. Toast Notification Helper
  // --------------------------------------------------------------------------
  let toastTimeout;
  function showToast(message) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');

    if (!toast || !toastMessage) return;

    toastMessage.textContent = message;
    toast.classList.add('show');

    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  }
});
