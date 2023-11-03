import { useParams } from "react-router-dom";

function TeamDashboard() {
    const { teamId } = useParams();
    
    // Now, you can use the teamName variable in your component.
    
    return (
      <>
        <h1>Team Dashboard</h1>
        <p>Team Id: {teamId}</p>
      </>
    );
  }
  
export default TeamDashboard;
  