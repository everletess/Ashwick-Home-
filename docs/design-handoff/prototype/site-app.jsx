const { useRoute, useCartState, CartCtx, AnnouncementBar, Header, Footer, CartDrawer, HomePage, CollectionPage, ProductPage, DesignPage, TradePage, StoryPage, MaterialsPage, AccountPage } = window;

function App(){
  const route = useRoute();
  const cart = useCartState();
  let page;
  switch (route.name){
    case 'collection': page = <CollectionPage filter={route.filter}/>; break;
    case 'product':    page = <ProductPage id={route.id} custom={route.custom}/>; break;
    case 'design':     page = <DesignPage/>; break;
    case 'trade':      page = <TradePage/>; break;
    case 'story':      page = <StoryPage/>; break;
    case 'materials':  page = <MaterialsPage/>; break;
    case 'account':    page = <AccountPage/>; break;
    default:           page = <HomePage/>;
  }
  return (
    <CartCtx.Provider value={cart}>
      <AnnouncementBar/><Header/>{page}<Footer/><CartDrawer/>
    </CartCtx.Provider>
  );
}
ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
