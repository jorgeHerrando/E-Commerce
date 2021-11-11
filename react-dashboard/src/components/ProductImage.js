import React from 'react';

function ProductImage(props){
    return(
        <div className="small-img-col">
                <img
                    src={`http://localhost:3001/images/products/${props.image}`}
                    alt=""
                    width="100%"
                    className="small-img"
                />
                </div>
    )}

export default ProductImage;