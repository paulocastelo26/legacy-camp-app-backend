@echo off
echo ========================================
echo    DEPLOY LEGACY CAMP - RAILWAY
echo ========================================
echo.

echo 1. Verificando se o Railway CLI está instalado...
railway --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Railway CLI não encontrado!
    echo Instalando Railway CLI...
    npm install -g @railway/cli
    if %errorlevel% neq 0 (
        echo ❌ Erro ao instalar Railway CLI
        pause
        exit /b 1
    )
)

echo ✅ Railway CLI instalado/verificado
echo.

echo 2. Verificando login no Railway...
railway whoami >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Não logado no Railway
    echo Fazendo login...
    railway login
    if %errorlevel% neq 0 (
        echo ❌ Erro no login
        pause
        exit /b 1
    )
)

echo ✅ Logado no Railway
echo.

echo 3. Verificando projeto...
railway status >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Projeto não encontrado
    echo Inicializando projeto...
    railway init
    if %errorlevel% neq 0 (
        echo ❌ Erro ao inicializar projeto
        pause
        exit /b 1
    )
)

echo ✅ Projeto configurado
echo.

echo 4. Fazendo deploy...
echo ⏳ Aguarde, isso pode demorar alguns minutos...
railway up
if %errorlevel% neq 0 (
    echo ❌ Erro no deploy
    pause
    exit /b 1
)

echo.
echo ✅ Deploy concluído com sucesso!
echo.
echo 5. Obtendo URL da aplicação...
railway domain
echo.
echo 🎉 Aplicação disponível no Railway!
echo 📚 Documentação: [URL]/api
echo.
pause 