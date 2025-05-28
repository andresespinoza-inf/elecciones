document.addEventListener('DOMContentLoaded', function() {
    // Obtener datos del último voto
    const votoData = JSON.parse(localStorage.getItem('ultimoVoto'));
    
    if (!votoData) {
        alert('No se encontraron datos de votación. Será redirigido a la página de elecciones.');
        window.location.href = 'elecciones.html';
        return;
    }
    
    const { candidato, usuario, fecha } = votoData;
    const fechaVoto = new Date(fecha);
    
    // Formatear fecha y hora
    const opcionesFecha = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        timeZone: 'America/La_Paz'
    };
    
    const opcionesHora = {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZone: 'America/La_Paz'
    };
    
    // Mostrar datos en el ticket
    document.getElementById('ticketNombre').textContent = `${usuario.nombres} ${usuario.apellidos}`;
    document.getElementById('ticketCI').textContent = `${usuario.ci} ${usuario.expedido}`;
    document.getElementById('ticketDepto').textContent = usuario.departamento;
    document.getElementById('ticketFecha').textContent = fechaVoto.toLocaleDateString('es-BO', opcionesFecha);
    document.getElementById('ticketHora').textContent = fechaVoto.toLocaleTimeString('es-BO', opcionesHora);
    document.getElementById('ticketCodigo').textContent = `V-${usuario.ci.slice(-4)}-${Date.now().toString().slice(-4)}`;
    document.getElementById('ticketCandidato').textContent = candidato.presidente;
    document.getElementById('ticketVice').textContent = candidato.vicepresidente;
    document.getElementById('ticketPartido').textContent = candidato.partido;
});