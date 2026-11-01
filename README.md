# Portfólio · Felipe Fonseca

Site estático (HTML + CSS + JS puro) pronto para o GitHub Pages.

## Estrutura
```
index.html        Home (boas-vindas)
curriculo.html    Currículo (parallax, linha do tempo, cursos com filtro, download do PDF)
servicos.html     Serviços (planilhas, dashboards, sites, estruturação de dados)
contato.html      Contatos (WhatsApp, e-mail, LinkedIn)
css/style.css     Todo o estilo, incluindo tema claro/escuro
js/theme.js       Aplica o tema salvo antes da página carregar
js/main.js        Animações, parallax, filtro, menu mobile, troca de tema
images/           Foto, avatar e favicon
docs/             Currículo em PDF
```

## Publicar no GitHub Pages
1. Crie um repositório (ex.: `felipefonseca.github.io` para ter o endereço raiz).
2. Envie todos os arquivos desta pasta para a branch `main`.
3. Em **Settings → Pages**, escolha *Deploy from a branch*, branch `main`, pasta `/ (root)`.
4. Em alguns minutos o site estará em `https://<seu-usuario>.github.io/`.

## Atualizar conteúdo
- Trocar o currículo: substitua `docs/curriculo-felipe-fonseca.pdf` mantendo o mesmo nome.
- Trocar a foto: substitua `images/avatar.jpg` (quadrada) e `images/felipe.jpg` (retrato 4:5).
- Textos: edite diretamente os arquivos `.html`.
