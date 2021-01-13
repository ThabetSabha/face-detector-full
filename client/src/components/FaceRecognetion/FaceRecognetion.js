import React from 'react';
import "./FaceRecognetion.css";

const FaceRecognetion = ({ imgSrc, box }) => {
    return (
        
        <div className="center">

        
            <div className="absolute center w-40 " style={{minWidth: '300px' }}>
                {imgSrc.length !== 0 ? <img id="mainimg" alt="img" src={imgSrc}  ></img> : <div></div>}
                {  //mapping through the box array to display the boxes
                    box.map((box, i) => {
                        return (
                            <div className="bounding-box grow"
                                style={{ top: box.top_row, bottom: box.bottom_row, right: box.right_col, left: box.left_col }}
                                key={i}>
                            </div>)
                    })

                }

            </div>
        </div>

    )
}









export default FaceRecognetion;