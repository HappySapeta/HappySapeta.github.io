/**
 * copyright 2022 @codewithsadee
 */

/**
 * Some parts of this style-sheet have been created by ChatGPT.
 */

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
const projectTechStack = document.querySelector("[data-project-tech-stack]");
const projectImage = document.querySelector("[data-project-image]");
const projectLink = document.querySelector("[data-project-link]");
const projectLists = document.querySelectorAll("[data-project-list]");

const projects = new Map();

projectLists.forEach((list) => {
    let activePointerId = null;
    let pointerStartX = 0;
    let scrollStartX = 0;
    let hasDragged = false;
    let suppressNextClick = false;

    list.addEventListener("wheel", (event) => {
        const maximumScroll = list.scrollWidth - list.clientWidth;
        const hasHorizontalOverflow = maximumScroll > 1;
        const isVerticalWheelMovement = Math.abs(event.deltaY) > Math.abs(event.deltaX);

        if (!hasHorizontalOverflow || !isVerticalWheelMovement || event.ctrlKey) return;

        let wheelDistance = event.deltaY;
        if (event.deltaMode === WheelEvent.DOM_DELTA_LINE) wheelDistance *= 16;
        if (event.deltaMode === WheelEvent.DOM_DELTA_PAGE) wheelDistance *= list.clientWidth;

        const nextPosition = Math.min(maximumScroll, Math.max(0, list.scrollLeft + wheelDistance));
        // Let the page scroll when the carousel cannot move any farther.
        if (Math.abs(nextPosition - list.scrollLeft) < 1) return;

        event.preventDefault();
        list.scrollLeft = nextPosition;
    }, { passive: false });

    list.addEventListener("pointerdown", (event) => {
        const canDrag = event.pointerType === "mouse" || event.pointerType === "pen";
        const hasHorizontalOverflow = list.scrollWidth - list.clientWidth > 1;

        if (!canDrag || event.button !== 0 || !hasHorizontalOverflow) return;

        activePointerId = event.pointerId;
        pointerStartX = event.clientX;
        scrollStartX = list.scrollLeft;
        hasDragged = false;
    });

    list.addEventListener("pointermove", (event) => {
        if (event.pointerId !== activePointerId) return;

        const dragDistance = event.clientX - pointerStartX;

        if (!hasDragged && Math.abs(dragDistance) >= 5) {
            hasDragged = true;
            list.classList.add("is-dragging");
            list.setPointerCapture(event.pointerId);
        }

        if (!hasDragged) return;

        event.preventDefault();
        list.scrollLeft = scrollStartX - dragDistance;
    });

    const finishPointerDrag = (event) => {
        if (event.pointerId !== activePointerId) return;

        const dragged = hasDragged;
        activePointerId = null;
        hasDragged = false;
        list.classList.remove("is-dragging");

        if (list.hasPointerCapture(event.pointerId)) {
            list.releasePointerCapture(event.pointerId);
        }

        if (dragged) {
            suppressNextClick = true;
            window.setTimeout(() => {
                suppressNextClick = false;
            }, 0);
        }
    };

    list.addEventListener("pointerup", finishPointerDrag);
    list.addEventListener("pointercancel", finishPointerDrag);
    list.addEventListener("lostpointercapture", finishPointerDrag);

    list.addEventListener("click", (event) => {
        if (!suppressNextClick) return;

        event.preventDefault();
        event.stopPropagation();
        suppressNextClick = false;
    }, true);

    list.addEventListener("dragstart", (event) => event.preventDefault());
});

function createProjectCard(project) {
    const item = document.createElement("li");
    item.className = "project-item active";
    item.innerHTML = `
        <a href="#" aria-label="View details for ${project.title}" data-project="${project.id}">
            <figure class="project-img">
                <div class="project-item-icon-box" aria-hidden="true">
                    <ion-icon name="eye-outline"></ion-icon>
                </div>
                <img src="${project.thumbnail || project.cover}" loading="lazy" decoding="async" alt="${project.coverAlt}" draggable="false">
                <figcaption class="project-card-caption">
                    <span class="project-card-title">${project.title}</span>
                </figcaption>
            </figure>
        </a>`;
    return item;
}

function showProjectListMessage(list, message) {
    const item = document.createElement("li");
    item.className = "project-list-message";
    item.textContent = message;
    list.appendChild(item);
}

async function loadProjects() {
    try {
        const response = await fetch("./assets/data/projects.json");
        if (!response.ok) throw new Error("Project data could not be loaded.");

        const projectData = await response.json();
        projectData.forEach((project) => projects.set(project.id, project));

        projectLists.forEach((list) => {
            const categoryProjects = projectData.filter((project) => project.category === list.dataset.projectList);

            if (categoryProjects.length === 0) {
                showProjectListMessage(list, "Projects will appear here once added.");
                return;
            }

            categoryProjects.forEach((project) => list.appendChild(createProjectCard(project)));
        });
    } catch (error) {
        projectLists.forEach((list) => showProjectListMessage(list, "Projects are temporarily unavailable."));
        console.error(error);
    }
}

function openProjectPanel(name) {
    const project = projects.get(name);

    projectTitle.textContent = project.title;
    projectStudios.textContent = project.studios.join(", ");
    projectContent.textContent = project.role;
    projectTechStack.textContent = project.techStack?.length ? project.techStack.join(", ") : "To be added.";
    projectImage.src = project.cover;
    projectImage.alt = project.coverAlt;

    const projectUrl = typeof project.url === "string" ? project.url.trim() : "";
    projectLink.hidden = projectUrl.length === 0;

    if (projectUrl) {
        projectLink.href = projectUrl;
    } else {
        projectLink.removeAttribute("href");
    }

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

document.addEventListener("click", (event) => {
    const projectAnchor = event.target.closest("[data-project]");
    if (!projectAnchor) return;

    event.preventDefault();
    const projectName = projectAnchor.dataset.project;

    if (projects.has(projectName)) {
        openProjectPanel(projectName);
    }
});

projectPanelClose.addEventListener("click", closeProjectPanel);
projectPanelOverlay.addEventListener("click", closeProjectPanel);

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && projectPanel.classList.contains("active")) {
        closeProjectPanel();
    }
});

loadProjects();
