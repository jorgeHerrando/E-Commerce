import React, { useState, useEffect } from 'react';
import LastProductInDb from './LastProductInDb';
import GenresInDb from './GenresInDb';

function ContentRowCenter(){
    // seteamos estado product
    const [product, setProduct] = useState();
    
    // comoonentDidMount()
    useEffect(() => {
    
        const getInfo = async () => {
          let resProduct = await fetch(`http://localhost:3001/api/products/last`);
          let productSaved = await resProduct.json();
          console.log(productSaved);

          let lastProduct = productSaved;
          console.log(lastProduct);
    

          setProduct(lastProduct);
          
        };
        getInfo();
      }, []);

   

    return (
        <div className="row">
            {product ?  <LastProductInDb {...product.product} /> : "Cargando..."}
            {/*<!-- Last Movie in DB -->*/}
            
            {/*<!-- End content row last movie in Data Base -->*/}

            {/*<!-- Genres in DB -->*/}
            <GenresInDb />

        </div>
    )
}

export default ContentRowCenter;