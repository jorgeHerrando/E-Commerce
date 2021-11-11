import React, { useState, useEffect } from 'react';

import ProductCategory from './ProductCategory/ProductCategory';

function GenresInDb() {
  // estado
  const [categories, setCategories] = useState()

   // componentDidMount
   useEffect(() => {
    const info = async () => {
      let resCategories = await fetch(`http://localhost:3001/api/products/categories`);
      let categoriesSaved = await resCategories.json();

      setCategories(categoriesSaved); //products=productsSaved
    };
      info();
    }, []);

  return (
    <div className="col-lg-6 mb-4">
      <div className="card shadow mb-4">
        <div className="card-header py-3">
          <h5 className="m-0 font-weight-bold text-gray-800">
            Total Products in Categories
          </h5>
        </div>
        <div className="card-body">
          <div className="row">
          {categories && 
            categories.categories.map( ( categorie , i) => {
            return <ProductCategory {...categorie} key={i}/>
           })
          }
          </div>
        </div>
      </div>
    </div>
  );
}

export default GenresInDb;
