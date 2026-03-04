let docentes = JSON.parse(localStorage.getItem('ie_docentes')) || [];
let asignaturas = JSON.parse(localStorage.getItem('ie_asignaturas')) || [];


function nav(view) {
    document.querySelectorAll('.page-view').forEach(v => v.classList.remove('active'));
    document.querySelectorAll('.menu-item').forEach(m => m.classList.remove('active'));
    
    document.getElementById(`sec-${view}`).classList.add('active');
    document.getElementById('page-title').innerText = view.charAt(0).toUpperCase() + view.slice(1);
    
    if(window.innerWidth < 768) toggleSidebar();
    if(view === 'docentes') renderDocentes();
    if(view === 'asignaturas') renderAsignaturas();
    updateStats();
}

function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('open');
}


function notify(msg) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="fas fa-check-circle"></i> ${msg}`;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}


document.getElementById('docente-form').onsubmit = function(e) {
    e.preventDefault();
    const doc = {
        nombre: document.getElementById('d-nombre').value,
        id: document.getElementById('d-id').value,
        especialidad: document.getElementById('d-especialidad').value
    };
    
    docentes.push(doc);
    save();
    notify("Docente registrado correctamente");
    closeModal('modal-docente');
    this.reset();
    renderDocentes();
};

function renderDocentes(data = docentes) {
    const lista = document.getElementById('lista-docentes');
    lista.innerHTML = '';
    data.forEach((d, i) => {
        lista.innerHTML += `
            <tr>
                <td data-label="Docente"><strong>${d.nombre}</strong></td>
                <td data-label="ID">${d.id}</td>
                <td data-label="Especialidad"><span class="pill">${d.especialidad}</span></td>
                <td data-label="Acciones">
                    <button class="btn-ghost" onclick="deleteDocente(${i})"><i class="fas fa-trash text-danger"></i></button>
                </td>
            </tr>
        `;
    });
}

function deleteDocente(i) {
    if(confirm('¿Eliminar registro?')) {
        docentes.splice(i, 1);
        save();
        renderDocentes();
        notify("Registro eliminado");
    }
}


function renderAsignaturas() {
    const grid = document.getElementById('lista-materias');
    const selectDoc = document.getElementById('m-docente');
    
    grid.innerHTML = '';
    selectDoc.innerHTML = '<option value="">Seleccionar Docente Responsable</option>';

    docentes.forEach(d => {
        selectDoc.innerHTML += `<option value="${d.nombre}">${d.nombre}</option>`;
    });

    asignaturas.forEach((asig, i) => {
        grid.innerHTML += `
            <div class="glass-card stat">
                <div>
                    <h4>${asig.nombre}</h4>
                    <p>${asig.grado}</p>
                    <small><i class="fas fa-user-tie"></i> ${asig.docente}</small>
                </div>
                <button class="btn-ghost" onclick="deleteAsig(${i})"><i class="fas fa-times"></i></button>
            </div>
        `;
    });
}

document.getElementById('materia-form').onsubmit = function(e) {
    e.preventDefault();
    asignaturas.push({
        nombre: document.getElementById('m-nombre').value,
        grado: document.getElementById('m-grado').value,
        docente: document.getElementById('m-docente').value
    });
    save();
    closeModal('modal-materia');
    renderAsignaturas();
    notify("Asignatura vinculada");
};

function deleteAsig(i) {
    asignaturas.splice(i, 1);
    save();
    renderAsignaturas();
}


function save() {
    localStorage.setItem('ie_docentes', JSON.stringify(docentes));
    localStorage.setItem('ie_asignaturas', JSON.stringify(asignaturas));
    updateStats();
}

function updateStats() {
    document.getElementById('stat-doc').innerText = docentes.length;
    document.getElementById('stat-asig').innerText = asignaturas.length;
}

function openModal(id) { 
    document.getElementById(id).style.display = 'grid'; 
    if(id === 'modal-materia') renderAsignaturas();
}

function closeModal(id) { document.getElementById(id).style.display = 'none'; }

function searchDocente(query) {
    const filtrados = docentes.filter(d => 
        d.nombre.toLowerCase().includes(query.toLowerCase()) || 
        d.id.includes(query)
    );
    renderDocentes(filtrados);
}

function renderDocentes(data = docentes) {
    const lista = document.getElementById('lista-docentes');
    lista.innerHTML = '';
    data.forEach((d, i) => {
        lista.innerHTML += `
            <tr>
                <td data-label="Docente"><strong>${d.nombre}</strong></td>
                <td data-label="ID">${d.id}</td>
                <td data-label="Especialidad"><span class="pill">${d.especialidad}</span></td>
                <td data-label="Acciones">
                    <button class="btn-danger-light" onclick="deleteDocente(${i})">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </td>
            </tr>
        `;
    });
}


window.onload = updateStats;