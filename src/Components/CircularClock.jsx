import React, { useEffect, useState } from "react";

const Clock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const seconds = time.getSeconds();
  const minutes = time.getMinutes();
  const hours = time.getHours() % 12;
  const secondsRotation = seconds * 6; // 360 degrees / 60 seconds
  const minutesRotation = minutes * 6 + seconds * 0.1; // 360 degrees / 60 minutes + smooth second transition
  const hoursRotation = 360 * (hours / 12) + (minutes / 60) * 30;


  return (
      <div className="relative h-60 w-60 mx-auto" style={{borderRadius: "50%", backgroundImage: "url(../../clock_bg2.png)", zIndex: 10, backgroundSize: 'cover', backgroundRepeat: 'no-repeat'}}>
        {/* seconds */}
        <div className="absolute bg-[red] h-24 w-[0.1rem] left-[50%] top-[10%]" style={{transform: "translate(-50%, 0%)", transformOrigin: 'bottom', rotate: `${secondsRotation}deg`}}></div>

        {/* minutes */}
        <div className="absolute bg-black h-24 w-[0.2rem] left-[50%] top-[10%]" style={{transform: "translate(-50%, 0%)", transformOrigin: 'bottom', rotate: `${minutesRotation}deg`}}></div>

        {/* hours */}
        <div className="absolute bg-black h-16 w-[0.25rem] left-[49%] top-[23%]" style={{transform: "translate(-50%, 0%)", transformOrigin: 'bottom', rotate: `${hoursRotation}deg`}}></div>

        <div className="absolute bg-black h-3 w-3 top-[50%] left-[50%]" style={{transform: "translate(-50%, -50%)", borderRadius: '50%'}}></div>

    </div>
  );
};

export default Clock;
