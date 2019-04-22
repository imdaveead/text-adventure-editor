// spell-checker:words doesn
import React from 'react';

export const changelogData = [
  {
    name: '0.1.2',
    beta: true,
    info: [
      '[Game+Editor] Display errors when viewing or editing a scene that doesn\nt exist.',
    ]
  },
  {
    name: '0.1.1',
    beta: true,
    info: [
      '[Editor] Rename Projects',
    ]
  },
  {
    name: '0.1.0',
    beta: true,
    info: [
      '[Editor] Temporary UI',
      '[Game] Rebuilt Game Engine',
      'Initial Version',
    ]
  }
]

function Changelog() {
  return <div>
    <h2>Changelog</h2>    
    {
      changelogData.map((version, i) => {
        return <React.Fragment key={i}>
          <h3>{version.name}{version.beta && ' (beta)'}</h3>
          <ul>
            {version.info.map((item, i) => {
              return <li key={i}>{item}</li>;
            })}
          </ul>
        </React.Fragment>;
      })
    }
  </div>;
}

export default Changelog;
