<template>
  <section class="contato-page">
    <div class="section-banner">
      <h1>📞 Fale Conosco</h1>
      <p class="banner-sub">Estamos prontos para te ajudar a encontrar o carro ideal</p>
    </div>

    <div class="contato-inner">
      <!-- Formulário -->
      <div class="form-card">
        <h2>Envie uma mensagem</h2>
        <form method="post" action="https://confirmar.animavite.com/processa.php" name="form">
          <label for="nome">Nome</label>
          <input type="text" id="nome" name="nome" placeholder="Digite seu nome completo" required />

          <label for="email">E-mail</label>
          <input type="email" id="email" name="email" placeholder="seu@email.com" required />

          <label for="telefone">Telefone / WhatsApp</label>
          <input type="tel" id="telefone" name="telefone" placeholder="(66) 9 9999-9999" required />

          <label for="mensagem">Mensagem</label>
          <textarea id="mensagem" name="mensagem" rows="5" placeholder="Descreva o veículo de interesse ou deixe sua mensagem…" required></textarea>

          <input type="submit" value="Enviar Mensagem →" class="btn btn-red zoom-shadow submit-btn" />
        </form>
      </div>

      <!-- Info de contato -->
      <div class="contato-info">
        <div class="info-card">
          <span class="info-icon">💬</span>
          <h3>WhatsApp</h3>
          <a href="https://wa.me/5566999896813?text=Chiquinho%20Motors/" target="_blank" rel="noopener noreferrer" class="btn btn-red zoom-shadow info-btn">
            Chamar no WhatsApp
          </a>
        </div>
        <div class="info-card">
          <span class="info-icon">📸</span>
          <h3>Instagram</h3>
          <a href="https://www.instagram.com/franc_xco/" target="_blank" rel="noopener noreferrer" class="btn zoom-shadow info-btn">
            @franc_xco
          </a>
        </div>
        <div class="info-card">
          <span class="info-icon">✉️</span>
          <h3>E-mail</h3>
          <a href="mailto:chiquinhomotors@gmail.com" class="info-link">chiquinhomotors@gmail.com</a>
        </div>
        <div class="info-card">
          <span class="info-icon">📍</span>
          <h3>Endereço</h3>
          <p>Rua das Avencas, 2538<br />Sinop — Mato Grosso</p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.contato-page {
  display: flex;
  flex-direction: column;
}

.banner-sub {
  color: #b0b4bc;
  font-size: 0.92em;
  margin-top: 0.25rem;
}

.contato-inner {
  display: grid;
  grid-template-columns: 1fr 280px;
  gap: 2rem;
  padding: 2rem;
  max-width: 980px;
  margin: 0 auto;
  width: 100%;
  align-items: start;
}

/* ── Formulário ── */
.form-card {
  background: #fff;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  border-top: 3px solid #c0392b;
}

.form-card h2 {
  text-align: left;
  font-size: 1em;
  color: #888;
  margin-bottom: 1.2rem;
  margin-top: 0;
}

.submit-btn {
  width: 100%;
  text-align: center;
  font-size: 1em;
  padding: 0.8em 1em;
  margin-top: 0.25rem;
}

/* ── Info cards ── */
.contato-info {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.info-card {
  background: #fff;
  border-radius: 10px;
  padding: 1.2rem;
  box-shadow: 0 4px 16px rgba(0,0,0,0.07);
  text-align: center;
  border-left: 3px solid #c0392b;
}

.info-icon {
  font-size: 1.5em;
  display: block;
  margin-bottom: 0.3rem;
}

.info-card h3 {
  font-size: 0.85em;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #444;
  margin-bottom: 0.6rem;
}

.info-card p {
  font-size: 0.88em;
  color: #555;
  line-height: 1.5;
}

.info-btn {
  font-size: 0.82em;
  padding: 0.5em 1em;
}

.info-link {
  color: #c0392b;
  font-size: 0.85em;
  font-weight: 600;
  word-break: break-all;
}

.info-link:hover { text-decoration: underline; }

/* ── Responsivo ── */
@media (max-width: 700px) {
  .contato-inner {
    grid-template-columns: 1fr;
    padding: 1rem;
    gap: 1.2rem;
  }

  .form-card { padding: 1.2rem; }
}
</style>
