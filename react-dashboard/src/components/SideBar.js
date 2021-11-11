import React, { useState, useEffect } from 'react';
import image from "../assets/images/logo-DH.png";
import ContentWrapper from "./ContentWrapper";
import GenresInDb from "./GenresInDb";
import LastProductInDb from "./LastProductInDb";
import ContentRowMovies from "./ContentRowMovies";
import SearchMovies from "./SearchMovies";
import ProductDetail from "./ProductDetail";
import Chart from './Chart';
import NotFound from "./NotFound";
import { Link, Route, Switch } from "react-router-dom";

function SideBar() {
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
      {/*<!-- Sidebar -->*/}
      <ul
        className="navbar-nav bg-gradient-secondary sidebar sidebar-dark accordion"
        id="accordionSidebar"
      >
        {/*<!-- Sidebar - Brand -->*/}
        <Link
          className="sidebar-brand d-flex align-items-center justify-content-center"
          to="/"
        >
          <div className="sidebar-brand-icon">
            <img className="w-100" src={image} alt="Digital House" />
          </div>
        </Link>

        {/*<!-- Divider -->*/}
        <hr className="sidebar-divider my-0" />

        {/*<!-- Nav Item - Dashboard -->*/}
        <li className="nav-item active">
          <Link className="nav-link" to="/SearchMovies">
            <i className="fas fa-fw fa-tachometer-alt"></i>
            <span>Dashboard - DH movies</span>
          </Link>
        </li>

        {/*<!-- Divider -->*/}
        <hr className="sidebar-divider" />

        {/*<!-- Heading -->*/}
        <div className="sidebar-heading">Actions</div>

        {/*<!-- Nav Item - Pages -->*/}
        <li className="nav-item">
          <Link className="nav-link" to="/GenresInDb">
            <i className="fas fa-fw fa-folder"></i>
            <span>Products in categories</span>
          </Link>
        </li>

        {/*<!-- Nav Item - Charts -->*/}
        <li className="nav-item">
          <Link className="nav-link" to="/LastProductInDb">
            <i className="fas fa-fw fa-chart-area"></i>
            <span>Last Product in Database</span>
          </Link>
        </li>

        {/*<!-- Nav Item - Tables -->*/}
        <li className="nav-item nav-link">
          <Link className="nav-link" to="/ContentRowMovies">
            <i className="fas fa-fw fa-table"></i>
            <span>Tables</span>
          </Link>
        </li>

        {/*<!-- Nav Item - Tables -->*/}
        <li className="nav-item nav-link">
          <Link className="nav-link" to="/Chart">
            <i className="fas fa-fw fa-table"></i>
            <span>Products List</span>
          </Link>
        </li>

        {/*<!-- Divider -->*/}
        <hr className="sidebar-divider d-none d-md-block" />
      </ul>
      {/*<!-- End of Sidebar -->*/}

      {/*<!-- Microdesafio 1 -->*/}
      {/*<!--<Route exact path="/">
                <ContentWrapper />
            </Route>
            <Route path="/GenresInDb">
                <GenresInDb />
            </Route>
            <Route path="/LastMovieInDb">
                <LastMovieInDb />
            </Route>
            <Route path="/ContentRowMovies">
                <ContentRowMovies />
            </Route>*/}
      {/*<!-- End Microdesafio 1 -->*/}

      {/*<!-- End Microdesafio 2 -->*/}
      <Switch>
        <Route exact path="/">
          <ContentWrapper />
        </Route>
        <Route path="/GenresInDb">
          <GenresInDb />
        </Route>
        <Route path="/LastProductInDb">
          <LastProductInDb />
        </Route>
        <Route path="/ContentRowMovies">
          <ContentRowMovies />
        </Route>
        <Route path="/SearchMovies">
          <SearchMovies />
        </Route>
        <Route path="/ProductDetail">
          {product && <ProductDetail {...product.product}/>}
        </Route>
        <Route path="/Chart">
          <Chart />
        </Route>
        
        <Route component={NotFound} />
      </Switch>
      {/*<!-- End Microdesafio 2 -->*/}
    </React.Fragment>
  );
}
export default SideBar;
