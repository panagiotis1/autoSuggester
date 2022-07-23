import React from "react"
import "./Searchbar.css"
import { useState, useEffect, useRef } from "react"
import SearchIcon from '@mui/icons-material/Search'
import { fromFetch } from 'rxjs/fetch';
import { switchMap, of, catchError, debounce, interval  } from 'rxjs';
import { fromEvent } from 'rxjs';

export default function Searchbar() {
    const [state, setState] = useState({loading: false, hits: [], input: "", error: {value: false, message: ""}})
    const elemRef = useRef(null);
    useEffect(() => {
        fromEvent(elemRef.current, "input")
            .pipe(debounce(()=>interval(200)))
            .pipe(switchMap((e) => {
                if (e.target.value.length >= 3) {
                    setState((state) => ({ ...state, loading: true,  input: e.target.value}))
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

                } else {
                    return of({hits:[]})
                }
        })).subscribe({
            next: results => {
                setState(state => ({
                    ...state,
                    loading: false,
                    hits: results.hits || [],
                    error: {
                        value: results.error,
                        message: results.message || ""
                    }
                }))
            },
            error: err => {
                console.error(err);
            },
            complete: () => console.log('done')
        });
        return () => console.log("clean up function"); 
    }, []);
    

    return (
        <div className="search">
            <div className="searchInput">
                <input
                    ref={elemRef}
                    type="text"
                    placeholder={"Search title"}
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
            {state.error.value && <div>{state.error.message}</div>}
        </div>
    )
}