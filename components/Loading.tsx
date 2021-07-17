import { Circle } from "better-react-spinkit";

export default function Loading() {
  return (
    <div
      style={{
        textAlign: "center",
        display: "grid",
        placeItems: "center",
        height: "100vh",
      }}
    >
      <div>
        <img
          src="https://i.imgur.com/Kwhqqqn.png"
          height={150}
          width={200}
          style={{ marginBottom: 10 }}
        />
        <Circle color="#3CBC28" />
      </div>
    </div>
  );
}
