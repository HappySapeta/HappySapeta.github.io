'use strict';

// element toggle function
const elementToggleFunc = function (elem) 
{
    elem.classList.toggle("active");
}

// sidebar variables
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

// sidebar toggle functionality for mobile
sidebarBtn.addEventListener("click", function () 
{
    elementToggleFunc(sidebar);
});

// contact form variables
const form = document.querySelector("[data-form]");
const formInputs = document.querySelectorAll("[data-form-input]");
const formBtn = document.querySelector("[data-form-btn]");

// add event to all form input field
for (let i = 0; i < formInputs.length; i++) {
    formInputs[i].addEventListener("input", function () {

        // check form validation
        if (form.checkValidity()) {
            formBtn.removeAttribute("disabled");
        } else {
            formBtn.setAttribute("disabled", "");
        }

    });
}


// page navigation variables
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

// add event to all nav link
for (let i = 0; i < navigationLinks.length; i++) {
    navigationLinks[i].addEventListener("click", function () {

        for (let i = 0; i < pages.length; i++) {
            if (this.innerHTML.toLowerCase() === pages[i].dataset.page) {
                pages[i].classList.add("active");
                navigationLinks[i].classList.add("active");
                window.scrollTo(0, 0);
            } else {
                pages[i].classList.remove("active");
                navigationLinks[i].classList.remove("active");
            }
        }

    });
}

const projectPanel = document.querySelector("[data-project-panel]");
const projectPanelOverlay = document.querySelector("[data-project-panel-overlay]");
const projectPanelClose = document.querySelector("[data-project-panel-close]");
const projectTitle = document.querySelector("[data-project-title]");
const projectContent = document.querySelector("[data-project-content]");
const projectStudios = document.querySelector("[data-project-studios]");
const projectImage = document.querySelector("[data-project-image]");
const projectLink = document.querySelector("[data-project-link]");
const projectAnchors = document.querySelectorAll("[data-project]");

const projects = new Map([
    ["exoborne", {
        title: "Exoborne",
        studios: "Sharkmob",
        description: "Worked on gameplay features and UI.",
        link: "https://www.exoborne.com/en/",
        image: "./assets/images/exoborne.jpg",
        imageAlt: "Exoborne key art"
    }],
]);

function openProjectPanel(name) {
    const project = projects.get(name);

    projectTitle.textContent = project.title;
    projectStudios.textContent = project.studios;
    projectContent.textContent = project.description;
    projectLink.href = project.link;
    projectImage.src = project.image;
    projectImage.alt = project.imageAlt;
    projectPanel.classList.add("active");
    projectPanelOverlay.classList.add("active");
    document.body.classList.add("project-panel-open");
    projectPanelClose.focus();
}

function closeProjectPanel() {
    projectPanel.classList.remove("active");
    projectPanelOverlay.classList.remove("active");
    document.body.classList.remove("project-panel-open");
}

projectAnchors.forEach((projectAnchor) => {
    projectAnchor.addEventListener("click", (event) => {
        event.preventDefault();

        const projectName = projectAnchor.dataset.project;

        if(projects.has(projectName)){
            openProjectPanel(projectName);
        }
    });
});

projectPanelClose.addEventListener("click", closeProjectPanel);
projectPanelOverlay.addEventListener("click", closeProjectPanel);

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && projectPanel.classList.contains("active")) {
        closeProjectPanel();
    }
});
