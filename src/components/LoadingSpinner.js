import React from "react";

import { ClipLoader } from "react-spinners";

function LoadingSpinner() {
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <ClipLoader color="#060606" loading={true} size={40} />
    </div>
  );
}

export default LoadingSpinner;
