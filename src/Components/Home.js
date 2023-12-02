import React, {useEffect, useState} from "react";
import styles from "../styles/Home.module.css"
import { useValue } from '../context';
import Items from "./Items";
// import Data from "../Data/data"

const Home = ()=>{
    const {itemsData, selectedCategoryFilters, priceRange, handlePriceRangeChange, handleCheckboxChange, searchName, handleNameChange} = useValue();

    // const filteredItems = itemsData.filter((item) => {
    //     // Check if the item's category is among the selected filters
    //     return selectedFilters.includes(item.category);
    //   });

    const filteredItems = itemsData.filter((item) => {
        const categoryFilter =
          selectedCategoryFilters.length === 0 ||
          selectedCategoryFilters.includes(item.category);

        const priceFilter =
          item.price >= priceRange.min && item.price <= priceRange.max;

        const nameFilter = item.title.toLowerCase().includes(searchName.toLowerCase());

          return categoryFilter && priceFilter && nameFilter;
      });

    return(
        <>
        <div className={styles.container}>
            <div className={styles.sideContainer}>
                <div className={styles.filterContainer}>
                    <div className={styles.filterhead}>
                    <h3>Filter</h3>
                    <label className={styles.filterhead}>
                        Price Range: {priceRange.max * 80}
                        <input
                        type="range"
                        name="max"
                        value={priceRange.max}
                        min={0}
                        max={1000}
                        onChange={handlePriceRangeChange}
                        />
                        
                    </label>
                    </div>
                    <div className="catagory">
                    <label>
                        <input
                        type="checkbox"
                        value="men's clothing"
                        checked={selectedCategoryFilters.includes("men's clothing")}
                        onChange={() => handleCheckboxChange("men's clothing")}
                        
                        />
                        Men's Clothing
                    </label><br/>
                    <label>
                    <input
                        type="checkbox"
                        value="women's clothing"
                        checked={selectedCategoryFilters.includes("women's clothing")}
                        onChange={() => handleCheckboxChange("women's clothing")}
                        />
                        Women's Clothing
                    </label><br/>
                    <label>
                    <input
                        type="checkbox"
                        value="jewelery"
                        checked={selectedCategoryFilters.includes("jewelery")}
                        onChange={() => handleCheckboxChange("jewelery")}
                        />
                        Jewelery
                    </label><br/>
                    <label>
                    <input
                        type="checkbox"
                        value="electronics"
                        checked={selectedCategoryFilters.includes("electronics")}
                        onChange={() => handleCheckboxChange("electronics")}
                        />
                        Electronics
                    </label><br/>

                    </div>
                </div>
            </div>
            <div className={styles.mainContainer}>
                <div>
                <input type="text" placeholder="Search By Name" value={searchName} onChange={handleNameChange}/>
                </div>
                <div className={styles.itemsDiv}>
                {
                    filteredItems.map((item) => (
                            <Items item={item} key={item.id} />
                    ))
                }
                </div>
                
            </div>
        </div>
        </>
    )
}

export default Home;