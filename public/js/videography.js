document.addEventListener("DOMContentLoaded", function () {
    const toggleBtn = document.getElementById("toggleFormBtn");
    const form = document.getElementById("inquiryForm");

    toggleBtn.addEventListener("click", function () {
        if (form.style.display === "none" || form.style.display === "") {
            form.style.display = "block";
            form.scrollIntoView({ behavior: "smooth" });
        } else {
            form.style.display = "none";
        }
    });
});