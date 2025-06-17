// --- Funciones para manejar usuarios en localStorage ---
const getUsuarios = () => JSON.parse(localStorage.getItem("usuarios") || "[]");
const setUsuarios = (data) => localStorage.setItem("usuarios", JSON.stringify(data));

// --- Validadores ---
const validarCedula = (cedula) => {
  // Ejemplos válidos: 8-1234-5678 o E-1-1234-5678
  const regex = /^(?:[1-9]-\d{4}-\d{4}|E-\d-\d{4}-\d{4})$/i;
  return regex.test(cedula);
};

const validarEmail = (email) => {
  // Validación simple, que contenga '@' y algo después
  return /\S+@\S+\.\S+/.test(email);
};

const validarPassword = (password) => {
  return password.length >= 6;
};

// --- REGISTRO ---
const registroForm = document.getElementById("registroForm");
if (registroForm) {
  registroForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const cedula = document.getElementById("cedula").value.trim().toUpperCase();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    const registroMsg = document.getElementById("registroMsg");
    registroMsg.textContent = "";
    registroMsg.className = "error-message";

    // Validaciones
    if (!nombre) {
      registroMsg.textContent = "El nombre es obligatorio.";
      return;
    }
    if (!validarCedula(cedula)) {
      registroMsg.textContent = "Cédula inválida. Ejemplo válido: 8-1234-5678 o E-1-1234-5678";
      return;
    }
    if (!validarEmail(email)) {
      registroMsg.textContent = "Email inválido.";
      return;
    }
    if (!validarPassword(password)) {
      registroMsg.textContent = "La contraseña debe tener al menos 6 caracteres.";
      return;
    }

    let usuarios = getUsuarios();
    if (usuarios.find(u => u.cedula === cedula || u.email.toLowerCase() === email.toLowerCase())) {
      registroMsg.textContent = "Cédula o email ya registrado.";
      return;
    }

    usuarios.push({ nombre, cedula, email, password });
    setUsuarios(usuarios);

    registroMsg.className = "success-message";
    registroMsg.textContent = "¡Registro exitoso!";
    registroForm.reset();
  });
}

// --- LOGIN ---
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const cedula = document.getElementById("cedula").value.trim().toUpperCase();
    const password = document.getElementById("password").value;
    const loginMsg = document.getElementById("loginMsg");
    loginMsg.textContent = "";
    loginMsg.className = "error-message";

    const usuarios = getUsuarios();
    const user = usuarios.find(
      (u) => u.cedula === cedula && u.password === password
    );

    if (user) {
      loginMsg.className = "success-message";
      loginMsg.textContent = "Inicio exitoso.";
      localStorage.setItem("usuarioActual", JSON.stringify(user));
      setTimeout(() => {
        window.location.href = "home.html";
      }, 1000);
    } else {
      loginMsg.textContent = "Cédula o contraseña incorrecta.";
    }
  });
}

// --- RECUPERAR/CAMBIO DE CONTRASEÑA ---
const recuperarForm = document.getElementById("recuperarForm");
if (recuperarForm) {
  recuperarForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const cedula = document.getElementById("cedula").value.trim().toUpperCase();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const confirmPassword = document.getElementById("confirmPassword").value.trim();
    const recuperarMsg = document.getElementById("recuperarMsg");
    recuperarMsg.textContent = "";
    recuperarMsg.className = "error-message";

    // Validaciones
    if (!validarCedula(cedula)) {
      recuperarMsg.textContent = "Cédula inválida. Ejemplo válido: 8-1234-5678 o E-1-1234-5678";
      return;
    }
    if (!validarEmail(email)) {
      recuperarMsg.textContent = "Email inválido.";
      return;
    }
    if (!validarPassword(password)) {
      recuperarMsg.textContent = "La contraseña debe tener al menos 6 caracteres.";
      return;
    }
    if (password !== confirmPassword) {
      recuperarMsg.textContent = "Las contraseñas no coinciden.";
      return;
    }

    // Buscar usuario
    let usuarios = getUsuarios();
    const index = usuarios.findIndex(u =>
      u.cedula === cedula && u.email.toLowerCase() === email.toLowerCase()
    );

    if (index === -1) {
      recuperarMsg.textContent = "No se encontró usuario con esa cédula y correo.";
      return;
    }

    // Actualizar contraseña
    usuarios[index].password = password;
    setUsuarios(usuarios);

    recuperarMsg.className = "success-message";
    recuperarMsg.textContent = "Contraseña cambiada con éxito.";

    recuperarForm.reset();
setTimeout(() => {
  window.location.href = "index.html"; 
}, 1000); 

  });
}
