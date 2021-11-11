import React, { useState, useEffect } from "react";

import ProductImage from './ProductImage'

function ProductDetail(props){
    {console.log(props)}

    return(

<React.Fragment>
    <div className="small-container single-product">
        <div className="row">
            <div className="col-2 col-2-left">
                <div className="main-picture">
            
                <img src={`http://localhost:3001/images/products/${props.images[0].name}`} width="100%" alt="imagen de producto" id="ProductImg" />
                </div>
                <div className="small-img-row">

                {props.images.length >=4 ?  
                <React.Fragment>
                    <ProductImage image={props.images[0].name}/> 
                    <ProductImage image={props.images[1].name}/>
                    <ProductImage image={props.images[2].name}/>
                    <ProductImage image={props.images[3].name}/>
                </React.Fragment>
                    :
                    props.images.map(image => {
                    <ProductImage image={image.name}/>
                    })}

           
                </div>
            </div>
            <div className="col-2">
                {/* <!-- mostramos la marca y el nombre en mayúsculas --> */}
                <p>{props.brand.name.toUpperCase()}</p> 
                <h1>{props.name.toUpperCase()}</h1>

                {props.sale == 0 ?
                    <h4>{props.price}</h4>
                    :
                    <React.Fragment>
                        <h3 className="previous-price"><strike>{props.price}</strike></h3>

                        <h4 className="discount-price">{`$ ${(Math.round((Number(props.price) - (Number(props.price)*Number(props.discount))/100)*100)/100).toFixed(2)}`}</h4>
                        <p className="discount">{props.discount}% OFF</p>
                    </React.Fragment>
                }

                {/* <!-- esto se muestra si el producto dispone de tallas. --> */}
                {props.sizes[0].name != "Talle único" ?
                    <select name="size" id="sizes">
                    <option value="" disabled selected>Select Size</option>
                    {props.sizes.map(size => {
                        <option value="">{size.name}</option>
                    })}
                    </select>
                    : ""
                }
        

                <p>
                    <input type="number" value="1" />
                    <a href="#" className="btn">Add to Cart</a>
                    <h3>Product Details<i className="fa fa-indent"></i></h3>
                    <br />
                </p>
                <p>
                    {/* <!-- mostramos descripción --> */}
                    {props.description}
                </p>
            </div>
        </div>
    </div>
</React.Fragment>
    )
}

export default ProductDetail;
