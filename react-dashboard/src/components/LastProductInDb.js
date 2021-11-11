import React, { useState, useEffect } from 'react';

import ProductDetail from './ProductDetail';
import NotFound from './NotFound'

import { Link, Route, Switch } from "react-router-dom";


function LastProductInDb(props){
    const [product, setProduct] = useState();
    
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
      console.log(product);
    }, []);

    return (
        <React.Fragment>
            <div className = "row">
                <div className="col-lg-6 mb-4">
                    <div className="card shadow mb-4">
                        <div className="card-header py-3">
                            <h5 className="m-0 font-weight-bold text-gray-800">Last product in Data Base</h5>
                        </div>
                        {product &&
                        <div className="card-body">
                            <div className="text-center">
                                <img className="img-fluid px-3 px-sm-4 mt-3 mb-4" style={{width: 40 +'rem'}} src={`http://localhost:3001/images/products/${product.product.images[0].name}`} alt=" Last product image "/>
                            </div>
                            <p>{product.product.description}</p>
                            <Link className="btn btn-danger" rel="nofollow" to="/ProductDetail">View product detail</Link>
                        </div>}
                    </div>
                </div>
            </div>

        {/* <Switch> 
            <Route path="/ProductDetail"> 
                {product && <ProductDetail product={product.product}/>}
            </Route> 
            <Route component={NotFound} />
        </Switch> */}

        </React.Fragment>
    )
}

export default LastProductInDb;
