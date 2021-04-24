import React from 'react';

import { css } from "@emotion/core";
import ClipLoader from "react-spinners/ClipLoader";

const Loader =({isLoading})=>{
 return isLoading && <div className="Loader" >
   <ClipLoader color="#fff" loading={isLoading}  size={150} />
 </div>
}

export default Loader;