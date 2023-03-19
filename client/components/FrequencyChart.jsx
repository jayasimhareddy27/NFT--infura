import React, { useContext, useEffect,useRef,useState } from "react";
import { NFTContext } from "../context/NFTContext";
import Chart from 'chart.js/auto';

const FrequencyChart = () => {
  const canvasEl = useRef(null);
  const {freq } = useContext(NFTContext);
  const [activeSelect, setActiveSelect] = useState('Months');

  const colors = {
    purple: {
      default: "rgba(149, 76, 233, 1)",
      half: "rgba(149, 76, 233, 0.5)",
      quarter: "rgba(149, 76, 233, 0.25)",
      zero: "rgba(149, 76, 233, 0)"
    },
  };

  
  useEffect(() => {
    const ctx = canvasEl.current.getContext("2d");
    const gradient = ctx.createLinearGradient(0, 16, 0, 600);
    gradient.addColorStop(0, colors.purple.half);
    gradient.addColorStop(0.65, colors.purple.quarter);
    gradient.addColorStop(1, colors.purple.zero);
    const labels = activeSelect==="Months"?freq?.MONTHS?.MONTHS:activeSelect==="Days"?freq?.DAYS?.DAYS:freq?.YEARS?.YEARS
    const data = {
      labels: labels,
      datasets: [
        {
          type: "bar",
          backgroundColor: gradient,
          label: `Freqence: ${activeSelect==="Months"?freq?.MONTHS?.MONTHS:activeSelect==="Days"?freq?.DAYS?.DAYS:freq?.YEARS?.YEARS}`,
          data: activeSelect==="Months"?freq?.MONTHS?.M:activeSelect==="Days"?freq?.DAYS?.D:freq?.YEARS?.Y,
          fill: true,
          borderWidth: 2,
          borderColor: colors.purple.default,
          lineTension: 0.2,
          pointBackgroundColor: colors.purple.default
        }
      ]
    };
    const config = {
      data: data
    };
    const myLineChart = new Chart(ctx, config);
    
    return function cleanup() {
      myLineChart.destroy();
    };
  });
  
  return (
    <>
      <div className="flex">
      
      <div className=" pb-6">
        
        <div  className="sm:w-[18rem] w-[40rem] sm:h-56">
        <canvas id="myChart" ref={canvasEl} />

        </div>
      </div>
      
        <div className=" dark:bg-nft-black-1 bg-white border dark:border-nft-black-2 border-nft-gray-2 px-4 rounded-md">
          {['Days', 'Months', 'Years'].map((item) => (
            <p className={"font-poppins dark:text-white text-nft-black-1 font-normal text-xs my-3 cursor-pointer "+`${ activeSelect===item?'bg-blue-600 rounded-md p-2':''}`} 
            onClick={() => setActiveSelect(item)} key={item}>
              {item}
            </p>
          ))}
        </div>
        

      </div>
    </>
  );

}
export default FrequencyChart;