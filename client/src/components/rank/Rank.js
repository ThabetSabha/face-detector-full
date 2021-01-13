import React from 'react';

function capitalizeFirstLetter(string) {          // to capitalize the first letter of the name.
    return string.charAt(0).toUpperCase() + string.slice(1);
}


const Rank = ({ name, entries }) => {
    return (<>
        { name === 'Guest' ?

            <div className="f3 white">
                Welcome!
                </div>


            :

            <>
                <div className="f3 white">
                    {capitalizeFirstLetter(name)}, Your current entry count is...
            </div>
                <div className=" f2 white">
                    {entries}
                </div>
            </>}

    </>)

}



export default Rank;