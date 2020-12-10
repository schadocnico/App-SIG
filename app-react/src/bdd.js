import React, { Fragment, useState, useEffect } from 'react';

const Bdd = () => {
    useEffect(() => {
        const getAPI = () => {
            // Change this endpoint to whatever local or online address you have
            // Local PostgreSQL Database
            //const API = 'http://176.169.46.223:5000/';
            const API='http://localhost:5000';

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
        getAPI();
    }, []);
    const [apiData, setApiData] = useState([]);
    const [loading, setLoading] = useState(true);
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
                        {apiData.map((salle) => {

                            return (
                                <div className="salle-container" key={String(salle.salle)}>
                                    <p>{salle.fonction} {salle.salle}</p>
                                </div>
                            );
                        })}
                    </section>
                )}
            </main>
        </Fragment>
    );
};

export default Bdd;