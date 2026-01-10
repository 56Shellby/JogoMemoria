<?php
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    echo "<script>alert('Acesso inválido'); window.location.href='registo.html';</script>";
    exit;
}

$username = trim($_POST["username"]);
$pass1 = $_POST["password1"];
$pass2 = $_POST["password2"];

if ($pass1 !== $pass2) {
    echo "<script>alert('As passwords não coincidem'); window.location.href='registo.html';</script>";
    exit;
}

$ficheiro = "contas.txt";

if (!file_exists($ficheiro)) {
    file_put_contents($ficheiro, "");
}

$linhas = file($ficheiro, FILE_IGNORE_NEW_LINES);

foreach ($linhas as $linha) {
    $dados = explode(";;;", $linha);
    if ($dados[0] === $username) {
        echo "<script>alert('Este nome de utilizador já existe'); window.location.href='registo.html';</script>";
        exit;
    }
}

$novaLinha = $username . ";;;" . $pass1 . PHP_EOL;
file_put_contents($ficheiro, $novaLinha, FILE_APPEND);

echo "<script>alert('Registo efetuado com sucesso'); window.location.href='login.html';</script>";
exit;
