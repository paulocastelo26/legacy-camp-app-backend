# 🔧 Troubleshooting - Problemas de Build

## 🚨 Erro: "tsconfig.tsbuildinfo mount: cannot create subdirectories"

### Problema
```
runc run failed: unable to start container process: error during container init: error mounting "/var/lib/buildkit/runc-overlayfs/snapshots/snapshots/554/fs" to rootfs at "/app/./dist/tsconfig.tsbuildinfo": create mountpoint for /app/./dist/tsconfig.tsbuildinfo mount: cannot create subdirectories in "/var/lib/buildkit/runc-overlayfs/executor/umvr22hb1fcbhm7fygeg1w0c3/rootfs/app/dist/tsconfig.tsbuildinfo": not a directory
```

### Causa
O TypeScript está tentando criar um arquivo `tsconfig.tsbuildinfo` como um diretório, causando conflito no sistema de arquivos do container.

### Soluções Aplicadas

#### 1. **tsconfig.json** - Desabilitar Build Incremental
```json
{
  "compilerOptions": {
    // ... outras opções
    "incremental": false,  // ❌ Era true, agora false
    // ... outras opções
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

#### 2. **package.json** - Limpar Dist Antes do Build
```json
{
  "scripts": {
    "prebuild": "rimraf dist",  // 🆕 Novo script
    "build": "nest build",
    // ... outros scripts
  }
}
```

#### 3. **.dockerignore** - Ignorar Arquivos Problemáticos
```
node_modules
dist
build
*.tsbuildinfo  // 🆕 Ignorar arquivos de build incremental
# ... outros arquivos
```

#### 4. **railway.toml** - Configuração Otimizada
```toml
[build]
builder = "nixpacks"

[deploy]
startCommand = "npm run start:prod"
healthcheckPath = "/api"
healthcheckTimeout = 300

[build.environment]
NODE_ENV = "production"
```

## 🔄 Como Aplicar as Correções

### 1. Atualizar Dependências
```bash
npm install rimraf --save-dev
```

### 2. Limpar Cache Local
```bash
# Remover arquivos de build
rm -rf dist
rm -f tsconfig.tsbuildinfo

# Limpar cache do npm
npm cache clean --force
```

### 3. Testar Build Localmente
```bash
npm run build
```

### 4. Fazer Deploy
```bash
# Commit das mudanças
git add .
git commit -m "Fix: Resolve build issues for Railway deployment"
git push
```

## 🚨 Outros Problemas Comuns

### Erro: "Cannot find module"
**Solução**: Verificar se todas as dependências estão no `package.json`

### Erro: "Port already in use"
**Solução**: Railway usa `PORT` automaticamente, não configurar manualmente

### Erro: "Database connection failed"
**Solução**: Verificar variáveis de ambiente do banco

## 📊 Monitoramento

### Logs do Build
1. Acesse Railway Dashboard
2. Vá em "Deployments"
3. Clique no deploy com erro
4. Verifique os logs de build

### Logs da Aplicação
1. Vá em "View Logs"
2. Procure por erros de inicialização
3. Verifique se a aplicação iniciou corretamente

## 🎯 Prevenção

### Boas Práticas
- ✅ Sempre testar build localmente antes do deploy
- ✅ Usar `.dockerignore` para ignorar arquivos desnecessários
- ✅ Limpar diretório `dist` antes do build
- ✅ Desabilitar build incremental em produção
- ✅ Usar variáveis de ambiente para configurações

### Checklist Antes do Deploy
- [ ] Build local funcionando
- [ ] Todas as dependências no `package.json`
- [ ] Variáveis de ambiente configuradas
- [ ] Arquivos de configuração atualizados
- [ ] Testes passando

## 📞 Suporte

Se o problema persistir:
1. Verificar logs completos no Railway
2. Testar build em ambiente limpo
3. Verificar versões das dependências
4. Consultar documentação do Railway

---

**Status**: ✅ Problema resolvido com as correções aplicadas 