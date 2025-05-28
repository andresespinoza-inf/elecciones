document.addEventListener('DOMContentLoaded', function() {
    // Verificar si el usuario está logueado
    const usuario = JSON.parse(localStorage.getItem('usuarioActual'));
    if (!usuario) {
        window.location.href = 'login.html';
        return;
    }
    
    // Obtener candidatos de localStorage
    const candidatos = JSON.parse(localStorage.getItem('candidatosElecciones')) || [];
    
    // Obtener votos de localStorage
    const votosGuardados = localStorage.getItem('votosElecciones');
    const votos = votosGuardados ? JSON.parse(votosGuardados) : [];
    
    // Configurar evento para el botón de actualizar
    document.getElementById('actualizarBtn').addEventListener('click', function() {
        location.reload();
    });
    
    // Procesar resultados
    const resultados = calcularResultados(votos, candidatos);
    
    // Mostrar estadísticas
    mostrarEstadisticas(resultados);
    mostrarTablaResultados(resultados);
    mostrarGrafico(resultados);
    
    // Mostrar último voto registrado si es del usuario actual
    mostrarUltimoVoto(usuario, votos);
});

// Calcular resultados a partir del array de votos
function calcularResultados(votos, candidatos) {
    const resultados = {
        total: votos.length,
        validos: votos.filter(v => v !== null).length,
        porCandidato: {}
    };
    
    // Inicializar contadores para cada candidato
    candidatos.forEach(c => {
        resultados.porCandidato[c.id] = {
            nombre: c.presidente,
            vice: c.vicepresidente,
            partido: c.partido,
            color: c.color,
            votos: 0,
            porcentaje: 0
        };
    });
    
    // Contar votos por candidato (ignorar votos null)
    votos.forEach(voto => {
        if (voto !== null && voto.candidatoId) {
            if (resultados.porCandidato[voto.candidatoId]) {
                resultados.porCandidato[voto.candidatoId].votos++;
            }
        }
    });
    
    // Calcular porcentajes
    Object.keys(resultados.porCandidato).forEach(id => {
        const candidato = resultados.porCandidato[id];
        candidato.porcentaje = resultados.validos > 0 ? 
            ((candidato.votos / resultados.validos) * 100).toFixed(2) : 0;
    });
    
    return resultados;
}

// Mostrar estadísticas generales
function mostrarEstadisticas(resultados) {
    document.getElementById('totalVotos').textContent = resultados.total;
    document.getElementById('votosValidos').textContent = resultados.validos;
    document.getElementById('participacion').textContent = 
        ((resultados.validos / resultados.total) * 100).toFixed(2) + '%';
}

// Mostrar tabla de resultados
function mostrarTablaResultados(resultados) {
    const tbody = document.getElementById('resultadosTable');
    tbody.innerHTML = '';
    
    // Ordenar candidatos por cantidad de votos (de mayor a menor)
    const candidatosOrdenados = Object.values(resultados.porCandidato).sort((a, b) => b.votos - a.votos);
    
    candidatosOrdenados.forEach(c => {
        const tr = document.createElement('tr');
        tr.className = 'fade-in';
        
        tr.innerHTML = `
            <td>
                <strong>${c.nombre}</strong><br>
                <small class="text-muted">${c.partido}</small>
            </td>
            <td>${c.votos}</td>
            <td>${c.porcentaje}%</td>
            <td>
                <div class="progress">
                    <div class="progress-bar" role="progressbar" 
                         style="width: ${c.porcentaje}%; background-color: ${c.color}" 
                         aria-valuenow="${c.porcentaje}" 
                         aria-valuemin="0" 
                         aria-valuemax="100">
                    </div>
                </div>
            </td>
        `;
        
        tbody.appendChild(tr);
    });
}

// Mostrar gráfico de pastel con Chart.js
function mostrarGrafico(resultados) {
    const ctx = document.getElementById('resultadosChart').getContext('2d');
    
    // Preparar datos para el gráfico
    const labels = [];
    const data = [];
    const backgroundColors = [];
    const borderColors = [];
    
    // Filtrar candidatos con votos y ordenar por cantidad de votos
    const candidatosConVotos = Object.values(resultados.porCandidato)
        .filter(c => c.votos > 0)
        .sort((a, b) => b.votos - a.votos);
    
    candidatosConVotos.forEach(c => {
        labels.push(`${c.nombre} (${c.porcentaje}%)`);
        data.push(c.votos);
        backgroundColors.push(c.color);
        borderColors.push('#ffffff');
    });
    
    // Crear el gráfico
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: backgroundColors,
                borderColor: borderColors,
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        font: {
                            size: 12
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.label}: ${context.raw} votos`;
                        }
                    }
                }
            },
            animation: {
                animateScale: true,
                animateRotate: true
            }
        }
    });
}
// Función para mostrar el último voto del usuario
function mostrarUltimoVoto(usuario, votos) {
    // Buscar el último voto del usuario actual
    const votosUsuario = votos.filter(v => v !== null && v.usuarioId === usuario.ci);
    
    if (votosUsuario.length > 0) {
        // Ordenar por fecha (más reciente primero)
        votosUsuario.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
        const ultimoVoto = votosUsuario[0];
        
        // Obtener candidato
        const candidatos = JSON.parse(localStorage.getItem('candidatosElecciones')) || [];
        const candidatoVotado = candidatos.find(c => c.id === ultimoVoto.candidatoId);
        
        if (candidatoVotado) {
            const fechaVoto = new Date(ultimoVoto.fecha);
            const opcionesFecha = { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                timeZone: 'America/La_Paz'
            };
            
            const ultimoVotoDiv = document.createElement('div');
            ultimoVotoDiv.className = 'card mt-4 border-success';
            ultimoVotoDiv.innerHTML = `
                <div class="card-header bg-success text-white">
                    <h5 class="mb-0"><i class="fas fa-user-check me-2"></i>Tu último voto</h5>
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-8">
                            <p class="mb-1"><strong>Candidato:</strong> ${candidatoVotado.presidente}</p>
                            <p class="mb-1"><strong>Partido:</strong> ${candidatoVotado.partido}</p>
                            <p class="mb-0"><strong>Fecha:</strong> ${fechaVoto.toLocaleString('es-BO', opcionesFecha)}</p>
                        </div>
                        <div class="col-md-4 text-end">
                            <span class="badge bg-success p-2">
                                <i class="fas fa-vote-yea fa-2x"></i>
                            </span>
                        </div>
                    </div>
                </div>
            `;
            
            // Insertar después del resumen de votación
            const resumenCard = document.querySelector('.card.mb-5');
            if (resumenCard) {
                resumenCard.parentNode.insertBefore(ultimoVotoDiv, resumenCard.nextSibling);
            }
        }
    }
}