const nodemailer = require('nodemailer');
require('dotenv').config();

async function testEmailConfig() {
  console.log('🔍 Testando configurações de email...\n');

  // Verificar variáveis de ambiente
  const emailUser = process.env.EMAIL_USER;
  const emailPassword = process.env.EMAIL_PASSWORD;

  console.log('📧 Configurações encontradas:');
  console.log(`   EMAIL_USER: ${emailUser ? '✅ Configurado' : '❌ Não configurado'}`);
  console.log(`   EMAIL_PASSWORD: ${emailPassword ? '✅ Configurado' : '❌ Não configurado'}`);

  if (!emailUser || !emailPassword) {
    console.log('\n❌ Erro: Variáveis de ambiente não configuradas!');
    console.log('   Adicione ao seu arquivo .env:');
    console.log('   EMAIL_USER=seu-email@gmail.com');
    console.log('   EMAIL_PASSWORD=sua-app-password');
    return;
  }

  // Criar transporter
  const transporter = nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: emailUser,
      pass: emailPassword,
    },
  });

  try {
    console.log('\n🔐 Testando autenticação...');
    
    // Verificar credenciais
    await transporter.verify();
    console.log('✅ Autenticação bem-sucedida!');
    
    console.log('\n📤 Testando envio de email...');
    
    // Enviar email de teste
    const mailOptions = {
      from: `"Legacy Camp Test" <${emailUser}>`,
      to: emailUser, // Enviar para o próprio email
      subject: '🧪 Teste de Configuração - Legacy Camp',
      html: `
        <h2>✅ Configuração de Email Funcionando!</h2>
        <p>Este é um email de teste para verificar se as configurações estão corretas.</p>
        <p><strong>Data:</strong> ${new Date().toLocaleString('pt-BR')}</p>
        <p><strong>Status:</strong> ✅ Sucesso</p>
      `,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Email de teste enviado com sucesso!');
    console.log(`   Message ID: ${result.messageId}`);
    
  } catch (error) {
    console.log('\n❌ Erro na configuração:');
    console.log(`   ${error.message}`);
    
    if (error.message.includes('Invalid login')) {
      console.log('\n🔧 Solução:');
      console.log('   1. Acesse myaccount.google.com');
      console.log('   2. Ative "Verificação em duas etapas"');
      console.log('   3. Gere uma "App Password"');
      console.log('   4. Use a App Password (16 caracteres) no EMAIL_PASSWORD');
    }
  }
}

// Executar teste
testEmailConfig().catch(console.error);
