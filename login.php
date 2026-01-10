<?php
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    echo "<script>alert('Acesso inválido'); window.location.href='login.html';</script>";
    exit;
}

$username = trim($_POST["username"]);
$password = $_POST["password"];

$ficheiro = "contas.txt";

if (!file_exists($ficheiro)) {
    echo "<script>alert('Não existem contas registadas'); window.location.href='login.html';</script>";
    exit;
}

$linhas = file($ficheiro, FILE_IGNORE_NEW_LINES);

foreach ($linhas as $linha) {
    $dados = explode(";;;", $linha);

    if ($dados[0] === $username && $dados[1] === $password) {
        echo "<script>alert('Login efetuado com sucesso'); window.location.href='index.html';</script>";
        exit;
    }
}

echo "<script>alert('Username ou password incorretos'); window.location.href='login.html';</script>";
exit;
