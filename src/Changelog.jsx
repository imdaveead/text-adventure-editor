import React from 'react';

export const changelogData = [
  {
    name: '0.1.0',
    beta: true,
    info: [
      'Initial Release',
      'Temporary Editor UI',
      'Rebuilt Game Engine',
    ]
  }
]

function Changelog() {
  return <div>
    <h2>Changelog</h2>    
    {
      changelogData.map((version) => {
        return <>
          <h3>{version.name}</h3>
          <ul>
            {version.info.map((item) => {
              return <li>{item}</li>;
            })}
          </ul>
        </>;
      })
    }
  </div>;
}

export default Changelog;
