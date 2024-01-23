import React from "react";
import HomeCal from "../components/HomeCal";

export default class Home extends React.Component {
  render() { return (
    <div>
      <span style={{width: "50%"}}>
        test
      </span>
      <span style={{width: "50%", minWidth :"400px"}}>
        <HomeCal/>
      </span>
    </div>
)}
}