// Simulación de base de datos de usuarios
let usuariosRegistrados = JSON.parse(localStorage.getItem('usuariosRegistrados')) || [];

// Función para registrar un nuevo usuario
function registrarUsuario(usuario) {
    // Verificar si el usuario ya existe
    const existe = usuariosRegistrados.some(u => u.email === usuario.email || u.ci === usuario.ci);
    
    if (!existe) {
        usuariosRegistrados.push(usuario);
        localStorage.setItem('usuariosRegistrados', JSON.stringify(usuariosRegistrados));
        localStorage.setItem('usuarioActual', JSON.stringify(usuario));
        
        // Guardar candidatos en localStorage para estadísticas
        localStorage.setItem('candidatosElecciones', JSON.stringify(candidatos));
        
        return true;
    }
    return false;
}

// Función para autenticar usuario
function autenticarUsuario(email, ci) {
    const usuario = usuariosRegistrados.find(u => u.email === email && u.ci === ci);
    
    if (usuario) {
        localStorage.setItem('usuarioActual', JSON.stringify(usuario));
        return true;
    }
    return false;
}

// Función para obtener el usuario actual
function obtenerUsuarioActual() {
    return JSON.parse(localStorage.getItem('usuarioActual'));
}

// Función para cerrar sesión
function cerrarSesion() {
    localStorage.removeItem('usuarioActual');
}

// Manejar el formulario de registro
document.addEventListener('DOMContentLoaded', function() {
    const registroForm = document.getElementById('registroForm');
    
    if (registroForm) {
        registroForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const usuario = {
                ci: document.getElementById('ci').value,
                expedido: document.getElementById('expedido').value,
                nombres: document.getElementById('nombres').value,
                apellidos: document.getElementById('apellidos').value,
                email: document.getElementById('email').value,
                telefono: document.getElementById('telefono').value,
                departamento: document.getElementById('departamento').value,
                nacimiento: document.getElementById('nacimiento').value,
                fechaRegistro: new Date().toISOString()
            };
            
            if (registrarUsuario(usuario)) {
                alert('Registro exitoso. Será redirigido a la página de votación.');
                window.location.href = 'elecciones.html';
            } else {
                alert('El usuario ya está registrado. Por favor inicie sesión.');
            }
        });
    }
    
    // Manejar el formulario de login
    const loginForm = document.getElementById('loginForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const ci = document.getElementById('password').value;
            
            if (autenticarUsuario(email, ci)) {
                window.location.href = 'elecciones.html';
            } else {
                alert('Credenciales incorrectas. Por favor verifique su correo y cédula.');
            }
        });
    }
    
    // Mostrar información del usuario en elecciones.html
    const nombreUsuario = document.getElementById('nombreUsuario');
    if (nombreUsuario) {
        const usuario = obtenerUsuarioActual();
        if (usuario) {
            nombreUsuario.textContent = `${usuario.nombres} ${usuario.apellidos}`;
        } else {
            window.location.href = 'login.html';
        }
    }
});