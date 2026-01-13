const togglePassword = document.getElementById("toggle-password");
const passwordInput = document.getElementById("password");

togglePassword.addEventListener("click", () => {
    const type = passwordInput.type === "password" ? "text" : "password";
    passwordInput.type = type;
});

document.getElementById("auth-form").addEventListener("submit", function(e) {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;
    const mensagem = document.getElementById("mensagem");

    const utilizadores = JSON.parse(localStorage.getItem("utilizadores")) || [];

    const user = utilizadores.find(u =>
        u.username === username && u.password === password
    );

    if (user) {
        localStorage.setItem("utilizadorLogado", username);
        alert("Login efetuado com sucesso!");
    } else {
        mensagem.textContent = "Username ou password incorretos.";
    }
});
