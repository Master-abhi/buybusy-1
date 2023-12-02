import React from "react";
import styles from "../styles/LogIn.module.css";
import { useValue } from "../context";
import {Link} from "react-router-dom"

function Orders() {
    const { onPurchase , logIn, logInbtn} = useValue();

    return (
        
    <div className={styles.mainContainer}>
            <h1>Log In</h1>
            <div className={styles.logInForm}>
                <input type="email" placeholder="Enter your Email" id="name" required/>
                <input type="password" placeholder="Enter your Password" id="password" required/>
                <button type="submit" onClick={()=>logInbtn({email: document.getElementById("name").value, password: document.getElementById("password").value})}>Log In</button>
            </div>
            <Link to="/signUp">
            <p>Go to Sign up page</p>
            </Link>
        </div>
    
    );
}

export default Orders;
