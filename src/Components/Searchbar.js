import React from "react"
import "./Searchbar.css"
import { useState, useEffect } from "react"
import SearchIcon from '@mui/icons-material/Search'
import _ from "lodash";
import { fromFetch } from 'rxjs/fetch';
import { switchMap, of, catchError  } from 'rxjs';
import { fromEvent } from 'rxjs';

export default function Searchbar() {
    const [state, setState] = useState({loading: false, hits: [], input: ""})
    useEffect(() => {
        // TODO: replace id first parameter of fromEvent with a useref variable
        fromEvent(document.getElementById("testing"), "input")
            .pipe(switchMap((e) => {
                let url = new URL('https://hn.algolia.com/api/v1/search')
                url.searchParams.append("query", e.target.value)
                const $data = fromFetch(url).pipe(
                    switchMap((response) => {
                        if (response.ok) {
                            // OK return data
                            return response.json();
                        } else {
                            // Server is returning a status requiring the client to try something else.
                            return of({ error: true, message: `Error ${ response.status }` });
                        }
                    }),
                    catchError(err => {
                        // Network or other error, handle appropriately
                        console.error(err);
                        return of({ error: true, message: err.message })
                    })
                )
                return $data
            }
        )).subscribe({
            next: results => {
                // results.then((x)=> console.log("hey", x))
                // console.log("resulsts---> ", results)
                setState(state => ({ ...state, loading: false, hits: results.hits }))
            },
            error:err=>{
                console.error(err);
            },
            complete: () => console.log('done')
        });;
    }, []);

    function handleChange(event) {
        // move this code and make sure it works.
        if (event.target.value.length >= 3) {
            setState((state) => ({ ...state, loading: true,  input: event.target.value}))
            // here we were handling the requests...
        } else {
            setState(x => ({ ...x, hits: [] }))
        }
    }

    return (
        <div className="search">
            <div className="searchInput">
                {/* TODO: remove id & handlechange. Move debounce wherever must be */}
                <input
                    id="testing"
                    type="text"
                    placeholder={"Search title"}
                    onChange={_.debounce( handleChange, 500)} 
                />

                {state.hits.length === 0 && !state.loading && <div className="searchIcon"><SearchIcon /></div>}
                <div className="space"></div>
                <button>SEARCH</button>
            </div>
            {state.hits.length !== 0 && (
                <div className="dataResults">
                    {state.hits.slice(0, 5).map((value, i) => {
                        let regex = new RegExp(state.input, "gi")
                        return (
                            <a className="dataItem" target="_blank" key={i}>
                                <span className="title">{
                                    value.title?.replace(regex, x=>"<em>"+x+"</em>")
                                        .split("<em>")
                                        .map(x=>x.split("</em>"))
                                        .map((x, i)=>{return (<span key={i}>
                                            {(x.length === 1)?x[0]:<><span className="color-whatever" >{x[0]}</span>{x[1]}</>}
                                        </span>)})
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