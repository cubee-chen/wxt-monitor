// src/components/References.jsx
import { useState } from 'react';

const References = () => {
  const referenceLinks = [
    {
      title: "Interactive Fish Website",
      url: "https://fish.leixf.cn/",
      description: "An interactive website with fish animations similar to our water effects."
    },
    {
      title: "Taiwan Weather Observation Network",
      url: "https://www.cwa.gov.tw/V8/C/W/OBS_Station.html?ID=A0A01",
      description: "Central Weather Administration's observation station data."
    },
    {
      title: "Video Reference",
      url: "https://r.mtdv.me/videos/-YAidd3aa6",
      description: "Video reference for weather monitoring systems."
    },
    {
      title: "Weather Data Visualization Guide",
      url: "https://www.weatherapi.com/",
      description: "Reference for weather data visualization techniques."
    },
    {
      title: "Weather Animation Resources",
      url: "https://www.metoffice.gov.uk/",
      description: "Resources for creating realistic weather animations."
    }
  ];

  return (
    <div className="references-page">
      <div className="references-content">
        <h2>References & Resources</h2>
        <p>These resources were used or inspired the development of this weather monitoring system:</p>
        
        <ul className="reference-list">
          {referenceLinks.map((link, index) => (
            <li key={index} className="reference-item">
              <a href={link.url} target="_blank" rel="noopener noreferrer" className="reference-link">
                {link.title}
              </a>
              <p className="reference-description">{link.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default References;