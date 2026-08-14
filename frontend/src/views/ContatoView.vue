<template>
  <section class="contato-page">
    <h1>Entre em contato com a nossa equipe!</h1>
    <p>Para entrar em contato, preencha o formulário abaixo:</p>

    <form method="post" action="https://confirmar.animavite.com/processa.php" name="form">
      <label for="nome">Nome:</label>
      <input type="text" id="nome" name="nome" placeholder="Digite seu nome" required />

      <label for="email">E-mail:</label>
      <input type="email" id="email" name="email" placeholder="Digite seu e-mail" required />

      <label for="telefone">Telefone:</label>
      <input type="tel" id="telefone" name="telefone" placeholder="Digite seu telefone" required />

      <label for="mensagem">Mensagem:</label>
      <textarea id="mensagem" name="mensagem" cols="30" rows="8" placeholder="Digite sua mensagem" required></textarea>

      <input type="submit" value="Confirmar" class="btn zoom-shadow" title="Enviar" />
    </form>

    <div class="outras-formas">
      <h2>Outras formas de contato:</h2>

      <div class="contato-links">
        <a
          href="https://www.instagram.com/franc_xco/"
          class="btn zoom-shadow"
          title="Instagram"
          target="_blank"
          rel="noopener noreferrer"
        >
          Instagram
        </a>
        <a
          href="https://wa.me/5566999896813?text=Chiquinho%20Motors/"
          class="btn zoom-shadow"
          title="WhatsApp"
          target="_blank"
          rel="noopener noreferrer"
        >
          WhatsApp
        </a>
      </div>

      <p>E-mail: <a href="mailto:chiquinhomotors@gmail.com">chiquinhomotors@gmail.com</a></p>
      <p>Endereço: Rua das Avencas, 2538, Sinop — Mato Grosso</p>
    </div>
  </section>
</template>

<style scoped>
.contato-page {
  padding: 1.5rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  max-width: 500px;
  margin: 0 auto;
}

.outras-formas {
  width: 100%;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.contato-links {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.outras-formas p {
  font-size: 1em;
}

.outras-formas a:not(.btn) {
  color: #555;
  text-decoration: underline;
}

@media (max-width: 640px) {
  .contato-page {
    padding: 1rem 0.75rem;
    gap: 1rem;
    max-width: 100%;
  }

  .outras-formas p {
    font-size: 0.95em;
  }
}
</style>
