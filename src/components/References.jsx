// src/components/References.jsx
import { useState } from "react";

const References = () => {
  const referenceLinks = [
    {
      title: "中央氣象署觀測資料 @NTU",
      url: "https://www.cwa.gov.tw/V8/C/W/OBS_Station.html?ID=A0A01",
      description: "過去 24 小時資料",
    },
    {
      title: "2025 雲動實上課筆記",
      url: "https://hackmd.io/tJRdSszcTHeYs5YhyfW1IQ?both",
      description: "HackMD",
    },

    {
      title: "其他",
      url: "https://r.mtdv.me/articles/07JFw1jMuI",
      description: "???",
    },
  ];

  return (
    <div className="references-page">
      <div className="references-content">
        <h2>參考資料</h2>

        <ul className="reference-list">
          {referenceLinks.map((link, index) => (
            <li key={index} className="reference-item">
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="reference-link"
              >
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
