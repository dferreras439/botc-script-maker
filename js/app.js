// DOM Elements
const roleJsonTextarea = document.getElementById('role-json');
const generateBtn = document.getElementById('generate-btn');
const printBtn = document.getElementById('print-btn');
const saveBtn = document.getElementById('save-btn');
const scriptNameEl = document.getElementById('script-name');
const scriptAuthorEl = document.getElementById('script-author');

// Team container elements
const townsfolkRoles = document.getElementById('townsfolk-roles');
const outsiderRoles = document.getElementById('outsider-roles');
const minionRoles = document.getElementById('minion-roles');
const demonRoles = document.getElementById('demon-roles');

// Simple role icons (first letter fallback)
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

// Fetch role data from JSON file
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

// Generate role cards organized by team
async function generateRoleCards() {
    try {
        // Clear all role containers
        townsfolkRoles.innerHTML = '';
        outsiderRoles.innerHTML = '';
        minionRoles.innerHTML = '';
        demonRoles.innerHTML = '';
        
        // Parse JSON input
        const roleConfig = JSON.parse(roleJsonTextarea.value);
        
        // Extract metadata
        let meta = {};
        const roleIds = [...roleConfig]; // create a copy
        const metaIndex = roleIds.findIndex(item => item.id === "_meta");
        
        if (metaIndex !== -1) {
            meta = roleIds.splice(metaIndex, 1)[0];
        }
        
        // Update script header
        scriptNameEl.textContent = meta.name || "Custom Script";
        scriptAuthorEl.textContent = meta.author ? `by ${meta.author}` : "A custom script for Blood on the Clocktower";
        
        // Load role database
        const roleDatabase = await loadRoleDatabase();
        
        // Process role IDs
        roleIds.forEach(roleId => {
            // Handle both string and object formats
            const id = typeof roleId === 'string' ? roleId : roleId.id;
            const role = roleDatabase[id];
            const team = role ? role.team : null;
            
            // Get the team container
            const container = getTeamContainer(team);
            
            if (role) {
                const roleCard = document.createElement('div');
                roleCard.className = 'role-card';
                
                roleCard.innerHTML = `
                    <div class="card-image">
                        ${roleIcons[id] || role.name.charAt(0).toUpperCase()}
                    </div>
                    <div class="card-content">
                        <div class="role-name">${role.name}</div>
                        <div class="role-ability">${role.ability}</div>
                    </div>
                `;
                
                container.appendChild(roleCard);
            } else {
                const errorCard = document.createElement('div');
                errorCard.className = 'role-card';
                errorCard.innerHTML = `
                    <div class="card-image">❓</div>
                    <div class="card-content">
                        <div class="role-name">Unknown Role</div>
                        <div class="role-ability">Role ID not found in database: ${id}</div>
                    </div>
                `;
                
                townsfolkRoles.appendChild(errorCard);
            }
        });
    } catch (error) {
        alert('Invalid JSON format. Please check your input.');
        console.error(error);
    }
}

// Helper to get team container
function getTeamContainer(team) {
    switch(team) {
        case 'townsfolk': return townsfolkRoles;
        case 'outsider': return outsiderRoles;
        case 'minion': return minionRoles;
        case 'demon': return demonRoles;
        default: return townsfolkRoles;
    }
}

// Event Listeners
generateBtn.addEventListener('click', generateRoleCards);
printBtn.addEventListener('click', () => window.print());
saveBtn.addEventListener('click', () => {
    const dataStr = "data:text/json;charset=utf-8," + 
                   encodeURIComponent(roleJsonTextarea.value);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "botc-script.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
});

// Initialize
document.addEventListener('DOMContentLoaded', generateRoleCards);