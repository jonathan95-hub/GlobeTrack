import React, { useState } from "react";
import ListGroupComponent from "../../components/GroupPage/ListGroupComponent";
import ListGroupUserComponent from "../../components/GroupPage/ListGroupUserComponent";

const GroupPage = () => {
  const [isMyGroup, setIsMyGroup] = useState(false);
  const [whatAView, setWhatAView] = useState(false)

  const chageMygroups = () => {
  setIsMyGroup(true)
  setWhatAView(true)
  }

  const availableGroups = () => {
    setIsMyGroup(false)
    setWhatAView(false)
  }

  return (
    <div>
     
      <h2 className="text-center mb-5 mt-5 fw-bold"> Explora grupos</h2>
      <div className="d-flex justify-content-center gap-3">
        {whatAView ? (  <div>
          
     <button className="btn btn-primary" onClick={availableGroups}>
        Ir a Grupos Disponibles
     </button>
        </div>) : ( <div>
        <button className="btn btn-success"  onClick={chageMygroups}>
         Ir a Mis Grupos
        </button>
       </div>)}
      
      
      </div>
      {isMyGroup ? (<ListGroupUserComponent />) 
      :
       (<ListGroupComponent />)}
    </div>
  );
};

export default GroupPage;
