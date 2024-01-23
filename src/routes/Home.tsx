import React from "react";
import HomeCal from "../components/HomeCal";

export default class Home extends React.Component {
  render() { return (
    <section className="relative" id="home">
      <div className="grid grid-cols-2 gap-4">
        <div className="w-1/2 min-w-36">
          test
        </div>
        <div className="w-1/2 min-w-80">
          <HomeCal/>
        </div>
      </div>
    </section>
  )}
}