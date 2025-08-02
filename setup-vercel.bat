@echo off
echo 🛠️ Configurando projeto para deploy no Vercel + PlanetScale...
echo.

echo 📦 Instalando Vercel CLI...
npm install -g vercel

echo.
echo 🔐 Fazendo login no Vercel...
vercel login

echo.
echo 📋 Verificando arquivos de configuração...
if not exist "vercel.json" (
    echo ❌ Arquivo vercel.json não encontrado!
    echo Criando arquivo de configuração...
    echo { > vercel.json
    echo   "version": 2, >> vercel.json
    echo   "builds": [ >> vercel.json
    echo     { >> vercel.json
    echo       "src": "src/main.ts", >> vercel.json
    echo       "use": "@vercel/node" >> vercel.json
    echo     } >> vercel.json
    echo   ], >> vercel.json
    echo   "routes": [ >> vercel.json
    echo     { >> vercel.json
    echo       "src": "/(.*)", >> vercel.json
    echo       "dest": "src/main.ts" >> vercel.json
    echo     } >> vercel.json
    echo   ] >> vercel.json
    echo } >> vercel.json
)

echo.
echo ✅ Configuração concluída!
echo.
echo 📋 Próximos passos:
echo 1. Configure seu banco de dados no PlanetScale
echo 2. Configure as variáveis de ambiente no Vercel
echo 3. Execute deploy.bat para fazer o deploy
echo.
echo 📖 Consulte o README_DEPLOY.md para instruções detalhadas
echo.
pause 