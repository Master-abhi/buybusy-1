import React from "react";
import styles from "../styles/LogIn.module.css";
import { useValue } from "../context";
import { Link } from "react-router-dom";

function Orders() {
    const { onPurchase, signUp } = useValue();

    return (
        <div className={styles.mainContainer}>
            <h1>Sign Up page</h1>
            <div className={styles.logInForm}>
                <input type="email" placeholder="Enter your Email" id="email" required/>
                <input type="password" placeholder="Enter your Password" id="pass1" required/>
                <input type="password" placeholder="Confirm your Password" id="pass2" required/>
                <button type="submit" onClick={()=>signUp({email: document.getElementById("email").value,
                    pass1: document.getElementById("pass1").value,
                    pass2: document.getElementById("pass2").value})} >Sign up</button>
            </div>
            <Link to="/logIn">
            <p>Go to Log In page</p>
            </Link>
            
        </div>
    );
}

export default Orders;
