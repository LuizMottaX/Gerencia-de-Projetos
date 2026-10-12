# Publicação (deploy) — Chiquinho Motors®

O sistema tem três peças: **banco** (PostgreSQL), **API** (`backend/`) e **site**
(`frontend/`). O banco já roda no **Coolify** (Hetzner). A recomendação é
publicar API e site **no mesmo Coolify** — ver a decisão CR-10 em
[`gerenciamento/04-Monitoramento-e-Controle/Controle-Integrado-de-Mudancas.md`](gerenciamento/04-Monitoramento-e-Controle/Controle-Integrado-de-Mudancas.md).

| Opção | API | Site | Fotos do painel |
|-------|-----|------|-----------------|
| **A — Coolify (recomendada)** | `backend/Dockerfile` | `frontend/Dockerfile` (nginx) | Volume persistente do Coolify |
| B — Vercel + Railway/Render | `backend/Dockerfile` no Railway/Render | Vercel com `frontend/vercel.json` | Exige volume pago no Railway/Render |

```
Navegador ──► site (nginx ou Vercel) ──► /api, /uploads ──► API (Node) ──► PostgreSQL
               mesmo domínio: sem CORS
```

---

## Variáveis de ambiente da API

| Variável | Obrigatória | Exemplo / observação |
|----------|:-----------:|----------------------|
| `DATABASE_URL` | ✅ | `postgresql://USUARIO:SENHA@HOST:5433/BANCO` — **porta 5433** no Coolify (a 5432 é um MariaDB) |
| `JWT_SECRET` | ✅ | 64 caracteres aleatórios: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
| `PORT` | | `3001` (padrão) |
| `TRUST_PROXY` | ✅ em produção | `1` — o IP real do cliente vem do proxy (rate limit depende disso) |
| `UPLOAD_DIR` | | `/app/uploads` (padrão na imagem) — **monte um volume persistente aqui** |
| `CORS_ORIGIN` | | Só se o site chamar a API de outro domínio. Com o nginx/Vercel repassando `/api`, não precisa |
| `NODE_ENV` | | `production` (padrão na imagem) |

A imagem roda `prisma migrate deploy` ao iniciar (`npm run start:prod`), então
migrations novas são aplicadas sozinhas a cada deploy.

## Variáveis do site

| Variável | Onde | Observação |
|----------|------|------------|
| `BACKEND_URL` | nginx (opção A), em tempo de execução | URL interna da API, ex.: `http://chiquinho-api:3001` |
| `SITE_URL` | build (argumento `--build-arg` ou variável na Vercel) | URL pública, ex.: `https://chiquinhomotors.com.br` — gera o `sitemap.xml` |

---

## Opção A — tudo no Coolify

1. **API** — *New Resource → Application → GitHub* → este repositório.
   - Build pack: **Dockerfile** · Base directory: `/backend` · Porta: `3001`.
   - Variáveis: as da tabela acima (`DATABASE_URL`, `JWT_SECRET`, `TRUST_PROXY=1`).
   - *Storages*: volume persistente montado em `/app/uploads`.
   - Healthcheck: `/health` (confere o banco).
   - Não precisa de domínio público — o site acessa pela rede interna.
2. **Site** — nova Application, mesmo repositório.
   - Build pack: **Dockerfile** · Base directory: `/frontend` · Porta: `80`.
   - Build argument `SITE_URL` = domínio público; variável `BACKEND_URL` = endereço
     interno da API (aparece na página da API no Coolify).
   - Domínio: o público (o Coolify emite o HTTPS).
3. **Primeiro administrador** — no terminal da API (Coolify → *Terminal*):
   ```bash
   ADMIN_SENHA='uma-senha-forte' npm run admin:criar -- email@loja.com.br "Nome"
   ```
4. **Dados iniciais** (só na primeira vez, se o banco estiver vazio): `node prisma/seed.js`.

## Opção B — Vercel (site) + Railway/Render (API)

1. **API** no Railway ou Render apontando para `backend/` com o `Dockerfile`;
   mesmas variáveis; adicione um **volume** em `/app/uploads` (sem ele, as fotos
   enviadas pelo painel somem a cada deploy).
2. **Site** na Vercel: Root Directory `frontend`, framework Vite.
   - Antes, troque `SUBSTITUA-PELA-URL-DO-BACKEND` em `frontend/vercel.json` pela
     URL pública da API (os *rewrites* mantêm `/api` no mesmo domínio do site).
   - Variável `SITE_URL` com a URL da Vercel.

---

## Conferência pós-deploy

```bash
curl https://SEU-SITE/api/version   # versão e commit publicados
curl https://SEU-SITE/robots.txt
```

- [ ] Home, Carros, Peças e Serviços abrem sem erro.
- [ ] Um pedido de teste gera código `CM-…`; um agendamento gera `AG-…`.
- [ ] Login em `/admin` funciona; cadastrar um veículo com foto mostra a foto no site.
- [ ] Após um novo deploy da API, a foto continua lá (volume persistente).
- [ ] Senha do admin **não** é a do ambiente de desenvolvimento.
