document.addEventListener("DOMContentLoaded", function () {
    showSection('home');

    const toggleButton = document.querySelector(".toggle-mode");
    const body = document.body;

    // Load saved theme
    const savedTheme = localStorage.getItem("theme") || "light-mode";
    body.className = savedTheme;

    // Toggle theme while preserving entertainment mode
    toggleButton.addEventListener("click", function () {
        const newTheme = body.classList.contains("light-mode") ? "dark-mode" : "light-mode";
        if (body.classList.contains("entertainment-mode")) {
            body.className = `${newTheme} entertainment-mode`;
        } else {
            body.className = newTheme;
        }
        localStorage.setItem("theme", newTheme);
    });

    // Contact form logic
    const contactForm = document.getElementById("contactForm");
    if (contactForm) {
        const spinner = document.createElement("div");
        spinner.id = "formSpinner";
        spinner.innerHTML = `
            <div class="spinner-overlay">
                <div class="spinner"></div>
            </div>
        `;
        spinner.style.display = 'none';
        contactForm.appendChild(spinner);

        contactForm.addEventListener("submit", async function (event) {
            event.preventDefault();

            const name = document.getElementById("name").value.trim();
            const email = document.getElementById("email").value.trim();
            const number = document.getElementById("number").value.trim();
            const message = document.getElementById("message").value.trim();

            if (!name || !validateEmail(email) || !number || !message) {
                alert("Please enter valid information in all required fields.");
                return;
            }

            const data = { name, email, number, message };
            const BACKEND_URL = "http://127.0.0.1:8001";

            spinner.style.display = 'block';
            setFormEnabled(contactForm, false);

            try {
                const response = await fetch(`${BACKEND_URL}/send-quotation`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data)
                });

                if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
                spinner.style.display = 'none';
                contactForm.innerHTML = "<p>Thank you! We will contact you soon.</p>";

            } catch (error) {
                spinner.style.display = 'none';
                setFormEnabled(contactForm, true);
                alert(`Network issue: ${error.message}`);
                console.error("Fetch error:", error);
            }
        });
    }
});

function setFormEnabled(form, enabled) {
    Array.from(form.elements).forEach(el => {
        if (el.tagName !== "DIV") {
            el.disabled = !enabled;
        }
    });
}

function showSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (!section) return console.error("Section does not exist:", sectionId);

    // Show the selected section
    document.querySelectorAll(".content-section").forEach(s => s.classList.remove("active"));
    section.classList.add("active");

    // Remove entertainment mode
    document.body.classList.remove("entertainment-mode");

    // Apply entertainment background only when section is 'entertainment'
    if (sectionId === "entertainment") {
        document.body.classList.add("entertainment-mode");
    }
}

function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}