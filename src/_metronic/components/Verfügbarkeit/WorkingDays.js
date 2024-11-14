import React from "react";
import { Doughnut } from "react-chartjs-2";

const WorkingDays = ({ currentDatePercentage }) => {
  const ourdata = {
    labels: ["aktuell", "Arbeitstage"],
    datasets: [
      {
        data: [currentDatePercentage, currentDatePercentage === 0 ? 100 : 100 - currentDatePercentage],
        backgroundColor: ["#2C4570", "#F0F0F0"],
        borderWidth: 0,
      },
    ],
  };
  const ouroptions = {
    cutout: "80%",
    plugins: {
      tooltip: {
        enabled: false,
      },
      legend: {
        display: false,
      },
    },
  };
  return (
    <section className="working-days">
      <div className="tittle">
        <h2>Arbeitstage diesen Monat</h2>
      </div>
      <div className="white-box-chart">
        <div className="working-circle-main">
          <Doughnut data={ourdata} options={ouroptions} />
          <div className="working-circle-inner-font">
            {currentDatePercentage?.toFixed(2)}%
            <div
              style={{
                fontSize: "14px",
                color: "#2C4570",
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              Bereitschaft
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WorkingDays;
