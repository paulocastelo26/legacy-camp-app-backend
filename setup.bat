@echo off
echo Configurando Legacy Camp Backend...
echo.

echo 1. Instalando dependencias...
npm install

echo.
echo 2. Criando arquivo .env...
if not exist .env (
    copy env.example .env
    echo Arquivo .env criado! Configure suas credenciais do banco.
) else (
    echo Arquivo .env ja existe.
)

echo.
echo 3. Configuracao concluida!
echo.
echo Prximos passos:
echo 1. Configure o arquivo .env com suas credenciais do MySQL
echo 2. Crie o banco de dados: CREATE DATABASE legacy_camp;
echo 3. Execute: npm run start:dev
echo.
pause 