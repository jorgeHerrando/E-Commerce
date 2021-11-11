import React from 'react';

import './ProductCategory.css'

function ProductCategory (props) {
    return (
        <div className="col-lg-6 mb-4">
          <div className="card bg-dark text-white shadow">
            <div className="card-body tarjeta">
                <p>{props.name}</p>
                <p>{props.products.length}</p>
            </div>
          </div>
        </div>
    )
}

export default ProductCategory;
