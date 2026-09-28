// Ashwick Home — shell: announcement, header, mobile menu, footer, cart drawer
const { Link, CartCtx, fmt } = window;

function Wordmark({ tagline = true }){
  return (
    <Link to="/" className="wm">
      <span className="wm-t">ASHWICK HOME</span>
      {tagline && <span className="wm-s">Made of nature. Built to last.</span>}
    </Link>
  );
}

function AnnouncementBar(){
  return <div className="announce">Handmade to order in the USA · Nothing synthetic</div>;
}

function Header(){
  const cart = React.useContext(CartCtx);
  const [menu, setMenu] = React.useState(false);
  React.useEffect(() => { const c = () => setMenu(false); window.addEventListener('hashchange', c); return () => window.removeEventListener('hashchange', c); }, []);
  const openCart = (e) => { e.preventDefault(); cart.setOpen(true); };
  return (
    <header className="hdr">
      <div className="hdr-in">
        <nav className="nav">
          <Link to="/collections/all">Shop</Link>
          <Link to="/collections/sofas">Sofas</Link>
          <Link to="/collections/chairs">Chairs</Link>
          <Link to="/pages/design-your-own">Design your own</Link>
        </nav>
        <button className="burger" aria-label="Menu" onClick={() => setMenu(true)}><span></span><span></span></button>
        <Wordmark/>
        <nav className="nav r">
          <Link to="/pages/our-story">Our story</Link>
          <Link to="/pages/materials">Materials</Link>
          <Link to="/account">Account</Link>
          <a href="#" onClick={openCart}>Cart ({cart.count})</a>
        </nav>
        <a href="#" className="mcart" onClick={openCart}>Cart ({cart.count})</a>
      </div>
      {menu && (
        <div className="mmenu">
          <div className="mmenu-top"><Wordmark tagline={false}/><button className="x" aria-label="Close" onClick={() => setMenu(false)}>×</button></div>
          <nav className="mmenu-links">
            <Link to="/collections/all">Shop</Link>
            <Link to="/collections/sofas">Sofas</Link>
            <Link to="/collections/chairs">Chairs</Link>
            <Link to="/pages/design-your-own">Design your own</Link>
          </nav>
          <nav className="mmenu-sub">
            <Link to="/pages/our-story">Our story</Link>
            <Link to="/pages/materials">Materials</Link>
            <Link to="/account">Account</Link>
          </nav>
        </div>
      )}
    </header>
  );
}

function FootCol({ title, links }){
  return (
    <div className="fcol">
      <div className="fcol-t">{title}</div>
      {links.map(([l, to]) => to.startsWith('/') ? <Link key={l} to={to}>{l}</Link> : <a key={l} href="#">{l}</a>)}
    </div>
  );
}

function Footer(){
  return (
    <footer className="ftr">
      <div className="wrap">
        <div className="ftr-grid">
          <div className="ftr-brand">
            <Wordmark/>
          </div>
          <FootCol title="Shop" links={[['All pieces','/collections/all'],['Sofas','/collections/sofas'],['Chairs','/collections/chairs'],['Design your own','/pages/design-your-own'],['Fabric swatches','#']]}/>
          <FootCol title="Ashwick" links={[['Our story','/pages/our-story'],['Materials','/pages/materials'],['Care','#'],['Trade','/pages/trade']]}/>
          <FootCol title="Help" links={[['Delivery','#'],['Ordering','#'],['FAQs','#'],['Contact','#']]}/>
        </div>
        <div className="ftr-bot">
          <span>© 2026 Ashwick Home, LLC</span>
          <span>Handmade in the USA</span>
          <a href="#">Instagram</a>
          <a href="#">Pinterest</a>
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
        </div>
      </div>
    </footer>
  );
}

function CartDrawer(){
  const cart = React.useContext(CartCtx);
  return (
    <>
      <div className={'scrim' + (cart.open ? ' on' : '')} onClick={() => cart.setOpen(false)}></div>
      <aside className={'drawer' + (cart.open ? ' on' : '')} aria-hidden={!cart.open}>
        <div className="drawer-h">
          <div className="h3">Your cart</div>
          <button className="x" aria-label="Close cart" onClick={() => cart.setOpen(false)}>×</button>
        </div>
        <div className="drawer-b">
          {cart.items.length === 0 && (
            <div className="empty">
              <p className="body">Your cart is empty.</p>
              <Link to="/collections/all" className="btn" onClick={() => cart.setOpen(false)}>Shop the collection</Link>
            </div>
          )}
          {cart.items.map(i => (
            <div className="line" key={i.lineId}>
              <window.Photo src={i.photo} label={i.name} className="line-img"/>
              <div>
                <div className="line-top"><span className="line-name">{i.name}</span><span className="line-price">{i.price == null ? '[PRICE]' : fmt(i.price * i.qty)}</span></div>
                <div className="line-mode">{i.mode}</div>
                {i.options.map(([k, v]) => <div className="line-opt" key={k}><span>{k}</span>{v}</div>)}
                <div className="line-act">
                  <div className="qty"><button onClick={() => cart.qty(i.lineId, i.qty - 1)}>−</button><span>{i.qty}</span><button onClick={() => cart.qty(i.lineId, i.qty + 1)}>+</button></div>
                  <button className="rm" onClick={() => cart.remove(i.lineId)}>Remove</button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {cart.items.length > 0 && (
          <div className="drawer-f">
            <div className="sub"><span className="eyebrow">Subtotal</span><span className="sub-v">{fmt(cart.subtotal)}</span></div>
            <p className="fine">Paid in full at checkout. Taxes and shipping calculated at checkout.</p>
            <button className="btn full">Check out</button>
          </div>
        )}
      </aside>
    </>
  );
}

Object.assign(window, { Wordmark, AnnouncementBar, Header, Footer, CartDrawer });
