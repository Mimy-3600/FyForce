import ClassBox from "./classBox";

export default function TopThree({ topPlayers }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 items-end">
      {topPlayers.map((player) => (
        <ClassBox key={player.email} player={player} />
      ))}
    </div>
  );
}