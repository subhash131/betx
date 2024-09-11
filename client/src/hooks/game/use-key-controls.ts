// "use client";
// import { useRoom } from "@/providers/room-provider";
// import { useEffect } from "react";

// export const useKeyControls = () => {
//   const { setKeys } = useRoom();

//   useEffect(() => {
//     document.addEventListener("keydown", handleKeydown);
//     document.addEventListener("keyup", handleKeyup);
//     return () => {
//       document.removeEventListener("keydown", handleKeydown);
//       document.removeEventListener("keyup", handleKeyup);
//     };
//   }, []);
// };
