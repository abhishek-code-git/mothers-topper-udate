/**
 * Mother's Topper India — Core Interactive Scripts
 * Modern EdTech Platform & Franchise Portal
 */

(() => {
  'use strict';

  // --- 1. Sticky & Collapsing Header Navigation ---
  const header = document.querySelector('[data-header]');
  const handleScroll = () => {
    if (header) {
      if (window.scrollY > 20) {
        header.classList.add('is-scrolled');
      } else {
        header.classList.remove('is-scrolled');
      }
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // --- 2. Mobile Navigation Drawer ---
  const menuToggle = document.querySelector('[data-menu-toggle]');
  const mainNav = document.querySelector('[data-nav]');

  if (menuToggle && mainNav) {
    const toggleMenu = (shouldOpen) => {
      const isOpen = shouldOpen !== undefined ? shouldOpen : !mainNav.classList.contains('is-open');
      mainNav.classList.toggle('is-open', isOpen);
      document.body.classList.toggle('menu-open', isOpen);
      menuToggle.setAttribute('aria-expanded', String(isOpen));
      menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
    };

    menuToggle.addEventListener('click', () => toggleMenu());

    mainNav.addEventListener('click', (e) => {
      if (e.target.tagName === 'A') {
        toggleMenu(false);
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mainNav.classList.contains('is-open')) {
        toggleMenu(false);
      }
    });
  }

  // --- 3. Scroll Reveal Animation ---
  const revealElements = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );

    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    revealElements.forEach((el) => el.classList.add('is-visible'));
  }

  // --- 4. Active Nav Highlighting ---
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.main-nav a');
  navLinks.forEach((link) => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // --- 5. Program Tabs Selector ---
  const tabContainers = document.querySelectorAll('[data-tabs]');
  tabContainers.forEach((container) => {
    const tabBtns = container.querySelectorAll('[data-tab-target]');
    const tabPanels = container.querySelectorAll('[data-tab-panel]');

    tabBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-tab-target');

        tabBtns.forEach((b) => b.classList.remove('active'));
        tabPanels.forEach((p) => p.classList.remove('active'));

        btn.classList.add('active');
        const targetPanel = container.querySelector(`[data-tab-panel="${targetId}"]`);
        if (targetPanel) {
          targetPanel.classList.add('active');
        }
      });
    });
  });

  // --- 6. FAQ Accordion ---
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach((item) => {
    const btn = item.querySelector('.faq-question');
    const ans = item.querySelector('.faq-answer');
    if (!btn || !ans) return;

    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');

      // Close all siblings
      faqItems.forEach((other) => {
        if (other !== item) {
          other.classList.remove('is-open');
          const otherAns = other.querySelector('.faq-answer');
          if (otherAns) otherAns.style.maxHeight = null;
        }
      });

      if (!isOpen) {
        item.classList.add('is-open');
        ans.style.maxHeight = ans.scrollHeight + 'px';
      } else {
        item.classList.remove('is-open');
        ans.style.maxHeight = null;
      }
    });
  });

  // Open first FAQ by default if exists
  if (faqItems.length > 0) {
    const firstItem = faqItems[0];
    const firstAns = firstItem.querySelector('.faq-answer');
    if (firstAns) {
      firstItem.classList.add('is-open');
      firstAns.style.maxHeight = firstAns.scrollHeight + 'px';
    }
  }

  // --- 7. Franchise Calculator ---
  const formatINR = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(Math.max(0, Number(val) || 0));
  };

  const calculators = document.querySelectorAll('[data-calculator]');
  calculators.forEach((calc) => {
    const studentsInput = calc.querySelector('[name="students"]');
    const feeInput = calc.querySelector('[name="fee"]');
    const costsInput = calc.querySelector('[name="costs"]');

    const revOutput = calc.querySelector('[data-revenue]');
    const costsOutput = calc.querySelector('[data-costs]');
    const marginOutput = calc.querySelector('[data-margin]');

    const compute = () => {
      if (!studentsInput || !feeInput || !costsInput) return;
      const students = Number(studentsInput.value) || 0;
      const fee = Number(feeInput.value) || 0;
      const costs = Number(costsInput.value) || 0;

      const revenue = students * fee;
      const margin = revenue - costs;

      if (revOutput) revOutput.textContent = formatINR(revenue);
      if (costsOutput) costsOutput.textContent = formatINR(costs);
      if (marginOutput) {
        const prefix = margin < 0 ? '-' : '';
        marginOutput.textContent = prefix + formatINR(Math.abs(margin));
        marginOutput.style.color = margin < 0 ? '#EF4444' : '#0E56C4';
      }
    };

    calc.addEventListener('input', compute);
    compute();
  });

  // --- 8. AI Tutor Live Simulation Demo ---
  const chatContainers = document.querySelectorAll('[data-ai-chat]');
  chatContainers.forEach((chat) => {
    const input = chat.querySelector('[data-chat-input]');
    const sendBtn = chat.querySelector('[data-chat-send]');
    const historyBox = chat.querySelector('[data-chat-messages]');

    if (input && sendBtn && historyBox) {
      const sendMsg = () => {
        const text = input.value.trim();
        if (!text) return;

        // Append student message
        const studentBubble = document.createElement('div');
        studentBubble.className = 'chat-msg student-msg';
        studentBubble.textContent = text;
        historyBox.appendChild(studentBubble);
        input.value = '';
        historyBox.scrollTop = historyBox.scrollHeight;

        // Simulate intelligent AI step-by-step guidance
        setTimeout(() => {
          const aiBubble = document.createElement('div');
          aiBubble.className = 'chat-msg ai-msg';
          aiBubble.textContent = `Analyzing "${text}"... Let's break this concept into 2 core foundational steps: 1) Review the fundamental rule, and 2) Try an adaptive practice problem. Would you like a step-by-step example?`;
          historyBox.appendChild(aiBubble);
          historyBox.scrollTop = historyBox.scrollHeight;
        }, 550);
      };

      sendBtn.addEventListener('click', sendMsg);
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') sendMsg();
      });
    }
  });

  // --- 9. Multi-Step Form Wizards (Student & Franchise) ---
  const wizards = document.querySelectorAll('[data-wizard]');
  wizards.forEach((wizard) => {
    const steps = wizard.querySelectorAll('[data-wizard-step]');
    const nodes = wizard.querySelectorAll('[data-wizard-node]');
    const progressBar = wizard.querySelector('[data-wizard-progress]');
    const nextBtns = wizard.querySelectorAll('[data-wizard-next]');
    const prevBtns = wizard.querySelectorAll('[data-wizard-prev]');
    const successBox = wizard.querySelector('[data-wizard-success]');
    let currentStepIndex = 0;

    const validateCurrentStep = () => {
      const currentStep = steps[currentStepIndex];
      if (!currentStep) return true;

      const requiredInputs = currentStep.querySelectorAll('input[required], select[required], textarea[required]');
      let isValid = true;

      requiredInputs.forEach((input) => {
        // Remove existing inline error
        const existingError = input.parentElement.querySelector('.field-error');
        if (existingError) existingError.remove();

        if (!input.value.trim()) {
          isValid = false;
          input.classList.add('error');
          const errorMsg = document.createElement('span');
          errorMsg.className = 'field-error';
          errorMsg.textContent = 'This field is required.';
          input.parentElement.appendChild(errorMsg);
        } else if (input.name === 'phone') {
          const digits = input.value.replace(/\D/g, '');
          const isPhone = /^[6-9]\d{9}$/.test(digits);
          if (!isPhone) {
            isValid = false;
            input.classList.add('error');
            const errorMsg = document.createElement('span');
            errorMsg.className = 'field-error';
            errorMsg.textContent = 'Please enter a valid 10-digit Indian mobile number.';
            input.parentElement.appendChild(errorMsg);
          }
        } else if (input.type === 'email' && input.value.trim()) {
          const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim());
          if (!isEmail) {
            isValid = false;
            input.classList.add('error');
            const errorMsg = document.createElement('span');
            errorMsg.className = 'field-error';
            errorMsg.textContent = 'Please enter a valid email address.';
            input.parentElement.appendChild(errorMsg);
          }
        } else {
          input.classList.remove('error');
        }
      });

      return isValid;
    };

    const updateStep = (newIndex) => {
      steps.forEach((s, idx) => {
        s.classList.toggle('active', idx === newIndex);
      });

      nodes.forEach((n, idx) => {
        n.classList.toggle('active', idx === newIndex);
        n.classList.toggle('completed', idx < newIndex);
      });

      if (progressBar && steps.length > 1) {
        const pct = (newIndex / (steps.length - 1)) * 100;
        progressBar.style.width = pct + '%';
      }

      currentStepIndex = newIndex;
    };

    nextBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        if (validateCurrentStep()) {
          if (currentStepIndex < steps.length - 1) {
            updateStep(currentStepIndex + 1);
          }
        }
      });
    });

    prevBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        if (currentStepIndex > 0) {
          updateStep(currentStepIndex - 1);
        }
      });
    });

    // Form submit listener
    wizard.addEventListener('submit', (e) => {
      if (!validateCurrentStep()) {
        e.preventDefault();
        return;
      }

      // If submit via AJAX or local success simulation:
      // Allow default POST to submit.php or show instant confirmation
    });
  });

  // --- 10. Direct Phone Number Validator on all standalone forms ---
  document.querySelectorAll('form:not([data-wizard])').forEach((form) => {
    const phone = form.querySelector('input[name="phone"]');
    if (!phone) return;

    phone.addEventListener('input', () => {
      const digits = phone.value.replace(/\D/g, '');
      const isIndian = /^[6-9]\d{9}$/.test(digits);
      const existingError = phone.parentElement.querySelector('.field-error');

      if (phone.value.length > 0 && !isIndian) {
        if (!existingError) {
          const err = document.createElement('span');
          err.className = 'field-error';
          err.textContent = 'Please enter a valid 10-digit Indian mobile number.';
          phone.parentElement.appendChild(err);
        }
      } else if (existingError) {
        existingError.remove();
      }
    });
  });

})();
