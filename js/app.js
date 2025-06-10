// DOM Elements
const roleJsonTextarea = document.getElementById('role-json');
const generateBtn = document.getElementById('generate-btn');
const printBtn = document.getElementById('print-btn');
const saveBtn = document.getElementById('save-btn');

// Team containers
const townsfolkRoles = document.getElementById('townsfolk-roles');
const outsiderRoles = document.getElementById('outsider-roles');
const minionRoles = document.getElementById('minion-roles');
const demonRoles = document.getElementById('demon-roles');

// Fetch role data
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
        
        // Parse JSON input and load database
        const roleConfig = JSON.parse(roleJsonTextarea.value);
        const roleDatabase = await loadRoleDatabase();
        
        const teamCounts = {
            townsfolk: 0,
            outsider: 0,
            minion: 0,
            demon: 0
        };
        
        const placeholderTexts = {
            townsfolk: "Townsfolk placeholders are used when additional roles are needed",
            outsider: "Outsider placeholders for additional roles",
            minion: "Minion placeholders fill empty spots",
            demon: "Demon placeholders complete the team"
        };
        
        // Create cards for each role
        roleConfig.forEach(roleConfig => {
            const roleId = roleConfig.id;
            const role = roleDatabase[roleId];
            const team = role ? role.team : 'unknown';
            
            // Track team counts
            if (teamCounts.hasOwnProperty(team)) {
                teamCounts[team]++;
            }
            
            let cardContent = '';
            
            if (role) {
                cardContent = `
                    <div class="card-image">${roleIcons[roleId] || role.name.charAt(0)}</div>
                    <div class="card-content">
                        <div class="role-name">${role.name}</div>
                        <div class="role-ability">${role.ability}</div>
                    </div>
                `;
            } else {
                cardContent = `
                    <div class="card-image">❓</div>
                    <div class="card-content">
                        <div class="role-name">Unknown: ${roleId}</div>
                        <div class="role-ability">Role not found in database</div>
                    </div>
                `;
            }
            
            // Create and append card based on team
            const roleCard = document.createElement('div');
            roleCard.className = 'role-card';
            roleCard.innerHTML = cardContent;
            
            switch(team) {
                case 'townsfolk':
                    townsfolkRoles.appendChild(roleCard);
                    break;
                case 'outsider':
                    outsiderRoles.appendChild(roleCard);
                    break;
                case 'minion':
                    minionRoles.appendChild(roleCard);
                    break;
                case 'demon':
                    demonRoles.appendChild(roleCard);
                    break;
                default:
                    // Add to townsfolk as a fallback
                    townsfolkRoles.appendChild(roleCard);
            }
        });
        
        // Add placeholders to teams with fewer roles
        const MIN_ROLES_PER_TEAM = 4;
        
        Object.entries(teamCounts).forEach(([team, count]) => {
            if (count < MIN_ROLES_PER_TEAM) {
                const container = getTeamContainer(team);
                const needed = MIN_ROLES_PER_TEAM - count;
                
                for (let i = 0; i < needed; i++) {
                    const placeholder = document.createElement('div');
                    placeholder.className = 'role-card placeholder';
                    
                    placeholder.innerHTML = `
                        <div class="card-image">${team.charAt(0).toUpperCase()}</div>
                        <div class="card-content">
                            <div class="role-name">${team.charAt(0).toUpperCase() + team.slice(1)} Placeholder</div>
                            <div class="role-ability">${placeholderTexts[team]}</div>
                        </div>
                    `;
                    
                    container.appendChild(placeholder);
                }
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
        default: return townsfolkRoles; // default fallback
    }
}

// Icon mapping (simpler version used only as fallback in placeholders)
const roleIcons = {
    washerwoman: "👚",
    librarian: "📚",
    investigator: "🔍",
    chef: "👨‍🍳",
    empath: "💖",
    fortune_teller: "🔮",
    undertaker: "⚰️",
    monk: "🧘",
    ravenkeeper: "🐦",
    virgin: "💃",
    slayer: "🏹",
    soldier: "🪖",
    mayor: "🎖️",
    butler: "🧑‍🍳",
    drunk: "🍺",
    recluse: "🏚️",
    saint: "😇",
    poisoner: "🧪",
    spy: "🕵️",
    scarlet_woman: "💃",
    baron: "🎩",
    imp: "😈"
};

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