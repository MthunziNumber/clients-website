document.addEventListener("DOMContentLoaded", function () {
    // Set up default section
    showSection('home');

    // Dark Mode Toggle
    const toggleButton = document.querySelector(".toggle-mode");
    const body = document.body;

    body.className = localStorage.getItem("theme") || "light-mode";

    toggleButton.addEventListener("click", function () {
        const newTheme = body.classList.contains("light-mode") ? "dark-mode" : "light-mode";
        body.className = newTheme;
        localStorage.setItem("theme", newTheme);
    });

    // Contact Form Submission
    const contactForm = document.getElementById("contactForm");
    if (contactForm) {
        contactForm.addEventListener("submit", async function (event) {
            event.preventDefault();

            const name = document.getElementById("name").value.trim();
            const email = document.getElementById("email").value.trim();
            const number = document.getElementById("number").value.trim();
            const message = document.getElementById("message").value.trim();

            if (!name || !validateEmail(email) || !message) {
                alert("Please enter valid information in all required fields.");
                return;
            }

            const data = { name, email, number, message };
            const BACKEND_URL = "https://www.dewdaytrading.com";

            try {
                const response = await fetch(`${BACKEND_URL}/send-quotation`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data)
                });

                if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);

                document.getElementById('contactForm').innerHTML = "<p>Thank you! We will contact you soon.</p>";
                alert(`Thank you, ${name}! Your message has been sent.`);
                contactForm.reset();
            } catch (error) {
                alert(`Network issue: ${error.message}`);
                console.error("Fetch error:", error);
            }
        });
    }
});

// Function to show the selected section
function showSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (!section) return console.error("Section does not exist:", sectionId);

    document.querySelectorAll(".content-section").forEach(s => s.classList.remove("active"));
    section.classList.add("active");
}

// Email Validation Function
function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
