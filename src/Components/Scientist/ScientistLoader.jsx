import React from 'react'

const ScientistLoader = ({message}) => {
    return (
        <div className="flex items-center justify-center flex-col gap-4 pt-40">
          <div className="scientistNormalLoader"></div>
          <h1 className="text-xl font-semibold text-gray-700 animate-pulse">{message?message:"Loading..."}</h1>
        </div>
      );
      
}

export default ScientistLoader