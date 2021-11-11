import React from 'react';


function ChartRow(props){
    return (
                <tr>
                    <td><img className="img-fluid px-3 px-sm-4 mt-3 mb-4" style={{width: 8 +'rem'}} src={`http://localhost:3001/images/products/${props.images[0].name}`} alt=" Last product image "/></td>
                    <td>{props.name}</td>
                    <td>{props.price}</td>
                    <td>
                        <ul>
                            {props.sizes.map( (size,i) => 
                                <li key={`size ${i}`}>{size.name}</li>
                            )}
                        </ul>
                    </td>
                    {/* <td>{props.Awards}</td> */}
                </tr>
            )
    }
    
        

export default ChartRow;