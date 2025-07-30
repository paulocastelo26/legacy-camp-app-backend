@echo off
echo Iniciando Legacy Camp Backend...
echo.
echo Certifique-se de que:
echo 1. O banco MySQL esta rodando
echo 2. O arquivo .env esta configurado
echo 3. O banco 'legacy_camp' foi criado
echo.
npm run start:dev
pause 