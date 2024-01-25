import React from "react";
import Schedule from "../components/Schedule";

export default class SchedulePage extends React.Component {
  render() { return (
    <section className="flex justify-center items-center" id="home">
    <div className="absolute inset-0 bg-gradient-to-tr from-third to-fifth -z-10 opacity-50"></div>
      <Schedule/>
    </section>
  )}
}