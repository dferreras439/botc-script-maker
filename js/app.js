// Combined app.js file - Single File Solution

// ============================
// CONSTANTS AND DATA
// ============================
const roleIcons = {
    washerwoman: "👚",
    librarian: "📚",
    investigator: "🔍",
    chef: "👨‍🍳",
    empath: "💖",
    fortuneteller: "🔮",
    fortune_teller: "🔮",
    undertaker: "⚰️",
    monk: "🧘",
    slayer: "🏹",
    soldier: "🛡️",
    ravenkeeper: "🐦",
    mayor: "🎖️",
    virgin: "💃",
    butler: "🧑‍🍳",
    drunk: "🍺",
    recluse: "🏚️",
    saint: "😇",
    poisoner: "🧪",
    spy: "🕵️",
    scarletwoman: "💃",
    baron: "🎩",
    imp: "😈"
};

// ============================
// DOM ELEMENT REFERENCES
// ============================
let roleJsonTextarea = null;
let generateBtn = null;
let printBtn = null;
let saveBtn = null;
let scriptNameEl = null;
let scriptAuthorEl = null;
let townsfolkRoles = null;
let outsiderRoles = null;
let minionRoles = null;
let demonRoles = null;

// ============================
// FUNCTIONS
// ============================

// Initialize DOM references
function cacheDOMElements() {
    roleJsonTextarea = document.getElementById('role-json');
    generateBtn = document.getElementById('generate-btn');
    printBtn = document.getElementById('print-btn');
    saveBtn = document.getElementById('save-btn');
    scriptNameEl = document.getElementById('script-name');
    scriptAuthorEl = document.getElementById('script-author');
    townsfolkRoles = document.getElementById('townsfolk-roles');
    outsiderRoles = document.getElementById('outsider-roles');
    minionRoles = document.getElementById('minion-roles');
    demonRoles = document.getElementById('demon-roles');
}

// Get the appropriate team container
function getTeamContainer(team) {
    if (team === 'townsfolk') return townsfolkRoles;
    if (team === 'outsider') return outsiderRoles;
    if (team === 'minion') return minionRoles;
    if (team === 'demon') return demonRoles;
    return townsfolkRoles; // default fallback
}

// Download a file
function downloadFile(filename, content) {
    const blob = new Blob([content], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Validate JSON
function validateJSON(jsonString) {
    try {
        JSON.parse(jsonString);
        return true;
    } catch (e) {
        return false;
    }
}

// Clear all role containers
function clearRoleContainers() {
    townsfolkRoles.innerHTML = '';
    outsiderRoles.innerHTML = '';
    minionRoles.innerHTML = '';
    demonRoles.innerHTML = '';
}

// Update script header with metadata
function updateScriptHeader(meta) {
    scriptNameEl.textContent = meta.name || "Custom Script";
    scriptAuthorEl.textContent = meta.author ? `by ${meta.author}` : "A custom script for Blood on the Clocktower";
}

// Create a role card with image support
function createRoleCard(id, role) {
    const card = document.createElement('div');
    card.className = 'role-card';

    // Create image container
    const imageContainer = document.createElement('div');
    imageContainer.className = 'card-image';
    
    // Create image element
    const img = document.createElement('img');
    img.className = 'role-image';
    img.alt = role?.name || 'Role icon';
    
    // Try to load specialized version (TF format first)
    const nameForImage = role?.name?.replace(/'/g, '') || '';
    // img.src = `img/Icon_${nameForImage}.png`; // id better
    
    // Fallback to ID-based image if name-based image fails
    img.onerror = function() {
        this.src = `img/Icon_${id}.png`;
        
        // If ID-based image also fails, show fallback content
        this.onerror = function() {
            img.remove();
            const icon = roleIcons[id] || (role?.name ? role.name.charAt(0) : '?');
            imageContainer.textContent = icon;
            imageContainer.style.fontSize = "36px";
        };
    };
    
    imageContainer.appendChild(img);
    
    // Create content container
    const contentContainer = document.createElement('div');
    contentContainer.className = 'card-content';
    
    const nameElement = document.createElement('div');
    nameElement.className = 'role-name';
    nameElement.textContent = role?.name || `Unknown Role (${id})`;
    
    const abilityElement = document.createElement('div');
    abilityElement.className = 'role-ability';
    abilityElement.textContent = role?.ability || 
                               `Role data not available. Check your JSON input or contact support.`;
    
    contentContainer.appendChild(nameElement);
    contentContainer.appendChild(abilityElement);
    
    // Build card structure
    card.appendChild(imageContainer);
    card.appendChild(contentContainer);
    
    return card;
}

// Load role database from JSON file
async function loadRoleDatabase() {
    try {
        const response = await fetch('roles/roles.json');
        const roles = await response.json();
        
        return roles.reduce((db, role) => {
            db[role.id] = role;
            return db;
        }, {});
    } catch (error) {
        console.error('Error loading role data:', error);
        return {};
    }
}

// Generate role cards from script
async function generateRoleCards() {
    if (!validateJSON(roleJsonTextarea.value)) {
        alert('Invalid JSON format. Please check your input.');
        return;
    }

    try {
        clearRoleContainers();

        const config = JSON.parse(roleJsonTextarea.value);
        const roleDatabase = await loadRoleDatabase();
        let meta = {};

        // Process the configuration
        const roles = [];
        for (const item of config) {
            if (typeof item === 'object' && item.id === "_meta") {
                meta = item;
            } else {
                // Handle both string and object formats
                const id = typeof item === 'string' ? item : (item && item.id);
                if (id) {
                    roles.push(id);
                }
            }
        }

        // Update UI with metadata
        updateScriptHeader(meta);

        // Create cards for each role
        roles.forEach(roleId => {
            const role = roleDatabase[roleId];
            const team = role?.team;
            const teamContainer = getTeamContainer(team);
            
            // Create the role card
            const roleCard = createRoleCard(roleId, role);

            // Append to the appropriate team container
            if (teamContainer) {
                teamContainer.appendChild(roleCard);
            } else {
                // Fallback to townsfolk if no team container found
                townsfolkRoles.appendChild(roleCard);
            }
        });

    } catch (error) {
        console.error('Error generating role cards:', error);
        alert('An error occurred while processing your script: ' + error.message);
    }
}

// Initialize event listeners
function initEventListeners() {
    generateBtn.addEventListener('click', generateRoleCards);
    printBtn.addEventListener('click', () => window.print());
    saveBtn.addEventListener('click', () => {
        downloadFile('botc-script.json', roleJsonTextarea.value);
    });
}

// Initialize application
function initializeApp() {
    cacheDOMElements();
    initEventListeners();
    generateRoleCards(); // Generate cards on initial load
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initializeApp);