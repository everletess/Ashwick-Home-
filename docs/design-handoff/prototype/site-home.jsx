// Ashwick Home — homepage (templates/index)
const { PRODUCTS, Link, Photo, Swatch, fmt } = window;

function ProductCard({ p, custom }){
  return (
    <Link to={'/products/' + p.id + (custom ? '/customize' : '')} className="card">
      <div className="card-img">
        <Photo src={p.photos[0]} label={p.name}/>
        {p.photos[1] && !p.cardSingle && <Photo src={p.photos[1]} label={p.name} className="alt"/>}
        <span className="card-cta">{custom ? 'Customize' : 'Shop now'}</span>
      </div>
      <div className="card-row"><span className="card-name">{p.name}</span><span className="card-price">{p.priceFrom ? 'From ' : ''}{fmt(p.price)}</span></div>
      <p className="card-line">{p.line}</p>
      <div className="card-meta">{p.type} · Made to order · Customizable</div>
    </Link>
  );
}

function HomeHero(){
  return (
    <section className="hero" data-screen-label="Home · Hero">
      <Photo src="hero.jpg" label="Ashwick Home living room"/>
      <div className="hero-scrim"></div>
      <div className="hero-txt">
        <div className="eyebrow">Organic furniture · Handmade in the USA</div>
        <h1 className="h1">Made of nature. Built to last.</h1>
        <p className="hero-body">Sofas and chairs made by hand, one at a time, from solid hardwood, organic wool, linen and kapok. Nothing synthetic.</p>
        <div className="btns">
          <Link to="/collections/all" className="btn light">Shop the collection</Link>
          <Link to="/pages/design-your-own" className="btn outline-light">Design your own</Link>
        </div>
      </div>
    </section>
  );
}

function ValueStrip(){
  const vals = [
    ['Handmade in the USA', 'Built to order in our American workshop.'],
    ['Organic, all natural', 'Solid hardwood, organic wool, linen and kapok.'],
    ['Nothing synthetic', 'No foam, no chemical flame retardants, no plastic.'],
    ['As designed, or yours', 'Choose fabric, seat depth, length and finish.'],
  ];
  return (
    <section className="values">
      <div className="values-in">
        {vals.map(([t, d]) => <div className="val" key={t}><div className="val-t">{t}</div><div className="val-d">{d}</div></div>)}
      </div>
    </section>
  );
}

function HomeStatement(){
  return (
    <section className="statement" data-screen-label="Home · Statement">
      <p>Most furniture is built to be replaced.</p>
      <div className="gap"></div>
      <p>We build ours to be inherited.</p>
      <Link to="/pages/our-story" className="ulink light">Read our story</Link>
    </section>
  );
}

function HomeCollection(){
  return (
    <section className="sec" data-screen-label="Home · Collection">
      <div className="wrap">
        <div className="split-head">
          <div><div className="eyebrow">The collection</div><h2 className="h2">Six pieces, made one at a time.</h2></div>
          <p className="body">Four sofas and three chairs. Order each as we designed it, or make it yours.</p>
        </div>
        <div className="grid3">{PRODUCTS.map(p => <ProductCard key={p.id} p={p}/>)}</div>
      </div>
    </section>
  );
}

function HomeWays(){
  return (
    <section className="sec tint" data-screen-label="Home · Two ways">
      <div className="wrap">
        <div className="split-head">
          <div><div className="eyebrow">Two ways to own it</div><h2 className="h2">As designed, or as you'd like it.</h2></div>
          <p className="body">Choose a piece exactly as we designed it, or make it your own. Either way, it's made once, for one home.</p>
        </div>
        <div className="grid2">
          <div className="panel">
            <div className="panel-img"><Photo src="marlowe-2.jpg" label="The Marlowe as designed"/></div>
            <div className="eyebrow">As designed</div>
            <p className="body">Our fabrics, proportions and finishes, chosen to work together. The simplest way to begin.</p>
            <Link to="/collections/all" className="ulink">Shop the collection</Link>
          </div>
          <div className="panel">
            <div className="panel-img swgrid">
              {['linen','boucle','wool','leather'].map(f => (
                <div className={'swt tex-' + window.FABRICS[f].tex} key={f} style={{ background: window.FABRICS[f].swatch }}>
                  <span className={f === 'leather' ? 'lt' : ''}>{window.FABRICS[f].label}</span>
                </div>
              ))}
            </div>
            <div className="eyebrow">Made your way</div>
            <p className="body">Choose the fabric, seat depth, length and wood finish.</p>
            <Link to="/pages/design-your-own" className="ulink">Design your own</Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function MadeByHand(){
  return (
    <section className="sec" data-screen-label="Home · Made by hand">
      <div className="wrap made">
        <Photo src="frame-fill-cover.jpg" label="The frame, the fill, the cover" className="made-img"/>
        <div>
          <div className="eyebrow">Made by hand, in the USA</div>
          <h2 className="h2">Started when you order it. Finished for your home.</h2>
          <p className="body" style={{ marginTop:28 }}>Every piece is built to order by skilled craftspeople in our American workshop. Nothing sits in a warehouse.</p>
          <div className="steps">
            {[['The frame','Cut and joined by hand.'],['The fill','Layered by hand.'],['The cover','Fitted and stitched by hand.']].map(([t, d], i) => (
              <div className="step" key={t}><span className="step-n">0{i + 1}</span><div><div className="step-t">{t}</div><div className="step-d">{d}</div></div></div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

const MATERIALS = [
  ['Solid hardwood', 'Frames built to hold for generations.'],
  ['Organic wool', 'Natural loft and resilience in every cushion.'],
  ['Organic linen', 'Breathable, and softer with every year.'],
  ['Kapok', 'A light, plant-based fill in place of foam.'],
  ['Natural oils', 'Plant-based finishes for the wood.'],
];

function MaterialsBlock({ heading = true }){
  return (
    <>
      {heading && <div className="center-head"><div className="eyebrow">What goes into it</div><h2 className="h2">Materials you'd recognize.</h2></div>}
      <div className="mat-grid">
        {MATERIALS.map(([t, d]) => <div className="mat" key={t}><div className="mat-t">{t}</div><p className="mat-d">{d}</p></div>)}
      </div>
      <p className="closing">Nothing synthetic. No foam, no chemical flame retardants, no plastic.</p>
    </>
  );
}

function HomeMaterials(){
  return <section className="sec linen" data-screen-label="Home · Materials"><div className="wrap"><MaterialsBlock/></div></section>;
}

function HomeName(){
  return (
    <section className="sec" data-screen-label="Home · Name">
      <div className="wrap name">
        <div>
          <div className="eyebrow">Where the name comes from</div>
          <h2 className="h2">Named for the English countryside.</h2>
          <p className="body" style={{ marginTop:28 }}>Stone villages, hedgerows and old houses, where a good chair outlived the person who bought it. We took the spirit of those places, not the address. Everything we make is made here, in America.</p>
        </div>
        <div className="names">{PRODUCTS.map(p => <Link key={p.id} to={'/products/' + p.id}>{p.name}</Link>)}</div>
      </div>
    </section>
  );
}

function Newsletter(){
  const [done, setDone] = React.useState(false);
  return (
    <section className="sec nl" data-screen-label="Home · Newsletter">
      <div className="wrap center-head">
        <h2 className="h2">New pieces, when they're ready.</h2>
        <p className="body" style={{ marginTop:20 }}>A short letter when something new leaves the workshop. Nothing more.</p>
        {done ? <p className="nl-done">Thank you. You're on the list.</p> : (
          <form className="nl-form" onSubmit={(e) => { e.preventDefault(); setDone(true); }}>
            <input type="email" required placeholder="Email address" aria-label="Email address"/>
            <button type="submit">Subscribe</button>
          </form>
        )}
      </div>
    </section>
  );
}

function HomePage(){
  return (
    <main>
      <HomeHero/><ValueStrip/><HomeStatement/><HomeCollection/><HomeWays/><MadeByHand/><HomeMaterials/><HomeName/><Newsletter/>
    </main>
  );
}

Object.assign(window, { ProductCard, HomePage, MaterialsBlock, MadeByHand });
