export default function Sparkline({ color = "green" }) {
  const themes = {
    green: { stroke: "#4ade80", shadow: "rgba(74, 222, 128, 0.5)" },
    amber: { stroke: "#fbbf24", shadow: "rgba(250, 204, 21, 0.5)" },
    blue: { stroke: "#38bdf8", shadow: "rgba(56, 189, 248, 0.5)" },
  };

  const { stroke, shadow } = themes[color] || themes.green;

  return (
    <div className="w-full h-6 mt-2 overflow-visible">
      <svg 
        viewBox="0 0 400 30" 
        className="w-full h-full overflow-visible" 
        preserveAspectRatio="none"
      >
        <defs>
          <filter id={`glow-${color}`}>
            <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        
        <path
          /* M 20 20: Start 5% (20 units) in from the left
             L 190 20: Horizontal line to just before middle
             L 210 10: The "kink" transition
             L 380 10: End 5% (20 units) before the right edge
          */
          d="M 20 20 L 190 20 L 210 10 L 380 10" 
          fill="none"
          stroke={stroke}
          strokeWidth="2.5"
          filter={`url(#glow-${color})`}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="drop-shadow-lg"
        />
      </svg>
    </div>
  );
}