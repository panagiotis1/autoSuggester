import React from "react"
import "./Searchbar.css"
import { useEffect, useState } from "react"
import axios from 'axios'
import SearchIcon from '@mui/icons-material/Search'

export default function Searchbar() {
    const [data, setData] = useState({ hits: [] })    
    console.log(data)
    console.log("RE-render")
    // function loadActivity() {
    //     fetch("https://jsonplaceholder.typicode.com/posts")
    //         .then((response) => response.json())
    //         .then((json) => {
    //             console.log(json)
    //             setData(json)
    //         });
    // }

    useEffect(() => {
        const fetchData = async () => {
          const result = await axios(
            'https://hn.algolia.com/api/v1/search?query=redux',
          );
    
          setData(result.data);
        };
    
        fetchData();
      }, []);

    const [filteredData, setFilteredData] = useState([])

    function HandleFilter(event) {
        const searchTitle = event.target.value
        const newFilter = data.hits.filter((value) => {
            return value.title.toLowerCase().includes(searchTitle.toLowerCase())
        })
        if (searchTitle === "") {
            setFilteredData([])
        } else {
            setFilteredData(newFilter)
        }
    }

    return (
        <div className="search">
            <div className="searchInput">
                <input type="text" placeholder={"Search title"} onChange={HandleFilter}/>
                <div className="searchIcon">
                    { filteredData.length === 0 ? <SearchIcon /> : ""}
                </div>
                <button>SEARCH</button>
            </div>
            {filteredData.length !== 0 && (
                <div className="dataResults">
                    {filteredData.slice(0, 5).map((value, key) => {
                            return (
                                <a className="dataItem" key={value.objectID} target="_blank">
                                    <p>{value.title}</p>
                                </a>
                            )
                        }
                    )}
                </div>
            )}
        </div>
    )
}