document.addEventListener("DOMContentLoaded", () => {
  // Google Analytics Tracking Helper
  const trackGAEvent = (eventName, eventParams = {}) => {
    if (typeof gtag === 'function') {
      gtag('event', eventName, eventParams);
    }
  };


  // 2. القائمة الجانبية للجوال (Mobile Menu Overlay)
  const hamburgerBtn = document.getElementById("hamburgerBtn");
  const closeMenuBtn = document.getElementById("closeMenuBtn");
  const mobileMenu = document.getElementById("mobileMenu");
  const mobileLinks = document.querySelectorAll(".mobile-nav-links a");

  const toggleMenu = () => {
    if (mobileMenu) {
      mobileMenu.classList.toggle("open");
    }
  };

  if (hamburgerBtn) hamburgerBtn.addEventListener("click", toggleMenu);
  if (closeMenuBtn) closeMenuBtn.addEventListener("click", toggleMenu);

  // Home Page Discover Button Tracking
  const discoverBtn = document.getElementById("discoverBtn");
  if (discoverBtn) {
    discoverBtn.addEventListener("click", () => {
      trackGAEvent('discover_click', {
        'event_category': 'Engagement',
        'event_label': 'Discover Initiative Clicked'
      });
    });
  }

  // إغلاق القائمة عند الضغط على أي رابط
  mobileLinks.forEach(link => {
    link.addEventListener("click", () => {
      if (mobileMenu) mobileMenu.classList.remove("open");
    });
  });

  // 3. تأثير الزجاج على شريط التنقل عند النزول (Navbar Scroll Effect)
  const navbar = document.getElementById("navbar");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });

  // 4. تفعيل الرابط النشط بناءً على القسم المعروض سكرول
  const sections = document.querySelectorAll("section");
  const navLinksList = document.querySelectorAll(".nav-links a");
  const mobileNavLinksList = document.querySelectorAll(".mobile-nav-links a");

  window.addEventListener("scroll", () => {
    let current = "";
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
        current = section.getAttribute("id");
      }
    });

    navLinksList.forEach(a => {
      a.classList.remove("active");
      if (a.getAttribute("href").includes(current)) {
        a.classList.add("active");
      }
    });

    mobileNavLinksList.forEach(a => {
      a.classList.remove("active");
      if (a.getAttribute("href").includes(current)) {
        a.classList.add("active");
      }
    });
  });

  // 5. تأثيرات 3D في الخلفية (Three.js Hero Background)
  const canvas3D = document.getElementById("hero-3d-canvas");
  if (canvas3D && typeof THREE !== 'undefined') {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ canvas: canvas3D, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const objects = [];
    const greenMat = new THREE.MeshBasicMaterial({ color: 0x00BF63, wireframe: true, transparent: true, opacity: 0.15 });
    const redMat = new THREE.MeshBasicMaterial({ color: 0xEB4A36, wireframe: true, transparent: true, opacity: 0.1 });
    const whiteMat = new THREE.MeshBasicMaterial({ color: 0xF5F5F5, wireframe: true, transparent: true, opacity: 0.05 });

    // 1: Icosahedron
    const geo1 = new THREE.IcosahedronGeometry(1.5, 0);
    const mesh1 = new THREE.Mesh(geo1, greenMat);
    mesh1.position.set(-3, 1, -2);
    scene.add(mesh1);
    objects.push(mesh1);

    // 2: Torus Knot
    const geo2 = new THREE.TorusKnotGeometry(0.8, 0.2, 100, 16);
    const mesh2 = new THREE.Mesh(geo2, redMat);
    mesh2.position.set(3, -1, -3);
    scene.add(mesh2);
    objects.push(mesh2);

    // 3: Octahedron
    const geo3 = new THREE.OctahedronGeometry(1.2, 0);
    const mesh3 = new THREE.Mesh(geo3, whiteMat);
    mesh3.position.set(0, 2.5, -4);
    scene.add(mesh3);
    objects.push(mesh3);

    // 4: Tetrahedron
    const geo4 = new THREE.TetrahedronGeometry(1.8, 0);
    const mesh4 = new THREE.Mesh(geo4, greenMat);
    mesh4.position.set(-2, -2, -5);
    scene.add(mesh4);
    objects.push(mesh4);

    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = (e.clientX - window.innerWidth / 2);
      mouseY = (e.clientY - window.innerHeight / 2);
    });

    const animate = function () {
      requestAnimationFrame(animate);

      // Rotate objects
      mesh1.rotation.x += 0.002;
      mesh1.rotation.y += 0.003;
      mesh2.rotation.x -= 0.003;
      mesh2.rotation.y += 0.002;
      mesh3.rotation.x += 0.001;
      mesh3.rotation.y -= 0.002;
      mesh4.rotation.x -= 0.002;
      mesh4.rotation.y -= 0.001;

      const time = Date.now() * 0.001;
      mesh1.position.y = 1 + Math.sin(time) * 0.2;
      mesh2.position.y = -1 + Math.sin(time * 0.8) * 0.3;
      mesh3.position.y = 2.5 + Math.cos(time * 1.2) * 0.2;
      mesh4.position.y = -2 + Math.cos(time * 0.9) * 0.4;

      targetX = mouseX * 0.001;
      targetY = mouseY * 0.001;

      camera.position.x += 0.05 * (targetX - camera.position.x);
      camera.position.y += 0.05 * (-targetY - camera.position.y);
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    };

    animate();

    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  // 6. عدادات الأرقام (Animated Counters)
  const statNumbers = document.querySelectorAll(".stat-number");

  if (statNumbers.length > 0) {
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const targetElement = entry.target;
          const targetValue = parseInt(targetElement.getAttribute("data-target"), 10);
          const prefix = targetElement.getAttribute("data-prefix") || "";
          const suffix = targetElement.getAttribute("data-suffix") || "";
          let currentCount = 0;

          // Determine chunk size based on target to keep animation roughly constant time
          const duration = 2000; // ms
          const frameRate = 16; // approx 60fps
          const totalFrames = Math.round(duration / frameRate);
          const chunk = targetValue / totalFrames;

          const updateCounter = () => {
            currentCount += chunk;
            if (currentCount < targetValue) {
              targetElement.innerText = prefix + Math.floor(currentCount) + suffix;
              requestAnimationFrame(updateCounter);
            } else {
              targetElement.innerText = prefix + targetValue + suffix;
            }
          };

          updateCounter();
          observer.unobserve(targetElement); // Only animate once
        }
      });
    }, observerOptions);

    statNumbers.forEach(number => {
      observer.observe(number);
    });
  }

  // 7. نافذة الشروط والأحكام (Terms & Conditions Modal)
  const portalLinks = document.querySelectorAll(".portal-link");
  const termsModal = document.getElementById("termsModal");
  const closeModalBtn = document.getElementById("closeModalBtn");
  const acceptTermsBtn = document.getElementById("acceptTermsBtn");

  const openModal = (e) => {
    e.preventDefault(); // Prevent direct navigation
    if (termsModal) {
      termsModal.classList.add("active");
    }
  };

  const closeModal = () => {
    if (termsModal) {
      termsModal.classList.remove("active");
    }
  };

  // Attach click events to all portal links
  portalLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      openModal(e);
      trackGAEvent('portal_click', {
        'event_category': 'Engagement',
        'event_label': 'Portal Link Clicked'
      });
    });
  });

  // Close modal via (X) button
  if (closeModalBtn) {
    closeModalBtn.addEventListener("click", closeModal);
  }

  // Close modal when clicking outside the content area
  if (termsModal) {
    termsModal.addEventListener("click", (e) => {
      if (e.target === termsModal) {
        closeModal();
      }
    });
  }

  // Accept Terms and Redirect
  if (acceptTermsBtn) {
    acceptTermsBtn.addEventListener("click", () => {
      trackGAEvent('accept_terms_click', {
        'event_category': 'Conversion',
        'event_label': 'Terms Accepted'
      });
      window.location.href = "https://bixsrsh.i3j.io/";
    });
  }

});
