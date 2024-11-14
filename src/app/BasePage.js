import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute, LayoutSplashScreen } from "../_metronic/layout";
import { getUserInfo } from "../utils/user.util";
import PersönlicheDaten from "../_metronic/components/persönlicheDaten/index.js";
import Mitteilungen from "../_metronic/components/Mitteilungen/index.js";
import EingereichteLeads from "../_metronic/components/EingereichteLeads/index.js";
import Verfügbarkeit from "../_metronic/components/Verfügbarkeit/index.js";
import AllEingereichteLeads from "../_metronic/components/AllEingereichteLeads/index.js";
import Team from "../_metronic/components/Team/index.js";
import VattenfallTeam from "../_metronic/components/VattenfallTeam/index.js";
import VattelnFallLead from "../_metronic/components/vattelnFallLead/index.jsx";
import NeueLeads from "../_metronic/components/NeueLeads/index.js";
import Projekte from "../_metronic/components/Projekte/index.js";
import Archive from "../_metronic/components/Archive/index.js";
import Calendar from "../_metronic/components/Calendar/index.js";
import AddNewLead from "../_metronic/components/AddNewLead/index.js";


export default function BasePage() {
  let userInfo = getUserInfo();
  return (
    <>
      {userInfo.role === "user" ? (

        <Suspense fallback={<LayoutSplashScreen />}>
          <Switch>
            <Redirect exact from="/" to="/eingereichteLeads" />
            <ContentRoute
              exact
              path="/persönlicheDaten"
              component={PersönlicheDaten}
            />
            <ContentRoute exact path="/mitteilungen" component={Mitteilungen} />
            <ContentRoute
              exact
              path="/eingereichteLeads/:id"
              component={EingereichteLeads}
            />
            <ContentRoute
              exact
              path="/eingereichteLeads"
              component={EingereichteLeads}
            />
            <ContentRoute
              exact
              path="/verfügbarkeit"
              component={Verfügbarkeit}
            />
            <ContentRoute
              exact
              path="/alleingereichteLeads"
              component={AllEingereichteLeads}
            />
             <ContentRoute
              exact
              path="/wattfoxteam"
              component={Team}
            />
             <ContentRoute
              exact
              path="/vattenfallteam"
              component={VattenfallTeam}
            />
             <ContentRoute
              exact
              path="/vattenlead"
              component={VattelnFallLead}
            />
            <ContentRoute
              exact
              path="/newlead"
              component={NeueLeads}
            />
            <ContentRoute
              exact
              path="/projekte"
              component={Projekte}
            />
            <ContentRoute
              exact
              path="/archive"
              component={Archive}
            />
             <ContentRoute
              exact
              path="/calendar"
              component={Calendar}
            />
            <ContentRoute
              exact
              path="/addNewlead"
              component={AddNewLead}
            />
            
          </Switch>

        </Suspense>
      ) : (
        <Suspense fallback={<LayoutSplashScreen />}>
          <Switch>
            <Redirect to="error/error-v6" />
          </Switch>
        </Suspense>
      )}
    </>
  );
}
