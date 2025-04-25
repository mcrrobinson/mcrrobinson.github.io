/**
 * Gets a random number between min and max values
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Random number within range
 */
function getRandomBetween(min, max) {
    return Math.random() * (max - min) + min;
  }
  
  /**
   * Creates a repository display block
   * @param {string} column - Column ID to append to
   * @param {Object} repo - Repository object with name, description, and language
   */
  function generateBlock(column, repo) {
    const { name, description, language } = repo;
    
    // Create grid box with random size
    const newDiv = document.createElement("div");
    newDiv.classList.add("grid");
    newDiv.style.height = `${getRandomBetween(220, 280)}px`;
    newDiv.addEventListener('click', () => {
      window.location.href = `https://github.com/mcrrobinson/${name}`;
    });
  
    // Create and append title
    const titleDiv = document.createElement("div");
    titleDiv.textContent = name;
    titleDiv.className = "gridTitle";
    newDiv.appendChild(titleDiv);
  
    // Create and append description
    const descDiv = document.createElement("div");
    descDiv.textContent = description || "No description available";
    descDiv.className = "gridDesc";
    newDiv.appendChild(descDiv);




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
    } else {
      var languageContainer = document.createElement("div");
      languageContainer.className = "gridLang";
  
      var langDiv = document.createElement("div");
      langDiv.innerHTML += "No language specified";
      languageContainer.appendChild(langDiv);
  
      newDiv.appendChild(languageContainer);
    }
  
  
    // Append to column
    document.getElementById(column).appendChild(newDiv);
  }
  
  /**
   * Fetches and displays GitHub repositories
   */
  async function fetchAndDisplayRepos() {
    try {
      const response = await fetch('https://api.github.com/users/mcrrobinson/repos');
      
      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
      }
      
      const data = await response.json();
      const repos = data.filter(repo => !repo.fork && repo.name !== "mcrrobinson");
      
      // Calculate how many complete rows of 4 we can make
      const completeRows = Math.floor(repos.length / 4);
      
      for (let row = 0; row < completeRows; row++) {
        for (let col = 1; col <= 4; col++) {
          const repoIndex = row * 4 + (col - 1);
          generateBlock(`column${col}`, repos[repoIndex]);
        }
      }
      
      // Handle remaining repos (incomplete last row)
      const remainingRepos = repos.length % 4;
      for (let col = 1; col <= remainingRepos; col++) {
        const repoIndex = completeRows * 4 + (col - 1);
        generateBlock(`column${col}`, repos[repoIndex]);
      }
      
    } catch (error) {
      console.error('Error fetching GitHub repos:', error);
      document.getElementById('column1').innerHTML = 
        '<div class="error">Failed to load repositories. Please try again later.</div>';
    }
  }
  
  // Initialize the page
  document.addEventListener('DOMContentLoaded', fetchAndDisplayRepos);