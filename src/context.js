import { createContext, useContext, useState, useEffect } from "react";
import {db} from "./firebaseinit";
import { doc, addDoc, Timestamp, updateDoc, collection, onSnapshot, deleteDoc, getDocs} from "firebase/firestore"; 

export const ItemContext = createContext();

export function useValue (){
    const value = useContext(ItemContext);
    return value;
};

function CustomItemContext({children}){
    const [logIn, setLogIn] = useState(true);
    const [itemsData, setItemsData] = useState([]);
    const [onCart, setOnCart] = useState([]);
    const [cartTotal, setCartTotal] = useState(0);
    const [onPurchase, setOnPurchase] = useState([]);
    const [selectedCategoryFilters, setSelectedCategoryFilters] = useState(["men's clothing", "women's clothing", "electronics", "jewelery"]);
    const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
    const [searchName, setSearchName] = useState('');
    
    useEffect(() => {
        fetch('https://fakestoreapi.com/products')
            .then(res=>res.json())
            .then(json=> 
                setItemsData(json));
    }, []);

    useEffect(()=> {
        const cartRef = collection(db, "cart");
        const orderRef = collection(db, "orders");
        const unsubscribe1 = onSnapshot(cartRef, snapShot => {
            const cart = snapShot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setOnCart( cart );
            // const filteredItems = itemsData.filter((item) => {
            //     return selectedFilters.includes(item.category);
            //   });
            console.log(onCart)
           
        });
        const unsubscribe2 = onSnapshot(orderRef, snapShot => {
            const order = snapShot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setOnPurchase( order );
            console.log(onPurchase)
        });
        return () => {
            unsubscribe1();
            unsubscribe2();
        };
    },[]);

    async function logInbtn(data) {
      const collectionRef = collection(db, "ids");
      try {
        const querySnapshot = await getDocs(collectionRef);
        querySnapshot.forEach((doc) => {
          const docData = doc.data();
          console.log(docData)
          console.log(data)
          if (data.email === docData.email && data.password === docData.password) {
            setLogIn(true);
            document.location.href = "http://localhost:3000/";
          }else{
            console.log("invalid data")
          }
        });
      } catch (error) {
        console.error("Error getting documents: ", error);
      }
    }
    

    function logOut (){
      setLogIn(false);
    }

    async function signUp(data){
      const idRef = collection(db, "ids")
      if(data.pass1 === data.pass2){
        await addDoc(idRef, {
          email: data.email,
          password: data.pass1,
        });
        setLogIn(true);
            document.location.href = "http://localhost:3000/";
      }else{
        console.log("pass1 and pass2 not matched!")
      }
        
    }

    async function addToCart (item){
        // setOnCart(prev => [...prev,{item, qty: 1}]);
        // setCartTotal(cartTotal + item.price)
        // console.log(onCart)
        const cartRef = collection(db, "cart")
        await addDoc(cartRef, {
            items: item,
            qty: 1,
            dateExample: Timestamp.fromDate(new Date()),
          });
        // const totalRef = new DocumentReference(db, "totalPrice", "total", "total")
        // await updateDoc(totalRef, {
        //     total: item.price
        //   });
          setCartTotal(cartTotal + item.price)
        //   console.log()
    }

    async function addQty(item){
        // const index = onCart.findIndex((i)=> i.item.id === item.item.id)
        // onCart[index].qty ++
        // setOnCart(onCart);
        // setCartTotal(cartTotal + item.item.price);
        const cartRef = doc(db, "cart", item.id);
        await updateDoc(cartRef, {
            qty: item.qty + 1
          });
        setCartTotal(cartTotal + item.price);
          
    }



    async function removeFromCart(item){
        // console.log(item)
        // const index = onCart.findIndex((i)=> i.item.id === item.item.id)
        // console.log(index)
        // setCartTotal(cartTotal - (item.item.price * item.qty) );
        // onCart.splice(index,1)
        // setOnCart(onCart)
        await deleteDoc(doc(db, 'cart', item.id));;
        setCartTotal(cartTotal - (item.price * item.qty) );


    }

    async function removeQty(item){
        // const index = onCart.findIndex((i)=> i.item.id === item.item.id)
        if (item.qty > 1 ){
        // onCart[index].qty --
        // setOnCart(onCart);
        // setCartTotal(cartTotal - item.item.price);
        const cartRef = doc(db, "cart", item.id);
        await updateDoc(cartRef, {
            qty: item.qty - 1
          });
          setCartTotal(cartTotal - item.price);
    
    }
        else{
            removeFromCart(item)
        }
    }

    // function clearCollection(path) {
    //     const ref = firestore.collection(path)
    //     ref.onSnapshot((snapshot) => {
    //       snapshot.docs.forEach((doc) => {
    //         ref.doc(doc.id).delete()
    //       })
    //     })
    //   }

    async function addToOrder(order){
        // setOnPurchase(prev=> [...prev,{onCart, date: new Date()}])
        // setOnCart([])
        // console.log(onPurchase);
        // const newOrder = {
        //     onCart: [...onCart],  // Copy the current cart.
        //     date: new Date().toISOString()  // Get a string representation of the date.
        // };
    
        // // Add the new order to the list of purchases.
        // setOnPurchase(prev => [...prev, newOrder]);
    
        // // Reset the shopping cart.
        // setOnCart([]);
        const orderRef = collection(db, "orders");
        
        await addDoc(orderRef, {
            order: order,
            date: new Date().toISOString().slice(0, 10),
          });

        const collectionRef = collection(db, "cart");
          getDocs(collectionRef)
            .then((querySnapshot) => {
              querySnapshot.forEach((doc) => {
                removeFromCart(doc)
              });
            })
            .catch((error) => {
              console.error("Error getting documents: ", error);
            });
          
    }

    const handleCheckboxChange = (category) => {
        setSelectedCategoryFilters((prevFilters) =>
          prevFilters.includes(category)
            ? prevFilters.filter((f) => f !== category)
            : [...prevFilters, category]
        );
      };
    
      const handlePriceRangeChange = (event) => {
        const { value } = event.target;
        setPriceRange((prevRange) => ({ ...prevRange, max: parseFloat(value) }));
      };

      const handleNameChange = (event) => {
        setSearchName(event.target.value);
      };
    
    return(
        <ItemContext.Provider value={
            { logIn, logOut, signUp, logInbtn, itemsData, setItemsData, addToCart, onCart, cartTotal, removeFromCart, addQty, removeQty, 
                onPurchase, addToOrder, handleCheckboxChange, handlePriceRangeChange, selectedCategoryFilters, setSelectedCategoryFilters,
            priceRange, handleNameChange, searchName}
        }>
            {children}
        </ItemContext.Provider>
    )


}

export default CustomItemContext;
