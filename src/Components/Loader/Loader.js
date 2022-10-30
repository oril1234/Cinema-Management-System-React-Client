//Loading spinner component to display until data is gathered in the page

import { useState } from "react";
import {BarLoader} from "react-spinners";

const override = {
  display: "block",
  margin: "0 auto",
  borderColor: "blue",
};

function Spinner() {
  let [loading] = useState(true);
  let [color] = useState("blue");

  return (
    <div>

      <BarLoader

        color={color}
        loading={loading}
        cssOverride={override}
        size={150}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </div>
  );
}

export default Spinner;