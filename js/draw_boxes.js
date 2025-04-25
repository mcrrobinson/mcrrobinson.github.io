function generateBlock(title, description, language) {
    // Create grid box with random size.
    var newDiv = document.createElement("div");
    newDiv.setAttribute('onclick',"location.href='https://github.com/mcrrobinson/" + title + "'");
    newDiv.classList.add("grid");

    // Contents
    var titleDiv = document.createElement("div");
    titleDiv.innerHTML += title
    titleDiv.className = "gridTitle";
    newDiv.appendChild(titleDiv)

    var descDiv = document.createElement("div");
    descDiv.innerHTML += description
    descDiv.className = "gridDesc";
    newDiv.appendChild(descDiv)


    if (language) {
        var languageContainer = document.createElement("div");
        languageContainer.className = "gridLang";
    
        var langDiv = document.createElement("div");
        langDiv.innerHTML += language;
        languageContainer.appendChild(langDiv);
    
        var langIcon = document.createElement("img");
        langIcon.src = "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/" + language.toLowerCase() + "/" + language.toLowerCase() + "-original.svg";
        langIcon.className = "gridLangIcon";
    
        // Check if the image loads successfully
        langIcon.onload = function() {
            languageContainer.appendChild(langIcon);
        };
    
        // If the image fails to load, don't append the image element
        langIcon.onerror = function() {
            // Optionally, you could add a fallback icon or text here if you prefer
            console.warn("Failed to load icon for:", language);
        };
    
        newDiv.appendChild(languageContainer);
    }
    

    // Write all contents to the grid.
    document.getElementById('projects').appendChild(newDiv);
}

fetch('https://api.github.com/users/mcrrobinson/repos')
    .then(response => response.json())
    .then(data => {
        data.forEach(repo => {
            if (repo.name !== "mcrrobinson") {
                generateBlock(repo.name, repo.description, repo.language);
            }
        });
    })
    .catch(error => console.error('Error fetching GitHub repos:', error));