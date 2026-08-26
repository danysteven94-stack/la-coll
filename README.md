# La Collection — Rejis Operasyon (vèsyon Vercel)

Aplikasyon sa a itilize **Upstash Redis** (via Vercel Marketplace) kòm baz done — pa gen okenn kòd oswa kle API pou w kole nan fichye yo. Ou konekte baz done a dirèkteman nan dashboard Vercel la.

> Nòt: Ansyen pwodwi "Vercel KV" la disparèt (Vercel ranmase l). Upstash Redis se ranplasman ofisyèl li, e li fonksyone menm jan.

## Deplwaye l

1. Dezip dosye sa a sou òdinatè w.
2. Louvri yon tèminal anndan dosye a epi kouri:
   ```
   npm install
   npx vercel
   ```
   Swiv enstriksyon yo (konekte ak imèl ou oswa GitHub, aksepte paramèt default yo).
3. Ale sou **vercel.com/dashboard**, louvri pwojè "la-collection" ki fèk kreye a.
4. Klike tab **Storage** → **Marketplace Database Storage** (oswa "Browse Marketplace") → chèche **Upstash** epi chwazi pwodwi Redis li a.
5. Swiv etap yo pou kreye/konekte yon baz done Redis, epi chwazi pwojè "la-collection" pou konekte l — Vercel ap mete tout varyab koneksyon yo otomatikman, ou pa bezwen touche kòd la.
6. Retounen nan tèminal la epi kouri:
   ```
   npx vercel --prod
   ```
7. Vercel ap ba ou yon lyen (pa egzanp `https://la-collection.vercel.app`). Lyen sa a ap mache sou nenpòt òdinatè oswa telefòn, e chak antre moun fè ap sovgade nan menm baz done a.

## Enpòtan — sekirite

Nenpòt moun ki gen lyen an ka wè epi ajoute/efase done, paske pa gen mo de pas ki mande. Si w vle plis sekirite (egzanp: yon mo de pas anvan moun ka antre), fè m konnen epi m ajoute sa.
