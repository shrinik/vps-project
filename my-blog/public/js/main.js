(() => {
  // <stdin>
  console.log("This theme was created by psugam.");
  document.addEventListener("DOMContentLoaded", function() {
    const footnoteDiv = document.querySelector(".footnotes");
    if (footnoteDiv) {
      const hr = footnoteDiv.querySelector("hr");
      const ol = footnoteDiv.querySelector("ol");
      const footnoteText = document.createElement("div");
      footnoteText.id = "myfootnoteText";
      footnoteText.textContent = "Footnotes";
      if (ol) {
        footnoteDiv.insertBefore(footnoteText, ol);
      } else if (hr) {
        footnoteDiv.insertBefore(footnoteText, hr.nextSibling);
      } else {
        footnoteDiv.appendChild(footnoteText);
      }
    }
    document.querySelectorAll("[data-accordion-group]").forEach(function(accordion) {
      const groupId2 = accordion.getAttribute("data-accordion-group");
      window.initAccordionGroup(groupId2);
    });
    const toggleButton = document.getElementById("dark-mode-toggle");
    const body = document.body;
    const darkCircle = document.getElementById("dark-circle");
    const lightCircle = document.getElementById("light-circle");
    let theme = localStorage.getItem("theme") || "light";
    if (toggleButton) {
      if (theme === "dark") {
        body.classList.add("dark-mode");
        darkCircle.style.display = "inline";
        lightCircle.style.display = "none";
      } else {
        body.classList.remove("dark-mode");
        darkCircle.style.display = "none";
        lightCircle.style.display = "inline";
      }
      toggleButton.addEventListener("click", () => {
        body.classList.toggle("dark-mode");
        if (body.classList.contains("dark-mode")) {
          localStorage.setItem("theme", "dark");
          lightCircle.style.setProperty("display", "none");
          darkCircle.style.setProperty("display", "inline");
        } else {
          localStorage.setItem("theme", "light");
          darkCircle.style.setProperty("display", "none");
          lightCircle.style.setProperty("display", "inline");
        }
      });
    }
    try {
      const cloud = document.querySelector('.taxo-cloud[data-taxonomy="{{ $taxonomy }}"]');
      if (cloud) {
        const terms = Array.from(cloud.children);
        terms.sort(() => Math.random() - 0.5);
        cloud.innerHTML = "";
        terms.forEach((t) => cloud.appendChild(t));
      }
    } catch (err) {
      console.error("Taxonomy cloud error:", err);
    }
    const hamburger = document.getElementById("hamburger-menu");
    const navMenu = document.getElementById("nav-menu");
    if (hamburger && navMenu) {
      hamburger.addEventListener("click", function(e) {
        e.stopPropagation();
        hamburger.classList.toggle("active");
        navMenu.classList.toggle("active");
      });
    }
    function initMobileNestedMenus() {
      if (window.innerWidth > 768) return;
      const menuItems = document.querySelectorAll(".header-nav li");
      menuItems.forEach((item) => {
        const submenu = item.querySelector(":scope > ul");
        if (submenu) {
          item.classList.add("has-children");
          const link = item.querySelector(":scope > a");
          if (link && !link.dataset.mobileHandler) {
            link.dataset.mobileHandler = "true";
            link.addEventListener("click", function(e) {
              if (window.innerWidth <= 768) {
                const clickX = e.clientX;
                const linkRect = link.getBoundingClientRect();
                const clickedArrowArea = clickX > linkRect.right - 50;
                if (clickedArrowArea) {
                  e.preventDefault();
                  e.stopPropagation();
                  const wasExpanded = item.classList.contains("expanded");
                  const parent = item.parentElement;
                  const siblings = parent.querySelectorAll(":scope > li.has-children");
                  siblings.forEach((sibling) => {
                    if (sibling !== item) {
                      sibling.classList.remove("expanded");
                    }
                  });
                  if (wasExpanded) {
                    item.classList.remove("expanded");
                  } else {
                    item.classList.add("expanded");
                  }
                }
              }
            });
          }
        }
      });
    }
    initMobileNestedMenus();
    let resizeTimeout;
    window.addEventListener("resize", function() {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(function() {
        if (window.innerWidth <= 768) {
          initMobileNestedMenus();
        } else {
          document.querySelectorAll(".header-nav li.expanded").forEach((item) => {
            item.classList.remove("expanded");
          });
        }
      }, 250);
    });
    document.addEventListener("click", function(e) {
      if (window.innerWidth <= 768 && navMenu && hamburger) {
        const clickedInsideMenu = navMenu.contains(e.target);
        const clickedHamburger = hamburger.contains(e.target);
        if (!clickedInsideMenu && !clickedHamburger && navMenu.classList.contains("active")) {
          hamburger.classList.remove("active");
          navMenu.classList.remove("active");
          document.querySelectorAll(".header-nav li.expanded").forEach((item) => {
            item.classList.remove("expanded");
          });
        }
      }
    });
  });
  var goToTopButton = document.getElementById("goToTopButton");
  if (goToTopButton) {
    let scrollFunction = function() {
      if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
        goToTopButton.style.display = "block";
      } else {
        goToTopButton.style.display = "none";
      }
    };
    scrollFunction2 = scrollFunction;
    window.onscroll = function() {
      scrollFunction();
    };
    window.goToTop = function() {
      window.scrollTo({ top: 0, behavior: "smooth" });
    };
  }
  var scrollFunction2;
  if (!window.accordionInitialized) {
    window.accordionInitialized = {};
    window.initAccordionGroup = function(groupId2) {
      const container = document.querySelector('[data-accordion-group="' + groupId2 + '"]');
      if (!container || window.accordionInitialized[groupId2]) return;
      window.accordionInitialized[groupId2] = true;
      const buttons = container.querySelectorAll(".accordion-btn");
      const contents = container.querySelectorAll(".accordion-content");
      buttons.forEach((btn) => {
        btn.addEventListener("click", () => {
          const targetId = btn.getAttribute("data-accordion-target");
          const content = document.getElementById(targetId);
          const icon = btn.querySelector(".accordion-icon");
          const isHidden = content.classList.contains("hidden");
          contents.forEach((c) => c.classList.add("hidden"));
          buttons.forEach((b) => {
            b.classList.remove("active");
            b.querySelector(".accordion-icon").style.transform = "rotate(0deg)";
          });
          if (isHidden) {
            content.classList.remove("hidden");
            btn.classList.add("active");
            icon.style.transform = "rotate(90deg)";
          }
        });
      });
    };
  }
  if (!window.tabGroupInitialized) {
    window.tabGroupInitialized = {};
    window.initTabGroup = function(groupId2) {
      const container = document.querySelector('[data-tab-group="' + groupId2 + '"]');
      if (!container || window.tabGroupInitialized[groupId2]) return;
      window.tabGroupInitialized[groupId2] = true;
      const buttons = container.querySelectorAll(".tab-btn");
      const contents = container.querySelectorAll(".tab-content");
      buttons.forEach((btn) => {
        btn.addEventListener("click", () => {
          const targetId = btn.getAttribute("data-tab-target");
          contents.forEach((c) => c.classList.add("hidden"));
          buttons.forEach((b) => b.classList.remove("active"));
          document.getElementById(targetId).classList.remove("hidden");
          btn.classList.add("active");
        });
      });
      if (buttons.length > 0) {
        buttons[0].click();
      }
    };
  }
  var groupId = "{{ $tabGroupId }}";
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function() {
      window.initTabGroup(groupId);
    });
  } else {
    window.initTabGroup(groupId);
  }
})();
