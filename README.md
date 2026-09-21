# LP · Katsuo Arakaki · Terapia Breve — VERSÃO A

Landing page da consulta de pré-terapia. HTML, CSS e JS puros, sem build. Basta abrir `index.html` ou publicar a pasta em qualquer host estático (Vercel, Netlify, GitHub Pages).

Este é o repositório da **Versão A** (a página completa, com vídeo, carrossel de
depoimentos e tabela comparativa em cartão), publicada em
`www.katsuoarakaki.sitepreviavisual.site`, usada no teste A/B contra a
**Versão B** (layout enxuto, mesma copy), que fica no repositório separado
[`lp-katsuo-arakaki-v2`](https://github.com/Devikison/lp-katsuo-arakaki-v2),
publicada em `katsuoarakakiv2.sitepreviavisual.site`.

São repositórios separados porque o GitHub Pages só permite um domínio
customizado por repositório. **Mudança de copy (texto) deve, em princípio, ir
pras duas versões** — o teste compara layout, não mensagem. Mudança de
layout/visual vale só para o repositório em que foi feita.

## Estrutura

```
index.html              página completa (7 dobras + rodapé + barra fixa)
assets/css/style.css    design system da marca e responsividade
assets/js/config.js     >>> único arquivo que precisa ser editado <<<
assets/js/main.js       WhatsApp, vídeos, acordeão, revelação ao rolar
assets/img/             fotos otimizadas (JPG + WebP) e favicon
docs/                   briefing original e manual da marca
```

## Antes de publicar

Edite `assets/js/config.js`:

| Campo | O que é |
|---|---|
| `whatsappNumber` | Número do Katsuo, só dígitos, com 55 + DDD. **Está com placeholder.** |
| `whatsappMessage` | Mensagem que chega pronta no WhatsApp. |
| `vslUrl` | Link do vídeo principal (YouTube ou Vimeo). Vazio = capa com foto. |
| `depoUrl` | Link do vídeo de depoimento. Vazio = capa com frase. |

Os depoimentos em texto (dobra 06) estão com a assinatura genérica "Cliente atendida". Trocar pelos nomes reais quando o cliente autorizar.

Antes de subir o vídeo de depoimento, cortar os trechos com a palavra "cura", conforme a ficha do projeto.

## Dobras (seguem o briefing)

1. Hero: headline, VSL, sub-headline, CTA, faixa de credibilidade
2. Se você se reconhece aqui: lista em duas colunas + bloco de desqualificação
3. O que está realmente acontecendo: texto corrido + frase em destaque
4. O que acontece na primeira consulta: três cards + caixa de reversão de risco + CTA
5. Terapia breve e o modelo de sempre: tabela no desktop, cards no celular, sem cor de julgamento
6. Quem conduz: foto + bio, vídeo de depoimento, cards de depoimento
7. FAQ em acordeão + fechamento + CTA final. Botão fixo de WhatsApp no celular.

## Marca

Paleta `#87AAE2` `#6AA3E3` `#051743` `#CAD6E3` `#E8D1A7` `#FFFFFF`.
Títulos em Archivo (substituta web da Condor Light/Medium), corpo em Roboto Light.
