# renave.ia.br

Conteúdo educativo sobre o **RENAVE** (Registro Nacional de Veículos em Estoque) para lojas
de veículos usados e de repasse, publicado em <https://renave.ia.br>.

A Resolução CONTRAN nº 1.026/2026 tornou o registro eletrônico de entrada e saída de veículos
em estoque obrigatório em todo o Brasil, com 90 dias de adaptação. Estas páginas explicam, em
linguagem simples, o que muda, quanto custa e como se credenciar.

## Páginas

| Arquivo | URL | Conteúdo |
|---|---|---|
| `index.html` | `/` | O que muda com a obrigatoriedade, multa, checklist de credenciamento |
| `guia.html` | `/guia.html` | Guia completo: fundamento legal, fluxos, custos, 5 etapas do credenciamento, glossário |
| `blog/index.html` | `/blog/` | Índice dos artigos |
| `blog/o-que-e-renave.html` | `/blog/o-que-e-renave.html` | Por que o RENAVE é uma API e não um sistema |
| `blog/quanto-custa-renave.html` | `/blog/quanto-custa-renave.html` | Taxa por movimentação, certificado, integrador |
| `blog/erros-comuns-credenciamento.html` | `/blog/erros-comuns-credenciamento.html` | 5 erros que atrasam o credenciamento |

## Estrutura

HTML estático, sem build e sem dependências. Cada página é autocontida: CSS e JS ficam inline,
e o único recurso externo é a fonte via Google Fonts. Para rodar localmente:

```bash
python3 -m http.server 8000
```

- `og.jpg`, `og-guia.jpg`, `og-artigo.jpg` — imagens de compartilhamento (1200×630)
- `favicon.svg`, `robots.txt`, `sitemap.xml`
- `CNAME` — domínio customizado do GitHub Pages; **não remover**

## Ao editar

O número de WhatsApp fica no objeto `CONFIG` no fim de cada página — se mudar, atualize em
todos os arquivos. As URLs canônicas e as tags `og:` são absolutas (`https://renave.ia.br/...`).

O contador na home é fixado em **28/09/2026** (fim do prazo de 90 dias). Depois dessa data a
página passa a exibir "o prazo de adaptação já se encerrou" — o texto precisa ser revisto.

## Aviso

Material educativo. Prazos, valores e procedimentos podem mudar ou variar conforme o estado;
confirme junto ao Detran do seu estado, ao SERPRO e ao texto oficial das normas.
Não prestamos serviço de despachante nem fazemos o credenciamento no lugar da loja.

---

by [SSYS.ia.br](https://ssys.ia.br)
