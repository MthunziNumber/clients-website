document.addEventListener("DOMContentLoaded", function() {
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

    toggleButton.addEventListener("click", function() {
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
        contactForm.addEventListener("submit", function(event) {
            event.preventDefault();

            let name = document.getElementById("name").value;
            let email = document.getElementById("email").value;
            let message = document.getElementById("message").value;

            if (name === "" || email === "" || message === "") {
                alert("Please fill in all fields.");
                return;
            }

            alert("Thank you, " + name + "! Your message has been received.");
            contactForm.reset();
        });
    }

    // Load Footer Dynamically
    fetch("footer.html")
        .then(response => response.text())
        .then(data => {
            document.body.insertAdjacentHTML("beforeend", data);
        });

});

// Function to show the selected section
function showSection(sectionId) {
    let sections = document.querySelectorAll(".content-section");

    sections.forEach(section => {
        section.classList.remove("active"); // Hide all sections
    });

    document.getElementById(sectionId).classList.add("active"); // Show selected section
}
