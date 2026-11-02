document.addEventListener("DOMContentLoaded", () => {
    const header = document.querySelector("[data-header]");
    const menuToggle = document.querySelector(".menu-toggle");
    const navigation = document.querySelector(".main-nav");

    const closeMenu = () => {
        if (!menuToggle || !navigation) return;
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation");
        navigation.classList.remove("is-open");
        document.body.classList.remove("menu-open");
    };

    if (menuToggle && navigation) {
        menuToggle.addEventListener("click", () => {
            const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
            menuToggle.setAttribute("aria-expanded", String(!isOpen));
            menuToggle.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
            navigation.classList.toggle("is-open", !isOpen);
            document.body.classList.toggle("menu-open", !isOpen);
        });
        navigation.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
        document.addEventListener("keydown", (event) => { if (event.key === "Escape") closeMenu(); });
    }

    const updateHeader = () => header?.classList.toggle("is-scrolled", window.scrollY > 16);
    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });

    const revealItems = document.querySelectorAll(".reveal");
    if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        const observer = new IntersectionObserver((entries, itemObserver) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) { entry.target.classList.add("is-visible"); itemObserver.unobserve(entry.target); }
            });
        }, { threshold: 0.12, rootMargin: "0px 0px -32px" });
        revealItems.forEach((item) => observer.observe(item));
    } else {
        revealItems.forEach((item) => item.classList.add("is-visible"));
    }

    document.querySelectorAll("[data-year]").forEach((element) => { element.textContent = new Date().getFullYear(); });

    const contactForm = document.querySelector("#contact-form");
    if (contactForm) {
        contactForm.addEventListener("submit", (event) => {
            event.preventDefault();
            if (!contactForm.reportValidity()) return;

            const data = new FormData(contactForm);
            const name = String(data.get("name")).trim();
            const replyEmail = String(data.get("email")).trim();
            const subject = String(data.get("subject")).trim();
            const message = String(data.get("message")).trim();
            const recipient = "<insert_parameter>";
            const body = [
                `Hello <insert_parameter>,`,
                "",
                message,
                "",
                "—",
                `Name: ${name}`,
                `Reply email: ${replyEmail}`
            ].join("\r\n");
            const mailtoParameters = new URLSearchParams({ subject, body });
            const mailtoUrl = `mailto:${recipient}?${mailtoParameters.toString().replace(/\+/g, "%20")}`;
            const note = document.querySelector("#form-note");
            if (note) note.textContent = "Opening your email application…";

            const mailLink = document.createElement("a");
            mailLink.href = mailtoUrl;
            mailLink.hidden = true;
            document.body.append(mailLink);
            mailLink.click();
            mailLink.remove();
        });
    }
});
