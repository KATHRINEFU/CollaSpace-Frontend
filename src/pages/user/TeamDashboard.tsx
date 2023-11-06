import { useParams } from "react-router-dom";

function TeamDashboard() {
  const { teamId } = useParams();

  // Team Dashboard:

  return (
    <>
      <h1>Team Dashboard</h1>
      <p>Team Id: {teamId}</p>
    </>
  );
}

export default TeamDashboard;
