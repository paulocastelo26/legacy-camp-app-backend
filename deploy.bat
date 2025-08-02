@echo off
echo 🚀 Iniciando deploy para Vercel + PlanetScale...
echo.

echo 📦 Instalando dependências...
npm install

echo.
echo 🔧 Verificando configuração...
if not exist "vercel.json" (
    echo ❌ Arquivo vercel.json não encontrado!
    echo Por favor, execute o setup primeiro.
    pause
    exit /b 1
)

echo.
echo 🚀 Fazendo deploy para Vercel...
vercel --prod

echo.
echo ✅ Deploy concluído!
echo.
echo 📋 Próximos passos:
echo 1. Configure as variáveis de ambiente no dashboard do Vercel
echo 2. Teste a API em: https://seu-app.vercel.app/api
echo 3. Verifique a documentação Swagger
echo.
pause 