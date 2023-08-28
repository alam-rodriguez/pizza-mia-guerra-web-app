// Reatc
import { createContext, useState } from 'react';

// Context
export const AppContext = createContext();

const AppContextProvider = ({children}) => {

  // Color principal
  const [color1, setColor1] = useState({
    bgColor    : 'bg-success',
    textColor  : 'text-success',
    btn        : 'btn-success',
    btnOutline : 'btn-outline-success',
  });
  // const [color1, setColor1] = useState('bg-success');
  // const [color1Text, setColor1Text] = useState('text-success');
  // const [color1BtnOutline, setColor1BtnOutline] = useState('btn-outline-success');

  const [categories, setCategories] = useState(null);

  const [categoriesOfMenu, setCategoriesOfMenu] = useState(null);

  const [articleSeleted, setArticleSeleted] = useState(null);

  const [viewMenu, setViewMenu] = useState(false);

  const [isAdmin, setIsAdmin] = useState('');

  const [email, setEmail] = useState(null);

  const [appInfo, setAppInfo] = useState(null);

  const [goToHome, setGoToHome] = useState(true);

  const [appCategories, setAppCategories] = useState([]);

  const [categorySelected, setCategorySelected] = useState(null);

  const [articleSelected, setArticleSelected] = useState(null);

  const [precioArticleSelected, setPrecioArticleSelected] = useState(null);

  const [cart, setCart] = useState([]);

  const [cartOfCategoryPoints, setCartOfCategoryPoints] = useState([]);

  const [SeletedOrder, setSeletedOrder] = useState(null);

  const [infoPoints, setInfoPoints] = useState(null);

  const [clientOrders, setClientOrders] = useState(null);

  const [infoPointsUser, setInfoPointsUser] = useState(null);

  const [amountPoints, setAmountPoints] = useState(0);

  const [codeUser, setCodeUser] = useState(null);

  const [estadisticasUser, setEstadisticasUser] = useState(null);

  const [articlesOfHome, setArticlesOfHome] = useState(null);

  const [imagenesCategorias, setImagenesCategorias] = useState({});

  const [imagenesArticulos, setImagenesArticulos] = useState({});

  const [haEstadoEnHome, sethaEstadoEnHome] = useState(false);

  const [haEstadoEnMenu, setHaEstadoEnMenu] = useState(false);

  const [adminsTokens, setAdminsTokens] = useState([]);

  return(
    <AppContext.Provider 
      value={{
        categories, setCategories,
        categoriesOfMenu, setCategoriesOfMenu,
        color1,
        articleSeleted, setArticleSeleted,
        viewMenu, setViewMenu,
        isAdmin, setIsAdmin,
        email, setEmail,
        appInfo, setAppInfo,
        goToHome, setGoToHome,
        appCategories, setAppCategories,
        categorySelected, setCategorySelected,
        articleSelected, setArticleSelected,
        precioArticleSelected, setPrecioArticleSelected,
        cart, setCart,
        cartOfCategoryPoints, setCartOfCategoryPoints,
        SeletedOrder, setSeletedOrder,
        infoPoints, setInfoPoints,
        clientOrders, setClientOrders,
        infoPointsUser, setInfoPointsUser,
        amountPoints, setAmountPoints,
        codeUser, setCodeUser,
        estadisticasUser, setEstadisticasUser,
        articlesOfHome, setArticlesOfHome,
        imagenesCategorias, setImagenesCategorias,
        imagenesArticulos, setImagenesArticulos,
        haEstadoEnHome, sethaEstadoEnHome,
        haEstadoEnMenu, setHaEstadoEnMenu,
        adminsTokens, setAdminsTokens,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}


export default AppContextProvider;