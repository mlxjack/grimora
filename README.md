# Grimora — site institucional

Site estático de página única (HTML + CSS + JavaScript puro), sem frameworks e sem
etapa de build. Basta abrir o `index.html` ou subir a pasta em qualquer hospedagem.

## Estrutura

```
grimora/
├── index.html                        Página completa (todas as seções)
├── styles.css                        Toda a estilização, comentada por seção
├── script.js                         Menu, animações, formulário
├── robots.txt                        Liberação para buscadores
└── assets/
    └── img/
        └── logo-grimora-branco.png   Logo oficial (versão para fundo escuro)
```

## O que trocar antes de publicar

Todos os pontos abaixo estão marcados no código com o comentário `TROCAR`.

| O quê | Onde |
|---|---|
| Domínio final (canonical e Open Graph) | `index.html` — `<head>` |
| Imagem de compartilhamento 1200x630 | `index.html` — `og:image` |
| Favicon recortado (só a árvore) | `index.html` — `<link rel="icon">` |
| Logo horizontal, se você criar um | `index.html` — bloco `.brand` no header |
| Imagens do portfólio | `index.html` — seção `#cases`, cada `.case__media` |
| Depoimentos reais | `index.html` — seção `#depoimentos` |
| Links das redes sociais | `index.html` — rodapé, `href="#"` |
| Número de WhatsApp | `script.js` (bloco `CONFIG`) + 3 links no `index.html` |
| Paleta de cores | `styles.css` — bloco `:root` no topo |

### Trocar a paleta

O `styles.css` traz três paletas prontas no topo do arquivo. A ativa é
**Obsidiana & Âmbar**. Para usar outra, comente o `:root` atual e descomente
**Púrpura Arcano** ou **Verde Espectral**. Nenhuma outra linha precisa mudar.

### Trocar as imagens do portfólio

Cada card tem um placeholder:

```html
<div class="case__media" aria-hidden="true"><span>Case em breve</span></div>
```

Troque por:

```html
<img class="case__media" src="assets/img/case-01.jpg" alt="Descrição do projeto"
     loading="lazy" width="800" height="600">
```

As medidas e o recorte já estão no CSS. Use JPG ou WebP com no máximo 1600px de
largura e ~200KB por arquivo — acima disso o carregamento começa a pesar.

## Formulário de contato

Hoje o envio monta a mensagem e abre o WhatsApp já preenchido — funciona sem
backend nenhum. Em `script.js`, na função de `submit`, existem três alternativas
comentadas: `mailto:`, serviço externo (Formspree/Basin/Web3Forms) e endpoint
próprio. Também há indicação de onde disparar eventos de conversão do Google
Analytics e do Meta Pixel.

## Publicação

O site é estático, então qualquer uma destas opções funciona:

- **GitHub Pages** — grátis, direto deste repositório (Settings → Pages → branch `main`)
- **Netlify** ou **Vercel** — grátis, deploy automático a cada push, HTTPS incluso
- **Hospedagem tradicional** — subir os arquivos por FTP na pasta `public_html`

O domínio próprio é configurado no painel da hospedagem escolhida apontando os
registros DNS do registrador (Registro.br, se for `.com.br`).
