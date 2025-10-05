document.addEventListener("DOMContentLoaded", function () {
    showSection('home');

    const toggleButton = document.querySelector(".toggle-mode");
    const body = document.body;

    body.className = localStorage.getItem("theme") || "light-mode";

    toggleButton.addEventListener("click", function () {
        const newTheme = body.classList.contains("light-mode") ? "dark-mode" : "light-mode";
        body.className = newTheme;
        localStorage.setItem("theme", newTheme);
    });

    const contactForm = document.getElementById("contactForm");
    if (contactForm) 
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
            // const BACKEND_URL = "https://www.dewdaytrading.com";
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
);

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

    document.querySelectorAll(".content-section").forEach(s => s.classList.remove("active"));
    section.classList.add("active");
}

function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
