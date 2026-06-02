# Padaria Contentor Amarelo — Controlo de Stock

Sistema de controlo de stock para a Padaria Contentor Amarelo (Moçambique).

---

## Executar localmente

```bash
npm install
npm run dev       # http://localhost:3000
```

Criar um ficheiro `.env` na raiz (ver `.env.example`):

```
PORT=3000
GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
APP_PIN=1234
```

---

## Deployment no Vercel

1. **Push para o GitHub**

   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/SEU_UTILIZADOR/padaria-contentor-amarelo.git
   git push -u origin main
   ```

2. **Importar no Vercel**

   - Aceder a [vercel.com](https://vercel.com) e entrar com a conta GitHub
   - Clicar em **Add New → Project**
   - Seleccionar o repositório `padaria-contentor-amarelo`
   - Clicar em **Deploy** (as configurações são detectadas automaticamente via `vercel.json`)

3. **Adicionar variáveis de ambiente no Vercel**

   Em **Settings → Environment Variables** do projecto:

   | Nome | Valor |
   |---|---|
   | `GOOGLE_APPS_SCRIPT_URL` | URL do Google Apps Script (`/exec`) |
   | `APP_PIN` | PIN de acesso escolhido (ex: `1234`) |

4. **Redeployar após adicionar as variáveis**

   Em **Deployments → botão ⋯ → Redeploy**

5. **Partilhar o link**

   O link final tem o formato `https://padaria-contentor-amarelo.vercel.app`.
   Partilhar no WhatsApp com a equipa.

---

## Configurar o Google Apps Script

1. Abrir a Google Sheet pretendida
2. Ir a **Extensões → Apps Script**
3. Colar o conteúdo de `apps-script/Code.gs`
4. Guardar (Ctrl+S)
5. **Implementar → Nova implementação**
   - Tipo: **Web App**
   - Executar como: **Eu**
   - Quem tem acesso: **Qualquer pessoa**
6. Copiar o URL da web app (`…/exec`) para `GOOGLE_APPS_SCRIPT_URL`

> Atenção: cada nova implementação gera um novo URL. Actualizar a variável de ambiente e redeployar.

---

## Lista de testes

- [ ] PIN correcto → acede à app
- [ ] PIN errado → mostra mensagem de erro, não deixa entrar
- [ ] Submissão em produção → registo aparece na Google Sheet
- [ ] Venda com turno Noite → `shift: "Noite+Manhã"` enviado
- [ ] Venda com turno Manhã → `shift: "Noite+Manhã"` enviado
- [ ] Totais calculam correctamente (Recebido − Sobrou − Danificado)
- [ ] Dados reencaminhados para o Apps Script quando `GOOGLE_APPS_SCRIPT_URL` existe
- [ ] Mock com sucesso quando `GOOGLE_APPS_SCRIPT_URL` não está definido
