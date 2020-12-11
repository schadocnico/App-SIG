import React, { Fragment, useState, useEffect } from 'react';

const Bdd = () => {

    useEffect(() => {
        getAPI();
    }, []);

    const getAPI = () => {
        // Change this endpoint to whatever local or online address you have
        // Local PostgreSQL Database
        const API = 'http://176.169.46.223:5000/';

        fetch(API)
            .then((response) => {
                console.log(response);
                return response.json();
            })
            .then((data) => {
                console.log(data);
                setLoading(false);
                setApiData(data);
            });
    };

    const patchSalle = () => {
        // Change this endpoint to whatever local or online address you have
        // Local PostgreSQL Database

        const requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fonction: valueInput })
        };
        const API = 'http://176.169.46.223:5000/change/'+idSelect;

        fetch(API, requestOptions)
            .then((response) => {
                console.log(response);
                return response.json();
            })
            .then((data) => {
                setValueInput(data);
                getAPI();
            });
    };

    const [apiData, setApiData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [valueInput, setValueInput] = useState("");
    const [idSelect, setIdSelect] = useState(1);
    return (
        <Fragment>
            <header>
                <h1>Les salles</h1>
            </header>
            <main>
                {loading === true ? (
                    <div>
                        <h1>Loading...</h1>
                    </div>
                ) : (
                    <section>
                        <form>
                            <select value={idSelect} onChange={(event) => setIdSelect(event.target.value)}>
                                {apiData.map((salle) => {

                                    return (
                                    
                                        <option value={salle.id}>{salle.fonction}</option>
                                    
                                    );
                                })}
                            </select>
                            <input type="text" value={valueInput} onChange={(event) => setValueInput(event.target.value)} />
                            <input type="submit" onClick={() => patchSalle()}/>
                        </form>
                    </section>
                )}
            </main>
        </Fragment>
    );
};

export default Bdd;
