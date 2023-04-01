import React from 'react'

import './Loader.css'

const Loader = (props) => {
    return (
        <div class="loader">
            <svg>
                <defs>
                    <filter id="goo">
                        <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
                        <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 5 -2" result="gooey" />
                        <feComposite in="SourceGraphic" in2="gooey" operator="atop" />
                    </filter>
                </defs>
            </svg>
        </div>
    )
}

const WhiteBoxLoader = () => {
    return(
        <div className="white-loader">
            <Loader></Loader>
        </div>
    )
}

export default Loader;
export {WhiteBoxLoader};