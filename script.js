// Global state variables
let investigationInterval = null;
let currentProgress = 0;
let currentUserRole = ""; 

// Navigation with History API
function navigateTo(sectionId, pushHistory = true) {
  // Hide all sections
  document.getElementById("dashboardSection").style.display = "none";
  document.getElementById("investigationSection").style.display = "none";
  document.getElementById("reportSection").style.display = "none";
  document.getElementById("adminSection").style.display = "none";
  
  // Show the target section
  document.getElementById(sectionId).style.display = "block";
  
  // Update the active navigation if applicable
  let navLink = document.querySelector(`.sidebar ul li a#nav${capitalize(sectionId.replace("Section", ""))}`);
  if (navLink) {
    setActiveNav(navLink);
  }
  
  // Push state to browser history
  if (pushHistory) {
    history.pushState({ section: sectionId }, "", `#${sectionId}`);
  }
}

// Capitalize helper function
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Handle browser back/forward events
window.onpopstate = function(event) {
  if (event.state && event.state.section) {
    navigateTo(event.state.section, false);
  } else {
    // If no state is available, fallback based on the current user role
    if (currentUserRole === "admin") {
      navigateTo("adminSection", false);
    } else {
      navigateTo("dashboardSection", false);
    }
  }
};

// Login Form Handler
document.getElementById("loginForm").addEventListener("submit", function(e) {
  e.preventDefault();
  if (document.getElementById("username").value && document.getElementById("password").value) {
    document.getElementById("loginSection").style.display = "none";
    // Get and store the selected user role from the drop-down menu
    currentUserRole = document.getElementById("userRoleSelect").value;
    if (currentUserRole === "admin") {
      // Replace the history state with the admin panel state
      history.replaceState({ section: "adminSection" }, "", "#adminSection");
      navigateTo("adminSection", false);
    } else {
      // Replace the history state with the examiner dashboard state
      history.replaceState({ section: "dashboardSection" }, "", "#dashboardSection");
      navigateTo("dashboardSection", false);
    }
  }
});



// Sidebar Navigation Handlers for Examiner
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

// Sidebar Navigation Handlers for Admin
document.getElementById("navAdminDashboard")?.addEventListener("click", function(e) {
  e.preventDefault();
  navigateTo("adminSection");
  loadAdminContent("dashboard");
});
document.getElementById("navConfigureTool")?.addEventListener("click", function(e) {
  e.preventDefault();
  loadAdminContent("configureTool");
});
document.getElementById("navManageAccess")?.addEventListener("click", function(e) {
  e.preventDefault();
  loadAdminContent("manageAccess");
});
document.getElementById("navUpdateSettings")?.addEventListener("click", function(e) {
  e.preventDefault();
  loadAdminContent("updateSettings");
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
  document.getElementById("adminSection").style.display = "none";
}

// =========================
// Examiner Investigation Functions
// =========================
function initiateInvestigation() {
  const platform = document.getElementById("platformSelect").value;
  const platformUsername = document.getElementById("platformUsername").value;
  const platformPassword = document.getElementById("platformPassword").value;
  
  if (!platform || !platformUsername || !platformPassword) {
    alert("Please fill in all fields for the social media platform.");
    return;
  }
  
  document.getElementById("dataPreview").innerText = "Fetching data from " + capitalize(platform) + "...";
  document.querySelector(".platform-selection").style.display = "none";
  document.getElementById("investigationSim").style.display = "block";
  startInvestigation();
}

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

// =========================
// Admin Panel Functions
// =========================
function loadAdminContent(option) {
  let content = "";
  switch(option) {
    case "dashboard":
      content = `<h3>Admin Dashboard</h3>
                 <p>Welcome, Admin! Here you can view system metrics and summaries.</p>`;
      break;
    case "configureTool":
      content = `<h3>Configure Tool</h3>
                 <form id="configureForm">
                   <div class="input-group">
                     <label for="apiKey">API Key:</label>
                     <input type="text" id="apiKey" placeholder="Enter new API key" required>
                   </div>
                   <div class="input-group">
                     <label for="toolSetting">Tool Setting:</label>
                     <input type="text" id="toolSetting" placeholder="Enter tool setting value" required>
                   </div>
                   <button type="button" onclick="submitConfiguration()">Save Configuration</button>
                 </form>`;
      break;
    case "manageAccess":
      content = `<h3>Manage Access</h3>
                 <p>List of examiners and access rights:</p>
                 <ul>
                   <li>Examiner A - Active</li>
                   <li>Examiner B - Active</li>
                   <li>Examiner C - Pending</li>
                 </ul>`;
      break;
    case "updateSettings":
      content = `<h3>Update Settings</h3>
                 <form id="updateSettingsForm">
                   <div class="input-group">
                     <label for="logLevel">Log Level:</label>
                     <select id="logLevel" required>
                       <option value="info">Info</option>
                       <option value="debug">Debug</option>
                       <option value="error">Error</option>
                     </select>
                   </div>
                   <div class="input-group">
                     <label for="systemMode">System Mode:</label>
                     <select id="systemMode" required>
                       <option value="production">Production</option>
                       <option value="maintenance">Maintenance</option>
                     </select>
                   </div>
                   <button type="button" onclick="submitSettings()">Update Settings</button>
                 </form>`;
      break;
    default:
      content = `<h3>Admin Dashboard</h3><p>Welcome, Admin!</p>`;
  }
  document.getElementById("adminFormSection").innerHTML = content;
  document.getElementById("adminFormSection").style.display = "block";
}

function submitConfiguration() {
  alert("Tool configuration updated successfully!");
  document.getElementById("adminFormSection").style.display = "none";
}

function submitSettings() {
  alert("System settings updated successfully!");
  document.getElementById("adminFormSection").style.display = "none";
}

// =========================
// Export/Print Report (Examiner)
// =========================
function exportReport() {
  alert("Export/Print functionality is not implemented in this demo.");
}
