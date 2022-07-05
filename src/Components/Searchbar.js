import React from "react"
import "./Searchbar.css"
import { useEffect, useState } from "react"
import axios from 'axios'
import SearchIcon from '@mui/icons-material/Search'

export default function Searchbar() {
    const [state, setState] = useState({loading: false, hits: [] })
    console.log("Render")

    useEffect(() => {
        // const fetchData = async () => {
        //   const result = await axios(
        //     'https://hn.algolia.com/api/v1/search?query=redux',
        //   );
    
        //   setData(result.data);
        // };
    
        // fetchData();
        console.log(state)
      }, [state]);

    const [filteredData, setFilteredData] = useState([])

    function HandleFilter(event) {
        // const searchTitle = event.target.value
        // const newFilter = data.hits.filter((value) => {
        //     return value.title.toLowerCase().includes(searchTitle.toLowerCase())
        // })
        // if (searchTitle === "") {
        //     setFilteredData([])
        // } else {
        //     setFilteredData(newFilter)
        // }
        setState((state) => ({...state, loading: true}))
        let url = new URL('https://hn.algolia.com/api/v1/search')
        url.searchParams.append("query", event.target.value)
        axios.get(url)
            .then(results => {
                setState({loading:false, hits:results.data})
            })
            .catch((error) => {
                console.error(error);
            })
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
            {state.loading&&<div>Loading...</div>}
        </div>
    )
}