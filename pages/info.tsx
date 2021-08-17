import React, { useState } from "react";
import DefaultHead from "../components/default/DefaultHead";
import DefaultHeader from "../components/default/DefaultHeader";
import DefaultFooter from "../components/default/DefaultFooter";
import DefaultNav from "../components/default/DefaultNav";
import CardStat from "../components/info/CardStat";
import Calendar from "../components/Calendar";
import { faEye, faGlobe, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import DoughnutCard from "../components/info/DoughnutCard";

export default function Info() {
  const [value, onChange] = useState(new Date());
  return (
    <>
      <DefaultHead>
        <title>Mortis Info</title>
      </DefaultHead>

      <DefaultHeader info />

      <div className="container">
        <div className="card-group mt-2 mb-4">
          <CardStat title="New users" value={55} gain={-64} icon={faUserPlus} />
          <CardStat title="Views" value={55} gain={64} icon={faEye} />
          <CardStat title="Countries" value={55} icon={faGlobe} />
        </div>

        <div className="row">
          <div className="col-lg-4 col-md-12">
            <DoughnutCard title="Sample text" />
          </div>
          <div className="col-lg-4 col-md-12">
            {/* <Calendar onChange={onChange} value={value} /> */}
          </div>
        </div>
      </div>

      <DefaultFooter name="Menu">
        <ul className="list-unstyled">
          <DefaultNav style="text-muted" />
        </ul>
      </DefaultFooter>
    </>
  );
}
