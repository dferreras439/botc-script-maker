// Fetch roles from JSON
fetch('roles/roles.json')
  .then(response => response.json())
  .then(roles => {
    const roleList = document.getElementById('role-list');
    roles.forEach(role => {
      const roleEl = document.createElement('div');
      roleEl.className = `role-card ${role.team}`;
      roleEl.innerHTML = `
        <span class="symbol">${role.symbol}</span>
        <h3>${role.name}</h3>
        <p>${role.ability}</p>
      `;
      roleEl.addEventListener('click', () => addToScript(role.id));
      roleList.appendChild(roleEl);
    });
  });