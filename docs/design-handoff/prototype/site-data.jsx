// Ashwick Home — data, router, cart (Shopify-style: index / collection / product / page)
const { useState, useEffect } = React;

const PHOTO = (f) => '../shop/photos/' + f;

const FABRICS = {
  linen:   { id:'linen',   label:'Organic linen',            swatch:'#DDD3BE', tex:'linen' },
  boucle:  { id:'boucle',  label:'Organic wool bouclé',      swatch:'#ECE5D8', tex:'boucle' },
  wool:    { id:'wool',    label:'Brushed organic wool',     swatch:'#B8AB96', tex:'wool' },
  leather: { id:'leather', label:'Vegetable-tanned leather', swatch:'#A36A40', tex:'leather' },
};
const DEPTHS   = [{ id:'standard', label:'Standard' }, { id:'deep', label:'Deep' }];
const LENGTHS  = [{ id:'standard', label:'Standard' }, { id:'long', label:'Long' }];
const FINISHES = [{ id:'natural', label:'Natural' }, { id:'warm', label:'Warm' }, { id:'deep', label:'Deep' }];

const PRODUCTS = [
  { id:'marlowe', name:'The Marlowe', type:'Sofa', category:'sofas', price:8500,
    line:'A deep, plush sofa on a hand-fluted solid oak plinth, in brushed organic wool.',
    photos:['marlowe-studio.jpg','marlowe-1.jpg','marlowe-2.jpg'], cardSingle:true,
    fabrics:['wool','boucle','linen'], designedFabric:'wool', depth:true, length:true, finish:true,
    materials:'Solid oak plinth, hand-fluted · Brushed organic wool · Organic wool and kapok fill · Natural oil finish' },
  { id:'chatsworth', name:'The Chatsworth', type:'Sofa', category:'sofas', price:10500,
    line:'A sculptural curved sofa in ivory organic wool bouclé.',
    photos:['chatsworth-s1.jpg'],
    fabrics:['boucle','wool','linen'], designedFabric:'boucle', depth:true, length:true, finish:false,
    materials:'Solid hardwood frame · Ivory organic wool bouclé · Organic wool and kapok fill' },
  { id:'cotswold', name:'The Cotswold', type:'Sofa', category:'sofas', price:8500, priceFrom:true,
    line:'A deep, curved modular sofa in ivory organic wool bouclé, with a chaise.',
    photos:['csofa-front.jpg','csofa-studio.jpg','csofa-b.jpg','csofa-c.jpg','csofa-a.jpg','cchair-c.jpg','csofa-d.jpg'], cardSingle:true,
    fabrics:['boucle','wool','linen'], designedFabric:'boucle', depth:true, length:true, finish:false,
    materials:'Solid hardwood frame · Ivory organic wool bouclé · Organic wool and kapok fill · Modular sections with chaise' },
  { id:'burford', name:'The Burford', type:'Sofa', category:'sofas', price:6500, priceFrom:true,
    line:'A deep, slipcovered sofa in natural organic linen, with a tailored skirt.',
    photos:['burford-1.jpg'], cardSingle:true,
    fabrics:['linen','wool','boucle'], designedFabric:'linen', depth:true, length:true, finish:false,
    materials:'Solid hardwood frame · Removable organic linen slipcover · Organic wool and kapok fill' },
  { id:'pembroke', name:'The Pembroke', type:'Chair', category:'chairs', price:5000,
    line:'A sculptural wingback lounge chair in warm organic wool bouclé, no visible legs.',
    photos:['pembroke-1.jpg'],
    fabrics:['boucle','wool','linen'], designedFabric:'boucle', depth:true, length:false, finish:false,
    materials:'Solid hardwood frame · Warm organic wool bouclé · Organic wool and kapok fill' },
  { id:'cotswold-chair', name:'The Cotswold Chair', type:'Chair', category:'chairs', price:4000,
    line:'A deep, rounded lounge chair in organic wool bouclé, made to sit beside the Cotswold sofa.',
    photos:['cchair-studio.jpg','cchair-c.jpg'], cardSingle:true,
    fabrics:['boucle','wool','linen'], designedFabric:'boucle', depth:true, length:false, finish:false,
    materials:'Solid hardwood frame · Organic wool bouclé · Organic wool and kapok fill' },
  { id:'clifton', name:'The Clifton', type:'Chair', category:'chairs', price:5500,
    line:'A rounded swivel lounge chair in textured ivory weave, with an olive back, a stitched leather band and a walnut base.',
    photos:['clifton-s1.jpg','clifton-s2.jpg'],
    fabrics:['boucle','wool','linen'], designedFabric:'boucle', depth:true, length:false, finish:true,
    materials:'Solid walnut swivel base · Textured organic wool weave · Stitched vegetable-tanned leather band · Organic wool and kapok fill' },
];
const PRODUCT_BY_ID = Object.fromEntries(PRODUCTS.map(p => [p.id, p]));

const fmt = (n) => n == null ? '[PRICE]' : '$' + n.toLocaleString('en-US');

function parseHash(){
  const h = window.location.hash.replace(/^#/, '') || '/';
  let m;
  if (h === '/') return { name:'home' };
  if ((m = h.match(/^\/collections\/(all|sofas|chairs)$/))) return { name:'collection', filter:m[1] };
  if ((m = h.match(/^\/products\/([\w-]+)(\/customize)?$/))) return { name:'product', id:m[1], custom:!!m[2] };
  if (h === '/pages/design-your-own') return { name:'design' };
  if (h === '/pages/our-story') return { name:'story' };
  if (h === '/pages/materials') return { name:'materials' };
  if (h === '/pages/trade') return { name:'trade' };
  if (h === '/account') return { name:'account' };
  return { name:'home' };
}
function useRoute(){
  const [route, setRoute] = useState(parseHash());
  useEffect(() => {
    const on = () => { setRoute(parseHash()); window.scrollTo(0, 0); };
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);
  return route;
}

const Link = ({ to, children, className, style, onClick }) => (
  <a href={'#' + to} className={className} style={style} onClick={onClick}>{children}</a>
);

function Photo({ src, label, className, pos }){
  if (!src) return <div className={'ph ' + (className || '')}><span>Photography · {label}</span></div>;
  return <img className={className} src={PHOTO(src)} alt={label} style={pos ? { objectPosition:pos } : null}/>;
}

function Swatch({ f, size = 96, on, onClick }){
  const F = FABRICS[f];
  const El = onClick ? 'button' : 'div';
  return <El className={'chip tex-' + F.tex + (on ? ' on' : '')} title={F.label} aria-label={F.label}
    onClick={onClick} style={{ width:size, height:size, background:F.swatch }}></El>;
}

const CartCtx = React.createContext(null);
function useCartState(){
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const add = (line) => { setItems(c => [...c, { ...line, lineId: Math.random().toString(36).slice(2, 9) }]); setOpen(true); };
  const remove = (id) => setItems(c => c.filter(i => i.lineId !== id));
  const qty = (id, q) => setItems(c => c.map(i => i.lineId === id ? { ...i, qty: Math.max(1, q) } : i));
  const count = items.reduce((s, i) => s + i.qty, 0);
  const unpriced = items.some(i => i.price == null);
  const subtotal = unpriced ? null : items.reduce((s, i) => s + i.price * i.qty, 0);
  return { items, open, setOpen, add, remove, qty, count, subtotal };
}

Object.assign(window, { PHOTO, FABRICS, DEPTHS, LENGTHS, FINISHES, PRODUCTS, PRODUCT_BY_ID, fmt, useRoute, Link, Photo, Swatch, CartCtx, useCartState });
