import { AutoComplete, Button, Tag } from 'antd';
import { useState } from 'react';

const TeamSearchAutocomplete: React.FC<{
    allTeamNames: string[]; // An array of all teams
  }> = ({ allTeamNames }) => {
    const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [options, setOptions] = useState<string[]>([]);
  
    const handleSearch = (value: string) => {
      const filteredTeams = allTeamNames
        .filter((team) => team.toLowerCase().includes(value.toLowerCase()))
        .map((team) => team);
      setOptions(filteredTeams);
      setInputValue(value);
    };
  
    const handleSelect = (value: string) => {
      // Add the selected team to the list of selected teams
      setSelectedTeams([...selectedTeams, value]);
      setInputValue(''); // Clear the input field
      setOptions([]); // Clear the options
    };
  
    const handleInvite = () => {
      // Handle the invite action here
      // You can send the selected teams for processing or display them as needed
      console.log('Selected Teams:', selectedTeams);
    };

    const handleRemove = (teamName: string) => {
      // Remove the selected team from the list of selected teams
      setSelectedTeams(selectedTeams.filter((team) => team !== teamName));
    };
  
    return (
      <div className="team-search-autocomplete">
        <div className='flex items-center gap-3'>
          <AutoComplete
            style={{ width: 300 }}
            options={options.map((team) => ({ value: team }))}
            onSearch={handleSearch}
            onSelect={handleSelect}
            value={inputValue}
            placeholder="Search for teams"
          />
          <Button type="primary" onClick={handleInvite}>
            Invite
          </Button>
        </div>
        
        <div className="selected-teams mt-1">
          {selectedTeams.map((teamName) => (
            <Tag key={teamName} closable onClose={() => handleRemove(teamName)}>
              {teamName}
            </Tag>
          ))}
        </div>
      </div>
    );
  };
  
  export default TeamSearchAutocomplete;
  