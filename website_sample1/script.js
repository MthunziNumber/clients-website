document.addEventListener("DOMContentLoaded", function() {
    const toggleButton = document.querySelector(".toggle-mode");
    const body = document.body;

    // Set default light mode if no preference is saved
    if (!localStorage.getItem("theme")) {
        body.classList.add("light-mode");
    } else {
        body.classList.add(localStorage.getItem("theme"));
    }

    // Toggle dark mode
    toggleButton.addEventListener("click", function() {
        if (body.classList.contains("light-mode")) {
            body.classList.remove("light-mode");
            body.classList.add("dark-mode");
            localStorage.setItem("theme", "dark-mode"); // Save user preference
        } else {
            body.classList.remove("dark-mode");
            body.classList.add("light-mode");
            localStorage.setItem("theme", "light-mode"); // Save user preference
        }
    });

    // Contact form submission
    document.getElementById("contactForm").addEventListener("submit", function(event) {
        event.preventDefault(); // Prevents form refresh

        let name = document.getElementById("name").value;
        let email = document.getElementById("email").value;
        let message = document.getElementById("message").value;

        if (name === "" || email === "" || message === "") {
            alert("Please fill in all fields.");
            return;
        }

        alert("Thank you, " + name + "! Your message has been received.");
        document.getElementById("contactForm").reset();
    });
});
