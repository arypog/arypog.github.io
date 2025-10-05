function updateDateTime() {
    const now = new Date();
    const formatted = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} `
        + `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    document.getElementById('name-date').textContent = "ARY GOMES DA COSTA " + formatted;
}
updateDateTime();
setInterval(updateDateTime, 1000);

function createProjectNode(project) {
    const li = document.createElement("li");
    li.textContent = project.name;
    li.classList.add("has-children");

    const ul = document.createElement("ul");

    if (project.Description) {
        const descLi = document.createElement("li");
        descLi.textContent = project.Description;
        descLi.classList.add("filesystem-text");
        ul.appendChild(descLi);
    }

    if (project.Languages && project.Languages.length > 0) {
        const langLi = document.createElement("li");
        langLi.classList.add("has-children");
        langLi.textContent = "Languages";
        const langUl = document.createElement("ul");
        project.Languages.forEach(lang => {
            const l = document.createElement("li");
            l.textContent = lang;
            langUl.appendChild(l);
        });
        langLi.appendChild(langUl);
        ul.appendChild(langLi);
    }

    if (project.LinkToRepo) {
        const linkLi = document.createElement("li");
        const a = document.createElement("a");
        a.href = project.LinkToRepo;
        a.target = "_blank";
        a.textContent = "repository";
        linkLi.appendChild(a);
        ul.appendChild(linkLi);
    }


    li.appendChild(ul);
    return li;
}

function addToggleHandlers() {
    document.querySelectorAll('li.has-children').forEach(parent => {
        parent.addEventListener('click', e => {
            if (e.target !== e.currentTarget) return; // only if parent clicked
            const sublist = parent.querySelector(':scope > ul');
            if (!sublist) return;
            const isVisible = sublist.style.display === 'block';
            sublist.style.display = isVisible ? 'none' : 'block';
            parent.classList.toggle('expanded', !isVisible);
            e.stopPropagation();
        });
    });
}

fetch("projects.json")
    .then(res => res.json())
    .then(data => {
        const tree = document.getElementById("tree");
        data.forEach(project => {
            tree.appendChild(createProjectNode(project));
        });
        addToggleHandlers();
    })
    .catch(err => console.error("Error loading JSON:", err));