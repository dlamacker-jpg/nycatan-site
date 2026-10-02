// Merch catalog. Placeholder items for the pitch: no prices, designs or checkout links are final.
// Checkout runs off-site (a Stripe Payment Link, Shopify, or the existing Squarespace store),
// so the site never handles payments. Leave buyUrl empty to show the item as "coming soon".
//
// Trademark note: CATAN is a registered mark of CATAN GmbH. Designs here avoid the word and
// any CATAN artwork. Confirm with CATAN Studio before selling anything that says "NYCatan".

export const SHOP_ENABLED = true;

export const PICKUP_NOTE = 'Order online and pick up at check-in at the next event. No shipping, no waiting.';

export const MERCH = [
  {
    id: 'sticker-pack',
    name: 'Sticker pack',
    blurb: 'Six die-cut hex stickers in the five resource colors plus one desert. Laptop, dice tray, water bottle.',
    price: '[PRICE]',
    status: 'coming',
    buyUrl: '',
    art: 'stickers'
  },
  {
    id: 'tee',
    name: '"Settle up, NY" tee',
    blurb: 'Heavyweight cotton tee with the five-hex mark on the chest and SETTLE UP NY across the back.',
    price: '[PRICE]',
    status: 'coming',
    buyUrl: '',
    art: 'tee'
  },
  {
    id: 'pin',
    name: 'Final table pin',
    blurb: 'Hard enamel hex pin. Sold to everyone; a gold version goes only to players who make a final table.',
    price: '[PRICE]',
    status: 'coming',
    buyUrl: '',
    art: 'pin'
  },
  {
    id: 'tote',
    name: 'Game night tote',
    blurb: 'Canvas tote sized for a base game box, a dice tray and snacks.',
    price: '[PRICE]',
    status: 'coming',
    buyUrl: '',
    art: 'tote'
  }
];
