// Global state variables
let investigationInterval = null;
let currentProgress = 0;

// Navigation with History API (as previously defined)
function navigateTo(sectionId, pushHistory = true) {
  // Hide all sections
  document.getElementById("dashboardSection").style.display = "none";
  document.getElementById("investigationSection").style.display = "none";
  document.getElementById("reportSection").style.display = "none";
  
  // Show the target section
  document.getElementById(sectionId).style.display = "block";
  
  // Update the active navigation if the target is one of our sidebar links
  let navLink = document.querySelector(`.sidebar ul li a#nav${capitalize(sectionId.replace("Section", ""))}`);
  if (navLink) {
    setActiveNav(navLink);
  }
  
  // Push the new state into the browser history if required
  if (pushHistory) {
    history.pushState({ section: sectionId }, "", `#${sectionId}`);
  }
}

// Capitalize helper
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Handle back/forward events
window.onpopstate = function(event) {
  if (event.state && event.state.section) {
    navigateTo(event.state.section, false);
  } else {
    navigateTo("dashboardSection", false);
  }
};

// Login Form Handler
document.getElementById("loginForm").addEventListener("submit", function(e) {
  e.preventDefault();
  if (document.getElementById("username").value && document.getElementById("password").value) {
    document.getElementById("loginSection").style.display = "none";
    navigateTo("dashboardSection");
  }
});

// Sidebar Navigation Handlers
document.getElementById("navDashboard").addEventListener("click", function(e) {
  e.preventDefault();
  navigateTo("dashboardSection");
});
document.getElementById("navInvestigation").addEventListener("click", function(e) {
  e.preventDefault();
  navigateTo("investigationSection");
});
document.getElementById("navReport").addEventListener("click", function(e) {
  e.preventDefault();
  navigateTo("reportSection");
});

function setActiveNav(selectedLink) {
  let navLinks = document.querySelectorAll(".sidebar ul li a");
  navLinks.forEach(link => link.classList.remove("active"));
  selectedLink.classList.add("active");
}

// Logout Function
function logout() {
  clearInterval(investigationInterval);
  investigationInterval = null;
  currentProgress = 0;
  document.getElementById("progressBar").style.width = "0%";
  document.getElementById("progressBar").innerText = "0%";
  history.pushState({}, "", "#loginSection");
  document.getElementById("loginSection").style.display = "flex";
  document.getElementById("dashboardSection").style.display = "none";
  document.getElementById("investigationSection").style.display = "none";
  document.getElementById("reportSection").style.display = "none";
}

// New function: Initiate Investigation after specifying social media platform
function initiateInvestigation() {
  const platform = document.getElementById("platformSelect").value;
  const platformUsername = document.getElementById("platformUsername").value;
  const platformPassword = document.getElementById("platformPassword").value;
  
  if (!platform || !platformUsername || !platformPassword) {
    alert("Please fill in all fields for the social media platform.");
    return;
  }
  
  // For demo purposes, simulate successful platform authentication.
  document.getElementById("dataPreview").innerText = "Fetching data from " + 
    platform.charAt(0).toUpperCase() + platform.slice(1) + "...";
  
  // Hide the platform selection form and show the investigation simulation UI.
  document.querySelector(".platform-selection").style.display = "none";
  document.getElementById("investigationSim").style.display = "block";
  
  // Begin the simulated investigation process.
  startInvestigation();
}

// Simulate Investigation Process
function startInvestigation() {
  if (investigationInterval) return;
  currentProgress = 0;
  
  investigationInterval = setInterval(function() {
    currentProgress += Math.floor(Math.random() * 10) + 5;
    if (currentProgress >= 100) {
      currentProgress = 100;
      clearInterval(investigationInterval);
      investigationInterval = null;
      document.getElementById("dataPreview").innerText = "Data parsed and analyzed successfully.";
      setTimeout(function() {
        generateReport();
        navigateTo("reportSection");
      }, 1000);
    }
    document.getElementById("progressBar").style.width = currentProgress + "%";
    document.getElementById("progressBar").innerText = currentProgress + "%";
  }, 1000);
}

function pauseInvestigation() {
  if (investigationInterval) {
    clearInterval(investigationInterval);
    investigationInterval = null;
  }
}

function cancelInvestigation() {
  clearInterval(investigationInterval);
  investigationInterval = null;
  currentProgress = 0;
  document.getElementById("progressBar").style.width = "0%";
  document.getElementById("progressBar").innerText = "0%";
  document.getElementById("dataPreview").innerText = "Investigation canceled.";
}

// Simulate Report Generation
function generateReport() {
  const reportContent = `
    <strong>Investigation Report</strong><br><br>
    Social Media Data Summary:<br>
    - 50 posts fetched<br>
    - 20 messages parsed<br>
    - 15 friends/followers analyzed<br><br>
    Analysis Insights:<br>
    - Engagement patterns detected<br>
    - Relevant screenshots and data logs attached<br><br>
    Report generated on: ${new Date().toLocaleString()}
  `;
  document.getElementById("reportContent").innerHTML = reportContent;
  
  document.getElementById("reportCount").innerText = "1 new report generated";
  document.getElementById("activeCount").innerText = "0 ongoing investigations";
}

// Simulate Export/Print Report Functionality
function exportReport() {
  alert("Export/Print functionality is not implemented in this demo.");
}
