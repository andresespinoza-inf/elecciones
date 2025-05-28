// Datos de los binomios presidenciales (10 candidatos)
const candidatos = [
    {
        id: 1,
        presidente: "Luis Arce Catacora",
        vicepresidente: "David Choquehuanca Céspedes",
        partido: "Movimiento al Socialismo (MAS)",
        imagen: "img/Luis_Arce.jpg",
        color: "#E74C3C"
    },
    {
        id: 2,
        presidente: "Carlos Mesa Gisbert",
        vicepresidente: "Gustavo Pedraza",
        partido: "Comunidad Ciudadana (CC)",
        imagen: "img/Carlos_Mesa.jpg",
        color: "#3498DB"
    },
    {
        id: 3,
        presidente: "Luis Fernando Camacho",
        vicepresidente: "Marco Antonio Pumari",
        partido: "Creemos",
        imagen: "img/Luis_Camacho.png",
        color: "#F1C40F"
    },
    {
        id: 4,
        presidente: "Chi Hyun Chung",
        vicepresidente: "Vilma Plata",
        partido: "Partido Demócrata Cristiano (PDC)",
        imagen: "img/Chi.png",
        color: "#2ECC71"
    },
    {
        id: 5,
        presidente: "Simón Reyes",
        vicepresidente: "Lidia Patty",
        partido: "Frente para la Victoria (FPV)",
        imagen: "img/Simon_Reyes.jpg",
        color: "#9B59B6"
    },
    {
        id: 6,
        presidente: "Félix Patzi",
        vicepresidente: "Ruth Nina",
        partido: "Movimiento Tercer Sistema (MTS)",
        imagen: "img/Felix_Patzi.jpg",
        color: "#1ABC9C"
    },
    {
        id: 7,
        presidente: "Jhonny Fernández",
        vicepresidente: "José Luis Camacho",
        partido: "Bolivia Dice No (BDN)",
        imagen: "img/Jhonny_Fernandez.jpg",
        color: "#E67E22"
    },
    {
        id: 8,
        presidente: "Jorge Quiroga",
        vicepresidente: "Carmen Ledo",
        partido: "Partido Demócrata (PD)",
        imagen: "img/Tuto_Quiroga.jpg",
        color: "#34495E"
    },
    {
        id: 9,
        presidente: "María de la Cruz Bayá",
        vicepresidente: "Juan Carlos Rojas",
        partido: "Unidad Nacional (UN)",
        imagen: "img/Maria_Baya.jpg",
        color: "#D35400"
    },
    {
        id: 10,
        presidente: "Víctor Hugo Cárdenas",
        vicepresidente: "Ninoska Lazarte",
        partido: "Movimiento Nacionalista Revolucionario (MNR)",
        imagen: "img/Víctor_Hugo_Cárdenas.jpg",
        color: "#16A085"
    }
];

// Guardar candidatos en localStorage para estadísticas
localStorage.setItem('candidatosElecciones', JSON.stringify(candidatos));

// Array para almacenar los votos (20 elementos)
let votos = [];

// Candidato seleccionado para votar
let candidatoSeleccionado = null;

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    // Verificar si el usuario está logueado
    const usuario = JSON.parse(localStorage.getItem('usuarioActual'));
    if (!usuario) {
        window.location.href = 'login.html';
        return;
    }
    
    cargarCandidatos();
    inicializarVotos();
    
    // Configurar evento para el botón de confirmar voto en el modal
    document.getElementById('confirmarVoto').addEventListener('click', confirmarVoto);
});

// Cargar los candidatos en la página
function cargarCandidatos() {
    const container = document.getElementById('candidatos-container');
    container.innerHTML = '';
    
    candidatos.forEach(candidato => {
        const col = document.createElement('div');
        col.className = 'col-md-3 col-sm-6 mb-4';
        
        col.innerHTML = `
            <div class="card candidato-card h-100">
                <img src="${candidato.imagen}" class="card-img-top candidato-img" alt="${candidato.presidente}">
                <div class="card-body candidato-info text-center">
                    <h5 class="card-title">${candidato.presidente}</h5>
                    <p class="card-text text-muted"><small>Vicepresidente: ${candidato.vicepresidente}</small></p>
                    <p class="card-text"><strong>${candidato.partido}</strong></p>
                    <button class="btn btn-primary btn-votar" data-id="${candidato.id}">
                        <i class="fas fa-vote-yea me-2"></i>Votar
                    </button>
                </div>
            </div>
        `;
        
        container.appendChild(col);
    });
    
    // Agregar eventos a los botones de votar
    document.querySelectorAll('.btn-votar').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = parseInt(this.getAttribute('data-id'));
            prepararVoto(id);
        });
    });
}

// Inicializar el array de votos con valores aleatorios
function inicializarVotos() {
    // Obtener votos existentes o crear nuevos
    const votosGuardados = localStorage.getItem('votosElecciones');
    
    if (votosGuardados) {
        votos = JSON.parse(votosGuardados);
    } else {
        // Limpiar el array
        votos = [];
        
        // Generar 10 votos aleatorios (simulando votantes previos)
        for (let i = 0; i < 10; i++) {
            const randomIndex = Math.floor(Math.random() * candidatos.length);
            votos.push({
                candidatoId: candidatos[randomIndex].id,
                usuarioId: 'sistema-' + i,
                fecha: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)).toISOString()
            });
        }
        
        // Generar 10 votos aleatorios recientes
        for (let i = 0; i < 10; i++) {
            const randomIndex = Math.floor(Math.random() * candidatos.length);
            votos.push({
                candidatoId: candidatos[randomIndex].id,
                usuarioId: 'sistema-' + (i + 10),
                fecha: new Date().toISOString()
            });
        }
        
        // Guardar en localStorage
        localStorage.setItem('votosElecciones', JSON.stringify(votos));
        
        // Guardar candidatos en localStorage para estadísticas
        localStorage.setItem('candidatosElecciones', JSON.stringify(candidatos));
    }
}
// Preparar el voto mostrando el modal de confirmación
function prepararVoto(id) {
    candidatoSeleccionado = candidatos.find(c => c.id === id);
    
    const modalBody = document.getElementById('confirmacionModalBody');
    modalBody.innerHTML = `
        <p>¿Estás seguro de votar por el binomio presidencial:</p>
        <div class="text-center my-3">
            <h4>${candidatoSeleccionado.presidente}</h4>
            <p class="mb-1"><small>y</small></p>
            <h5>${candidatoSeleccionado.vicepresidente}</h5>
            <p class="mt-2"><strong>${candidatoSeleccionado.partido}</strong></p>
        </div>
        <p class="text-muted"><small>Tu voto es secreto y no podrás cambiarlo después.</small></p>
    `;
    
    // Mostrar el modal
    const modal = new bootstrap.Modal(document.getElementById('confirmacionModal'));
    modal.show();
}

// Confirmar el voto y guardarlo
function confirmarVoto() {
    if (!candidatoSeleccionado) return;
    
    const usuario = JSON.parse(localStorage.getItem('usuarioActual'));
    if (!usuario) {
        alert('Debe iniciar sesión para votar');
        window.location.href = 'login.html';
        return;
    }
    
    // Buscar un espacio null en el array para guardar el voto
    const index = votos.findIndex(v => v === null);
    
    if (index !== -1) {
        const fechaVoto = new Date().toISOString();
        
        votos[index] = {
            candidatoId: candidatoSeleccionado.id,
            usuarioId: usuario.ci,
            fecha: fechaVoto
        };
        
        // Actualizar localStorage
        localStorage.setItem('votosElecciones', JSON.stringify(votos));
        
        // Guardar el voto del usuario para mostrar en el ticket
        localStorage.setItem('ultimoVoto', JSON.stringify({
            candidato: candidatoSeleccionado,
            usuario: usuario,
            fecha: fechaVoto
        }));
        
        // Redirigir al ticket
        window.location.href = 'ticket.html';
        
        // Cerrar el modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('confirmacionModal'));
        modal.hide();
    } else {
        alert("No hay más espacio para votos en esta simulación.");
    }
}