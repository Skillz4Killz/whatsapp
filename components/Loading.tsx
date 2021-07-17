import { Circle } from "better-react-spinkit";
import Image from "next/image";

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
        <Image src="https://i.imgur.com/Kwhqqqn.png" height={150} width={200} />
        <Circle color="#3CBC28" style={{ marginTop: 10 }} />
      </div>
    </div>
  );
}
