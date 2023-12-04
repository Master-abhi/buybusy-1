import React, {useEffect, useState} from "react";
import styles from "../styles/Home.module.css"
import { useValue } from '../context';
import CartItems from "./CartItems";
import { Link } from "react-router-dom";
// import Data from "../Data/data"

const Home = ()=>{
    const {itemsData, onCart, cartTotal, addToOrder, logIn} = useValue();

    let t = 0
    
    const totalPrice = onCart
  ? onCart.reduce((acc, item) => acc + Math.trunc(item.items.price) * item.qty, 0)
  : 0;
    
    

    return(
        <>
        {
            logIn ? <div className={styles.container}>
            <div className={styles.sideContainer}>
                
                <div className={styles.filterContainer}>
                    <h3>Total Price</h3>
                    <h3>&#8377; {totalPrice * 80}</h3>
                    <button className={styles.purchase} onClick={()=> addToOrder(onCart)}>Purchase</button>
                </div>
            </div>
            <div className={styles.mainContainer}>
                {
                    onCart.length === 0 ? 
                <h1>Your cart is empty.</h1>
                :
                <div className={styles.itemsDiv}>
                {
                    onCart.map((item) => (
                        <CartItems item={item} qty={item.qty} key={item.id} />
                    ))
                }
                </div>
                

            }
            </div>
        </div> :
        document.location.href = "http://localhost:3000/"
        }
        
        </>
    )
}

export default Home;