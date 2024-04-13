import Theme1 from "../components/theme/Theme1";
import { useState } from "react";
import { verifyString } from "../utils/verifyString";
import PerformanceLineChart from "../components/PerformanceLineChart";
import { useParams } from "react-router-dom";
import { useAtom } from "jotai";
import { userTokenAtom } from "../globalAtom";
import { getShiftsForReport } from "../api/getShiftsForReport";
import { getReport } from "../api/getReport";
import { dateToMonthDayYear } from "../utils/dateToMonthDayYear";

function PerformanceView() {
  const { employeeId } = useParams();
  const [userToken] = useAtom(userTokenAtom);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showChart, setShowChart] = useState(false);

  const [data, setData] = useState([]);
  let chartData = [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !verifyString(e.target.startDate.value) ||
      !verifyString(e.target.endDate.value)
    ) {
      alert("Please fill out all the fields");
      return;
    }
    const inputStartDate = new Date(e.target.startDate.value);
    const inputEndDate = new Date(e.target.endDate.value);
    if (inputStartDate > inputEndDate) {
      alert("Start Date should be less than End Date");
      return;
    }
    const result = await getShiftsForReport(
      userToken,
      employeeId,
      inputStartDate,
      inputEndDate
    );
    setStartDate(inputStartDate);
    setEndDate(inputEndDate);
    addDataToChart(result);
    setShowChart(true);
  };

  const addDataToChart = async (shifts) => {
    for (let i = 0; i < shifts.length; i++) {
      if (!shifts[i].report && !verifyString(shifts[i].report)) continue;
      // get a report
      const report = await getReport(userToken, shifts[i].report);
      report.value =
        report.customerSatisfactionScore +
        report.reliabilityScore +
        report.efficiencyScore +
        report.attentionToDetailScore +
        report.adaptabilityScore +
        report.problemSolvingScore +
        report.upsellingScore +
        report.professionalismScore;
      // Check if the date already exists in the chartData
      const date = dateToMonthDayYear(shifts[i].startTime);
      console.log(date);
      let sameDate = false;
      // if it does, update the value by doing an average
      for (let j = 0; j < chartData.length; j++) {
        console.log(chartData[j].date === date);
        if (chartData[j].date === date) {
          console.log(chartData);
          chartData[j].value =
            (chartData[j].value * chartData[j].shiftCount + report.value) /
            (chartData[j].shiftCount + 1);
          chartData[j].shiftCount += 1;
          sameDate = true;
          break;
        }
      }
      if (!sameDate) {
        // if it doesn't, add a new entry
        chartData.push({
          date: date,
          value: report.value,
          shiftCount: 1,
        });
        length += 1;
      }
    }
    setData(chartData);
  };

  return (
    <section className="mt-5">
      <Theme1 />

      <div className="flex flex-col items-center justify-center">
        <h1 className="text-5xl text-forth font-bold text-center mb-5">
          Performance View
        </h1>
        <form className="w-full max-w-sm" onSubmit={handleSubmit}>
          <div className="flex justify-between items-center border-b border-third py-2">
            <label htmlFor="startDate" className="mr-3 font-bold text-forth">
              Start Date
            </label>
            <input
              className="appearance-none bg-transparent border-none w-7/12 text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
              type="date"
              name="startDate"
            />
          </div>
          <div className="flex justify-between items-center border-b border-third py-2 mt-3">
            <label htmlFor="endDate" className="mr-3 font-bold text-forth">
              End Date
            </label>
            <input
              className="appearance-none bg-transparent border-none w-7/12 text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
              type="date"
              name="endDate"
            />
          </div>
          <div className="mt-5">
            <button
              className="flex-shrink-0 bg-forth hover:bg-third border-forth hover:border-third text-sm border-4 text-white py-1 px-2 rounded"
              type="submit"
            >
              Submit
            </button>
          </div>
        </form>
        {showChart && (
          <div>
            <PerformanceLineChart
              data={data}
              width={600}
              height={400}
              startDate={startDate}
              endDate={endDate}
            />
          </div>
        )}
      </div>
    </section>
  );
}

export default PerformanceView;
