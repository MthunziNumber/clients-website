document.addEventListener("DOMContentLoaded", function () {
    // Show the default section (Home)
    showSection('home');

    // Dark Mode Toggle
    const toggleButton = document.querySelector(".toggle-mode");
    const body = document.body;

    if (!localStorage.getItem("theme")) {
        body.classList.add("light-mode");
    } else {
        body.classList.add(localStorage.getItem("theme"));
    }

    toggleButton.addEventListener("click", function () {
        if (body.classList.contains("light-mode")) {
            body.classList.remove("light-mode");
            body.classList.add("dark-mode");
            localStorage.setItem("theme", "dark-mode");
        } else {
            body.classList.remove("dark-mode");
            body.classList.add("light-mode");
            localStorage.setItem("theme", "light-mode");
        }
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

            if (!name || !email || !message) {
                alert("Please fill in all required fields.");
                return;
            }

            const data = { name, email, number, message };

            try {
                const response = await fetch('/send-quotation', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });

                if (response.ok) {
                    alert("Thank you, " + name + "! Your message has been sent.");
                    contactForm.reset();
                } else {
                    alert("Failed to send your message. Please try again.");
                }
            } catch (error) {
                alert("An error occurred. Please try again later.");
                console.error(error);
            }
        });
    }
});

// Function to show the selected section
function showSection(sectionId) {
    let sections = document.querySelectorAll(".content-section");

    sections.forEach(section => {
        section.classList.remove("active"); // Hide all sections
    });

    document.getElementById(sectionId).classList.add("active"); // Show selected section
}
