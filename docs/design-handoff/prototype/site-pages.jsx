// Ashwick Home — collection, product, pages (design-your-own, our-story, materials), account
const { PRODUCTS, PRODUCT_BY_ID, FABRICS, DEPTHS, LENGTHS, FINISHES, Link, Photo, Swatch, fmt, CartCtx, ProductCard, MaterialsBlock } = window;

function CollectionPage({ filter }){
  const items = filter === 'all' ? PRODUCTS : PRODUCTS.filter(p => p.category === filter);
  const title = filter === 'sofas' ? 'Sofas' : filter === 'chairs' ? 'Chairs' : 'The collection';
  const desc = filter === 'sofas' ? 'Four sofas, each made to order by hand.' : filter === 'chairs' ? 'Three chairs, each made to order by hand.' : 'Four sofas and three chairs. Order each as we designed it, or make it yours.';
  const tabs = [['All pieces','all'],['Sofas','sofas'],['Chairs','chairs']];
  return (
    <main data-screen-label={'Collection · ' + title}>
      <section className="page-head wrap">
        <div className="eyebrow">Shop</div>
        <h1 className="h1">{title}</h1>
        <p className="body">{desc}</p>
      </section>
      <div className="tabs wrap">
        {tabs.map(([l, f]) => <Link key={f} to={'/collections/' + f} className={filter === f ? 'on' : ''}>{l}</Link>)}
      </div>
      <section className="wrap" style={{ paddingBottom:140 }}>
        <div className="grid3">{items.map(p => <ProductCard key={p.id} p={p}/>)}</div>
      </section>
    </main>
  );
}

function OptGroup({ label, value, children }){
  return (
    <div className="opt">
      <div className="opt-l"><span className="eyebrow">{label}</span><span className="opt-v">{value}</span></div>
      <div className="opt-c">{children}</div>
    </div>
  );
}

function ProductPage({ id, custom }){
  const p = PRODUCT_BY_ID[id];
  const cart = React.useContext(CartCtx);
  const [mode, setMode] = React.useState(custom ? 'custom' : 'designed');
  const [img, setImg] = React.useState(0);
  const [fabric, setFabric] = React.useState(p ? p.designedFabric : null);
  const [depth, setDepth] = React.useState('standard');
  const [length, setLength] = React.useState('standard');
  const [finish, setFinish] = React.useState('natural');
  React.useEffect(() => { setMode(custom ? 'custom' : 'designed'); setImg(0); if (p){ setFabric(p.designedFabric); setDepth('standard'); setLength('standard'); setFinish('natural'); } }, [id, custom]);
  if (!p) return <main className="wrap page-head"><h1 className="h1">Piece not found.</h1></main>;

  const canCustomFabric = p.fabrics.length > 1;
  const sel = mode === 'designed'
    ? { fabric:p.designedFabric, depth:'standard', length:'standard', finish:'natural' }
    : { fabric, depth, length, finish };
  const lab = (arr, v) => arr.find(o => o.id === v)?.label;
  const summary = [
    sel.fabric && ['Fabric', FABRICS[sel.fabric].label],
    p.depth && ['Seat depth', lab(DEPTHS, sel.depth)],
    p.length && ['Length', lab(LENGTHS, sel.length)],
    p.finish && ['Wood finish', lab(FINISHES, sel.finish)],
  ].filter(Boolean);

  const add = () => cart.add({ id:p.id, name:p.name, photo:p.photos[0], price:p.price, qty:1, mode: mode === 'designed' ? 'As designed' : 'Customized', options:summary });
  const others = PRODUCTS.filter(o => o.id !== p.id && o.category === p.category).concat(PRODUCTS.filter(o => o.category !== p.category)).slice(0, 3);

  return (
    <main data-screen-label={'Product · ' + p.name}>
      <div className="crumb wrap">
        <Link to="/">Home</Link><span>/</span><Link to={'/collections/' + p.category}>{p.category === 'sofas' ? 'Sofas' : 'Chairs'}</Link><span>/</span><span>{p.name}</span>
      </div>
      <section className="pdp wrap">
        <div className="gal">
          <div className="gal-main"><Photo src={p.photos[img]} label={p.name}/></div>
          {p.photos.length > 1 && (
            <div className="gal-thumbs">
              {p.photos.map((ph, i) => <button key={ph} className={i === img ? 'on' : ''} onClick={() => setImg(i)} aria-label={'Image ' + (i + 1)}><Photo src={ph} label={p.name}/></button>)}
            </div>
          )}
        </div>
        <div className="info">
          <div className="eyebrow">{p.type} · Made to order · Handmade in the USA</div>
          <h1 className="pdp-name">{p.name}</h1>
          <div className="pdp-price">{p.priceFrom ? 'From ' : ''}{fmt(p.price)}</div>
          <p className="body">{p.line}</p>

          <div className="mode" role="tablist">
            <button className={mode === 'designed' ? 'on' : ''} onClick={() => setMode('designed')}>As designed</button>
            <button className={mode === 'custom' ? 'on' : ''} onClick={() => setMode('custom')}>Customize</button>
          </div>

          {mode === 'designed' ? (
            <div className="designed">
              <p className="body small">Our fabrics, proportions and finishes, chosen to work together.</p>
              <dl className="dl">{summary.map(([k, v]) => <React.Fragment key={k}><dt>{k}</dt><dd>{v}</dd></React.Fragment>)}</dl>
            </div>
          ) : (
            <div className="custom">
              {canCustomFabric && (
                <OptGroup label="Fabric" value={FABRICS[fabric].label}>
                  {p.fabrics.map(f => <Swatch key={f} f={f} size={52} on={fabric === f} onClick={() => setFabric(f)}/>)}
                </OptGroup>
              )}
              {p.depth && <OptGroup label="Seat depth" value={lab(DEPTHS, depth)}>{DEPTHS.map(o => <button key={o.id} className={'pill' + (depth === o.id ? ' on' : '')} onClick={() => setDepth(o.id)}>{o.label}</button>)}</OptGroup>}
              {p.length && <OptGroup label="Length" value={lab(LENGTHS, length)}>{LENGTHS.map(o => <button key={o.id} className={'pill' + (length === o.id ? ' on' : '')} onClick={() => setLength(o.id)}>{o.label}</button>)}</OptGroup>}
              {p.finish && <OptGroup label="Wood finish" value={lab(FINISHES, finish)}>{FINISHES.map(o => <button key={o.id} className={'pill' + (finish === o.id ? ' on' : '')} onClick={() => setFinish(o.id)}>{o.label}</button>)}</OptGroup>}
              <p className="fine">Custom pricing: [PRICE]. Dimensions for each option: [DIMENSIONS].</p>
            </div>
          )}

          <button className="btn full" onClick={add}>Add to cart · {fmt(p.price)}</button>
          <div className="assure">
            <span>Made to order</span><span>Handmade in the USA</span><span>Paid in full at checkout</span>
          </div>
          <a href="#" className="ulink">Order fabric swatches</a>
        </div>
      </section>

      <section className="sec linen">
        <div className="wrap specs">
          <div><div className="eyebrow">Details</div><h2 className="h2">{p.name}</h2></div>
          <div className="spec-grid">
            <div className="spec"><div className="eyebrow">Materials</div><p>{p.materials}</p></div>
            <div className="spec"><div className="eyebrow">Dimensions</div><p>[DIMENSIONS]</p></div>
            <div className="spec"><div className="eyebrow">Made</div><p>To order, by hand, in our American workshop.</p></div>
            <div className="spec"><div className="eyebrow">Payment</div><p>In full at checkout.</p></div>
          </div>
        </div>
      </section>

      <section className="sec">
        <div className="wrap">
          <div className="split-head"><div><div className="eyebrow">The collection</div><h2 className="h2">More from the collection.</h2></div></div>
          <div className="grid3">{others.map(o => <ProductCard key={o.id} p={o}/>)}</div>
        </div>
      </section>
    </main>
  );
}

function scrollToId(id){ const el = document.getElementById(id); if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 90, behavior:'smooth' }); }

function BespokeForm(){
  const [sent, setSent] = React.useState(false);
  const [mats, setMats] = React.useState([]);
  const toggle = (m) => setMats(c => c.includes(m) ? c.filter(x => x !== m) : [...c, m]);
  if (sent) return <div className="trade-done"><h3 className="proc-h">Thank you.</h3><p className="body">We've received your idea and will be in touch to talk it through.</p></div>;
  return (
    <form className="tform" onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
      <label><span className="eyebrow">Name</span><input required/></label>
      <label><span className="eyebrow">Email</span><input type="email" required/></label>
      <label><span className="eyebrow">Phone</span><input type="tel"/></label>
      <label><span className="eyebrow">What would you like made?</span>
        <select defaultValue=""><option value="" disabled>Select</option><option>Sofa</option><option>Chair</option><option>Sectional</option><option>Bench</option><option>Ottoman</option><option>Other</option></select>
      </label>
      <label className="full"><span className="eyebrow">Approximate size</span><input placeholder="Width × depth × height, or the space it needs to fit"/></label>
      <div className="full mat-pick">
        <span className="eyebrow">Materials you're drawn to</span>
        <div className="opt-c">
          {['Solid hardwood','Organic wool','Organic linen','Organic wool bouclé','Brushed organic wool','Vegetable-tanned leather'].map(m => (
            <button type="button" key={m} className={'pill' + (mats.includes(m) ? ' on' : '')} onClick={() => toggle(m)}>{m}</button>
          ))}
        </div>
      </div>
      <label className="full"><span className="eyebrow">Describe your piece</span><textarea rows="5" placeholder="How you'll use it, the room it's for, the feeling you want"></textarea></label>
      <label className="full file"><span className="eyebrow">Sketches or inspiration photos</span><input type="file" multiple accept="image/*,.pdf"/></label>
      <button className="btn full" type="submit">Send your idea</button>
    </form>
  );
}

function DesignPage(){
  const steps = [
    { n:'01', t:'Start with a piece, or an idea', d:'Begin with one of our six pieces, or send us a sketch, a photo or a description of something that doesn\u2019t exist yet.', img:'csofa-a.jpg' },
    { n:'02', t:'Make it yours', d:'Choose the fabric, seat depth, length and wood finish. Every option, and every bespoke piece, is made from the same materials: solid hardwood, organic wool, organic linen, kapok and natural oils.', swatches:true, link:['Order fabric swatches','#'] },
    { n:'03', t:'Talk it through', d:'For customized pieces, write to us any time before you order. For bespoke pieces, we\u2019ll talk through proportions, materials and how the piece will be used before anything is made.', link:['Contact us','#'] },
    { n:'04', t:'Order and pay', d:'Customized pieces are ordered online and paid in full at checkout. Bespoke pieces: [BESPOKE ORDERING DETAILS].' },
    { n:'05', t:'Made by hand, in the USA', d:'Your piece is started when you order it. In our American workshop the frame is cut and joined by hand, the fill is layered by hand, and the cover is fitted and stitched by hand.', ph:'Hands at work in the workshop' },
    { n:'06', t:'Delivered to your home', d:'[DELIVERY DETAILS]', link:['Delivery information','#'] },
  ];
  return (
    <main data-screen-label="Page · Design your own">
      <section className="hero hero-sm">
        <Photo src="marlowe-2.jpg" label="The Marlowe"/>
        <div className="hero-scrim"></div>
        <div className="hero-txt">
          <div className="eyebrow">Design your own</div>
          <h1 className="h1">Make one of ours yours, or make something new.</h1>
          <p className="hero-body">Customize a piece from our collection, or design something entirely your own. Either way, it's made once, by hand, for one home.</p>
        </div>
      </section>

      <section className="sec">
        <div className="wrap center-head">
          <div className="eyebrow">Two ways to begin</div>
          <h2 className="h2">Choose a piece, or bring us an idea.</h2>
        </div>
        <div className="wrap grid2 approach">
          <div className="appr">
            <div className="proc-n">01</div>
            <div className="appr-n">Customize a piece</div>
            <p className="body">Start with one of our six pieces and change the fabric, seat depth, length or wood finish. It's built to your choices from the first cut.</p>
            <a href="#" className="ulink" onClick={(e) => { e.preventDefault(); scrollToId('choose'); }}>Choose a piece</a>
          </div>
          <div className="appr">
            <div className="proc-n">02</div>
            <div className="appr-n">Design your own piece</div>
            <p className="body">Have something in mind that isn't in our collection? Send us a sketch, a photo or a description, and we'll make it by hand from the materials we trust.</p>
            <a href="#" className="ulink" onClick={(e) => { e.preventDefault(); scrollToId('bespoke'); }}>Start your design</a>
          </div>
        </div>
      </section>

      <section className="sec tint">
        <div className="wrap">
          <div className="center-head" style={{ marginBottom:88 }}>
            <div className="eyebrow">The process</div>
            <h2 className="h2">From your idea to your home.</h2>
          </div>
          <div className="process">
            {steps.map((s, i) => {
              const visual = s.img || s.swatches || s.ph;
              return (
                <div className={'proc' + (visual ? '' : ' txt') + (i % 2 ? ' rev' : '')} key={s.n}>
                  {visual && (
                    <div className="proc-v">
                      {s.img && <Photo src={s.img} label={s.t}/>}
                      {s.ph && <Photo label={s.ph}/>}
                      {s.swatches && (
                        <div className="swgrid">
                          {['linen','boucle','wool','leather'].map(f => (
                            <div className={'swt tex-' + FABRICS[f].tex} key={f} style={{ background:FABRICS[f].swatch }}><span className={f === 'leather' ? 'lt' : ''}>{FABRICS[f].label}</span></div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                  <div className="proc-t">
                    <div className="proc-n">{s.n}</div>
                    <h3 className="proc-h">{s.t}</h3>
                    <p className="body">{s.d}</p>
                    {s.link && <a href="#" className="ulink">{s.link[0]}</a>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="sec" id="choose">
        <div className="wrap">
          <div className="split-head"><div><div className="eyebrow">01 · Customize a piece</div><h2 className="h2">Choose a piece to customize.</h2></div><p className="body">Each piece opens with the options it offers: fabric, seat depth, length and wood finish.</p></div>
          <div className="grid3">{PRODUCTS.map(p => <ProductCard key={p.id} p={p} custom/>)}</div>
        </div>
      </section>

      <section className="sec linen" id="bespoke">
        <div className="wrap trade-apply">
          <div>
            <div className="eyebrow">02 · Design your own piece</div>
            <h2 className="h2">Tell us what you'd like made.</h2>
            <p className="body" style={{ marginTop:24 }}>A sofa for an awkward wall, a chair to match one you already love, a piece that doesn't exist yet. Send us what you have and we'll talk it through with you.</p>
            <p className="body" style={{ marginTop:18 }}>Everything is made by hand in our American workshop from solid hardwood, organic wool, organic linen, kapok and natural oils. Nothing synthetic.</p>
            <div className="trade-contact"><div className="eyebrow">Bespoke pricing &amp; timing</div><p>[BESPOKE DETAILS]</p></div>
          </div>
          <BespokeForm/>
        </div>
      </section>
    </main>
  );
}

function TradePage(){
  const [sent, setSent] = React.useState(false);
  const offers = [
    ['Every piece, customizable', 'Specify fabric, seat depth, length and wood finish on any piece in the collection.'],
    ['Fabric swatches', 'Physical swatches of our organic linen, organic wool bouclé, brushed organic wool and vegetable-tanned leather.'],
    ['Made to order in the USA', 'Each piece is built by hand in our American workshop once the order is placed.'],
    ['Trade pricing', '[TRADE TERMS]'],
  ];
  return (
    <main data-screen-label="Page · Trade">
      <section className="hero hero-sm">
        <Photo src="hero.jpg" label="Ashwick interior"/>
        <div className="hero-scrim"></div>
        <div className="hero-txt">
          <div className="eyebrow">Trade</div>
          <h1 className="h1">For designers and architects.</h1>
          <p className="hero-body">Organic furniture for residential and hospitality projects, handmade to order in the USA.</p>
          <div className="btns"><a href="#apply" className="btn light" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: document.getElementById('apply').getBoundingClientRect().top + window.scrollY - 90, behavior:'smooth' }); }}>Apply for a trade account</a></div>
        </div>
      </section>

      <section className="sec">
        <div className="wrap">
          <div className="split-head">
            <div><div className="eyebrow">The trade program</div><h2 className="h2">What we offer the trade.</h2></div>
            <p className="body">Solid hardwood, organic wool, organic linen, kapok and natural oils. No foam, no chemical flame retardants, no plastic. Specified to your project.</p>
          </div>
          <div className="offer-grid">
            {offers.map(([t, d]) => <div className="mat" key={t}><div className="mat-t">{t}</div><p className="mat-d">{d}</p></div>)}
          </div>
        </div>
      </section>

      <section className="sec linen">
        <div className="wrap">
          <div className="center-head" style={{ marginBottom:64 }}><div className="eyebrow">How it works</div><h2 className="h2">Three steps to your first order.</h2></div>
          <div className="tsteps">
            {[['01','Apply','Send us the form below with your firm details.'],['02','Get approved','We review your application and set up your trade account. [APPROVAL DETAILS]'],['03','Specify and order','Choose pieces as designed or customized, request swatches, and place orders through your account.']].map(([n, t, d]) => (
              <div className="tstep" key={n}><div className="proc-n">{n}</div><h3 className="proc-h">{t}</h3><p className="body">{d}</p></div>
            ))}
          </div>
        </div>
      </section>

      <section className="sec" id="apply">
        <div className="wrap trade-apply">
          <div>
            <div className="eyebrow">Apply</div>
            <h2 className="h2">Apply for a trade account.</h2>
            <p className="body" style={{ marginTop:24 }}>Open to interior designers, architects, stylists and hospitality buyers.</p>
            <div className="trade-contact"><div className="eyebrow">Trade enquiries</div><p>[TRADE EMAIL]</p></div>
          </div>
          {sent ? <div className="trade-done"><h3 className="proc-h">Thank you.</h3><p className="body">We've received your application and will be in touch.</p></div> : (
            <form className="tform" onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
              <label><span className="eyebrow">First name</span><input required/></label>
              <label><span className="eyebrow">Last name</span><input required/></label>
              <label className="full"><span className="eyebrow">Firm name</span><input required/></label>
              <label><span className="eyebrow">Email</span><input type="email" required/></label>
              <label><span className="eyebrow">Phone</span><input type="tel"/></label>
              <label className="full"><span className="eyebrow">Website or portfolio</span><input/></label>
              <label><span className="eyebrow">Profession</span>
                <select defaultValue=""><option value="" disabled>Select</option><option>Interior designer</option><option>Architect</option><option>Stylist</option><option>Hospitality</option><option>Other</option></select>
              </label>
              <label><span className="eyebrow">State</span><input/></label>
              <label className="full"><span className="eyebrow">Tell us about your project</span><textarea rows="4"></textarea></label>
              <button className="btn full" type="submit">Submit application</button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}

function StoryPage(){
  return (
    <main data-screen-label="Page · Our story">
      <section className="statement tall">
        <div className="eyebrow light">Our story</div>
        <p>Most furniture is built to be replaced.</p>
        <div className="gap"></div>
        <p>We build ours to be inherited.</p>
      </section>
      <section className="sec">
        <div className="prose">
          <p>We started Ashwick because too much furniture isn't built to be lived with. It's built to be replaced: made fast and cheap, finished in chemicals you can't pronounce, and filled with things that shouldn't be in a home.</p>
          <p>We thought there should be another option. We wanted furniture made the way it used to be: slowly, by hand, from materials you'd recognize and could trust.</p>
          <h2>Where the name comes from</h2>
          <p>Ashwick takes its name from the English countryside, a place of stone villages, hedgerows and old houses where a good chair outlived the person who bought it. That's the idea we build around, and every piece carries the name of a British place: the Marlowe, the Chatsworth, the Pembroke. We took the spirit of those places, not the address. Everything we make is made here, in America.</p>
          <h2>Made by hand, in the USA</h2>
          <p>Every piece is built to order by skilled craftspeople in our American workshop. Frames are cut and joined by hand, the fill is layered by hand, and the fabric is fitted and stitched by hand. Nothing sits in a warehouse. Your piece is started when you order it and finished for your home.</p>
          <h2>What goes into it</h2>
          <p>Solid hardwood frames. Organic wool, linen and kapok. Natural oils. Nothing synthetic: no foam, no chemical flame retardants, no plastic. If we can't make a piece from materials we trust, we don't make it.</p>
          <h2>As designed, or as you'd like it</h2>
          <p>Choose a piece as we designed it, or make it your own with a different fabric, depth, length or finish. Either way, it's made once, for one home.</p>
          <p className="prose-close">One piece at a time, for one home at a time. Built to last a lifetime, then handed down.</p>
          <p className="prose-sign">Made of nature. Built to last.</p>
        </div>
      </section>
    </main>
  );
}

function MaterialsPage(){
  return (
    <main data-screen-label="Page · Materials">
      <section className="page-head wrap">
        <div className="eyebrow">Materials</div>
        <h1 className="h1">Materials you'd recognize.</h1>
        <p className="body">If we can't make a piece from materials we trust, we don't make it.</p>
      </section>
      <section className="sec linen"><div className="wrap"><MaterialsBlock heading={false}/></div></section>
      <window.MadeByHand/>
    </main>
  );
}

function AccountPage(){
  return (
    <main data-screen-label="Account · Sign in">
      <section className="acct">
        <div className="eyebrow">Account</div>
        <h1 className="h2">Sign in</h1>
        <form className="acct-form" onSubmit={(e) => e.preventDefault()}>
          <label><span className="eyebrow">Email</span><input type="email" autoComplete="email"/></label>
          <label><span className="eyebrow">Password</span><input type="password" autoComplete="current-password"/></label>
          <button className="btn full" type="submit">Sign in</button>
        </form>
        <div className="acct-links"><a href="#">Forgot your password?</a><a href="#">Create an account</a></div>
      </section>
    </main>
  );
}

Object.assign(window, { CollectionPage, ProductPage, DesignPage, TradePage, StoryPage, MaterialsPage, AccountPage });
