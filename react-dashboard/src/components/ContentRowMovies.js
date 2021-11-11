import React, { useState, useEffect } from "react";
import SmallCard from "./SmallCard";

/*  Cada set de datos es un objeto literal */

/* <!-- Movies in DB --> */

function ContentRowMovies() {
  const [info, setInfo] = useState(null);
  const [products, setProducts] = useState();
  const [users, setUsers] = useState();
  const [brands, setBrands] = useState();
  const [categories, setCategories] = useState();
  const [subcategories, setSubcategories] = useState();
  const [orders, setOrders] = useState();


  useEffect(() => {

    const allInfo = async () => {
      let resProducts = await fetch(`http://localhost:3001/api/products/`);
      let productsSaved = await resProducts.json();
      // console.log(productsSaved);

      // title.push("Total de productos");
      // setTitle(title);
      // color.push("warning");
      // setColor(color);
      //   return products;

      let resUsers = await fetch(`http://localhost:3001/api/users/`);
      let usersSaved = await resUsers.json();
      // console.log(usersSaved);

      // title.push("Total de usuarios");
      // setTitle(title);
      // color.push("danger");
      // setColor(color);
      //   return users;

      let resCategories = await fetch(
        `http://localhost:3001/api/products/categories`
      );
      let categoriesSaved = await resCategories.json();
      // console.log(categoriesSaved);

      let resSubcategories = await fetch(
        `http://localhost:3001/api/products/subcategories`
      );
      let subcategoriesSaved = await resSubcategories.json();
      // console.log(subcategoriesSaved);

      // title.push("Total de categorías");
      // setTitle(title);
      // color.push("success");
      // setColor(color);
      //   return users;

      let resBrands = await fetch(`http://localhost:3001/api/products/brands`);
      let brandsSaved = await resBrands.json();
      // console.log(brandsSaved);

      let resOrders = await fetch(`http://localhost:3001/api/products/orders`);
      let ordersSaved = await resOrders.json();
      // console.log(ordersSaved);

      // title.push("Total de marcas");
      // setTitle(title);
      // color.push("primary");
      // setColor(color);
      setProducts({
        title: "Total de productos",
        quantity: productsSaved.meta.count,
        color: "warning",
        icon: "fa-clipboard-list"
      });
      setUsers({
        title: "Total de usuarios",
        quantity: usersSaved.meta.count,
        color: "primary",
        icon: "fa-users"
      });
      setCategories({
        title: "Total de categorías",
        quantity: categoriesSaved.meta.count,
        color: "danger",
        icon: "fa-asterisk"
      });
      setSubcategories({
        title: "Total de subcategorías",
        quantity: subcategoriesSaved.meta.count,
        color: "info",
        icon: "fa-arrows-alt"
      });
      setBrands({
        title: "Total de marcas",
        quantity: brandsSaved.meta.count,
        color: "success",
        icon: "fa-chess-knight"
      });
      setOrders({
        title: "Total de orders",
        quantity: ordersSaved.meta.count,
        color: "secondary",
        icon: "fa-columns"
      });
      // setInfo({
      //   products: products,
      //   users: users,
      //   categories: categories,
      //   brands: brands,
      // });
      //
      //   por que undefined???????
      //
      // console.log(info);
    };

    allInfo();
  }, []);

  useEffect(() => {
    // console.log(products);
    setInfo({ products, users, categories, subcategories, brands, orders });
  }, [products, users, categories, subcategories, brands, orders]);

  return (
    <div className="row">
      {/* {console.log(info)} */}
      {info && //why not info??????
        Object.values(info).map((category, i) => {
          return <SmallCard {...category} key={i} />;
        })}
    </div>
  );
}

export default ContentRowMovies;
