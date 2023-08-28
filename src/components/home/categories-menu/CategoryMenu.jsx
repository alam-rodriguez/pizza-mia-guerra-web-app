import React, { useContext, useEffect, useState } from 'react';

// Componentes
// import LoNuevoItem from '../section-lo-nuevo/LoNuevoItem';
import ArticleCard from './ArticleCard';

// Firebase
import { getArticlesByCategory } from '../../../firebase/firebaseFirestore';

// Context
import { AppContext } from '../../../context/AppContext';

const CategoryMenu = ({category, color1, setViewArticleSelected}) => {

  const { imagenesArticulos, setImagenesArticulos, articlesOfHome, setArticlesOfHome } = useContext(AppContext);

  const [articlesOfThisMenu, setArticlesOfThisMenu] = useState(null);

  useEffect( () => {
    console.log('first')
    console.log(category);
    const f = async () => {
      const res = await getArticlesByCategory(category.id);
      res.sort( (a,b) => a.position - b.position);
      setArticlesOfThisMenu(res);
      console.log(res);
    }
    f();
  }, [] );

  return (
    <section className='w-100 my-4 '>

      <div className='d-flex justify-content-between w-100'>
        <h3 className='fw-bold fs-4'>{category.nombre}</h3>
          <p className={`p-0 fs-6 fw-normal ${color1.textColor}`}>TODO</p>
        </div>
        <div className={`d-flex flex-nowrap ${articlesOfThisMenu != null ? 'overflow-x-scroll': ''}`}>

        { articlesOfThisMenu != null
          ? articlesOfThisMenu.map( (article) => {
            // let imgId = article.imgpath.split('/')[1];
            // console.log(imgId);
            // console.log(imagenesArticulos)
            // console.log(imagenesArticulos[imgId])
            return <ArticleCard
              key={article.id}
              title={article.titulo} 
              subTitle={article.subtitulo} 
              price={article.puntos}
              imgPath={article.imgpath}
              size={category.sizeView}
              isCategoryOfPoints={category.isCategoryOfPoints}
              setViewArticleSelected={setViewArticleSelected}
              // id='345678' 
            />
          })
          : <>
              <ArticleCard
                toCharge={true}
                key={0}
                size={category.sizeView}
                setViewArticleSelected={() => {}}
              />
              <ArticleCard
                toCharge={true}
                key={1}
                size={category.sizeView}
                setViewArticleSelected={() => {}}
              />
            </>
        }

      </div>
    </section>
  )
}

export default CategoryMenu
