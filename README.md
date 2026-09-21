# LP · Katsuo Arakaki · Terapia Breve

Landing page da consulta de pré-terapia. HTML, CSS e JS puros, sem build. Basta abrir `index.html` ou publicar a pasta em qualquer host estático (Vercel, Netlify, GitHub Pages).

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
