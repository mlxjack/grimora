document.addEventListener('DOMContentLoaded', () => {
  // 1. Custom Cursor
  const cursor = document.querySelector('.custom-cursor');
  const follower = document.querySelector('.custom-cursor-follower');
  
  if (cursor && follower) {
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    let followerX = 0, followerY = 0;
    
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });
    
    // Fluid movement loop
    function animateCursor() {
      // Cursor moves fast
      cursorX += (mouseX - cursorX) * 0.2;
      cursorY += (mouseY - cursorY) * 0.2;
      cursor.style.left = `${cursorX}px`;
      cursor.style.top = `${cursorY}px`;
      
      // Follower has lag
      followerX += (mouseX - followerX) * 0.1;
      followerY += (mouseY - followerY) * 0.1;
      follower.style.left = `${followerX}px`;
      follower.style.top = `${followerY}px`;
      
      requestAnimationFrame(animateCursor);
    }
    animateCursor();
    
    // Add hover states on interactive elements
    const links = document.querySelectorAll('a, button, input, select, textarea, .logo-item, .card-glass');
    links.forEach(link => {
      link.addEventListener('mouseenter', () => {
        document.body.classList.add('hover-link');
      });
      link.addEventListener('mouseleave', () => {
        document.body.classList.remove('hover-link');
      });
    });
  }

  // 2. Header Scroll Effect
  const header = document.querySelector('.header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  // 3. Mobile Navigation Menu Toggle
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.querySelector('.nav-menu');
  
  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('active');
      menu.classList.toggle('active');
    });
    
    // Close menu when clicking navigation link
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        toggle.classList.remove('active');
        menu.classList.remove('active');
      });
    });
  }

  // 4. Reveal Animations on Scroll
  const revealElements = document.querySelectorAll('.reveal');
  
  if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-visible');
          // Once animated, we don't need to keep checking
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -50px 0px'
    });
    
    revealElements.forEach(element => {
      revealObserver.observe(element);
    });
  }

  // 5. Active Link Indicator
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.nav-link');
  
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    // Simple check to match path names
    if (href === currentPath || (currentPath.endsWith('/') && href.includes('index.html')) || currentPath.includes(href)) {
      link.classList.add('active');
    }
  });

  // 6. Interactive Element: Metricas Live Counter
  const stats = document.querySelectorAll('.stat-number');
  if (stats.length > 0) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = entry.target;
          const endValue = parseFloat(target.getAttribute('data-value'));
          const isDecimal = target.getAttribute('data-value').includes('.');
          const duration = 2000; // 2 seconds
          const startTime = performance.now();
          const prefix = target.getAttribute('data-prefix') || '';
          const suffix = target.getAttribute('data-suffix') || '';
          
          function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Ease out cubic
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            const currentValue = easeProgress * endValue;
            
            if (isDecimal) {
              target.textContent = `${prefix}${currentValue.toFixed(1)}${suffix}`;
            } else {
              target.textContent = `${prefix}${Math.floor(currentValue)}${suffix}`;
            }
            
            if (progress < 1) {
              requestAnimationFrame(updateCounter);
            } else {
              target.textContent = `${prefix}${endValue}${suffix}`;
            }
          }
          
          requestAnimationFrame(updateCounter);
          statsObserver.unobserve(target);
        }
      });
    }, { threshold: 0.5 });
    
    stats.forEach(stat => statsObserver.observe(stat));
  }
});
