@echo off
echo ========================================
echo    CORREÇÃO DE PROBLEMAS DE BUILD
echo ========================================
echo.

echo 1. Limpando arquivos de build...
if exist dist rmdir /s /q dist
if exist tsconfig.tsbuildinfo del tsconfig.tsbuildinfo
echo ✅ Arquivos de build removidos
echo.

echo 2. Instalando dependência rimraf...
npm install rimraf --save-dev
if %errorlevel% neq 0 (
    echo ❌ Erro ao instalar rimraf
    pause
    exit /b 1
)
echo ✅ rimraf instalado
echo.

echo 3. Limpando cache do npm...
npm cache clean --force
echo ✅ Cache limpo
echo.

echo 4. Testando build local...
npm run build
if %errorlevel% neq 0 (
    echo ❌ Erro no build local
    echo Verifique os erros acima
    pause
    exit /b 1
)
echo ✅ Build local funcionando
echo.

echo 5. Preparando para deploy...
echo.
echo 📝 Próximos passos:
echo 1. Commit das mudanças: git add . && git commit -m "Fix: Build issues"
echo 2. Push para GitHub: git push
echo 3. Verificar deploy no Railway
echo.
echo 🎉 Correções aplicadas com sucesso!
echo.
pause 