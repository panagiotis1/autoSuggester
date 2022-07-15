import React from "react"
import "./Searchbar.css"
import { useEffect, useState } from "react"
import axios from 'axios'
import SearchIcon from '@mui/icons-material/Search'
//import useDebounce from "../useDebounce"
import _ from "lodash";

export default function Searchbar() {
    const [state, setState] = useState({loading: false, hits: [], input: ""})
    // const debouncedSearch = useDebounce(state.input, 500)
    // console.log("Render")

    // useEffect((event) => {
    //     console.log("The State is ---> ", state)
    //     let url = new URL('https://hn.algolia.com/api/v1/search')
    //     url.searchParams.append("query", state.input)
    //     console.log("event.target.value--->", state.input)
    //     axios.get(url)
    //         .then(results => { console.log("resulsts---> ", results)
    //             setState(state => ({ ...state, loading: false, hits: results.data.hits }))
    //         })
    //         .catch((error) => {
    //             console.error(error);
    //         })
    // }, [debouncedSearch]);

    function HandleChange(event) {
        if (event.target.value.length >= 3) {
            setState((state) => ({ ...state, loading: true,  input: event.target.value}))
            let url = new URL('https://hn.algolia.com/api/v1/search')
            url.searchParams.append("query", event.target.value)
            console.log("event.target.value--->", event.target.value)
            axios.get(url)
                .then(results => { console.log("resulsts---> ", results)
                    setState(state => ({ ...state, loading: false, hits: results.data.hits }))
                })
                .catch((error) => {
                    console.error(error);
                })
        } else {
            setState(x => ({ ...x, hits: [] }))
        }
    }

    return (
        <div className="search">
            <div className="searchInput">
                <input
                    type="text"
                    placeholder={"Search title"}
                    onChange={_.debounce( HandleChange, 500)}
                />
                {state.hits.length === 0 && !state.loading && <div className="searchIcon"><SearchIcon /></div>}
                <div className="space"></div>
                <button>SEARCH</button>
            </div>
            {state.hits.length !== 0 && (
                <div className="dataResults">
                    {state.hits.slice(0, 5).map((value) => {
                        let regex = new RegExp(state.input, "gi")
                        return (
                            <a className="dataItem" target="_blank">
                                <span className="title">{
                                //  value._highlightResult.title?.value
                                //      .split("<em>")
                                //      .map(x=>x.split("</em>"))
                                //     .map(x=>{return ((x.length === 1)?x[0]:<><span className="color-whatever">{x[0]}</span>{x[1]}</>)})
 
                                    //value.title


                                    value.title?.replace(regex, x=>"<em>"+x+"</em>")
                                        .split("<em>")
                                        .map(x=>x.split("</em>"))
                                        .map(x=>{return ((x.length === 1)?x[0]:<><span className="color-whatever">{x[0]}</span>{x[1]}</>)})
                                        // .map(x=>(x.length === 1)?x.join(""):`${x[0]}</span>${x[1]}`)
                                        // .map((x,i)=>i===0?x:`<span className="color-whatever">${x}`)
                                        // .join("")


                                }</span>
                                <p className="itemInfo">{value.points} points | by {value.author} | {value.num_comments} comments</p>
                            </a>
                        )
                    }
                    )}
                </div>
            )}
            {state.loading && <div>Loading...</div>}
        </div>
    )
}