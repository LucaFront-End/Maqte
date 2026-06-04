import { useContext } from "react";
import { WixCartContext } from "../context/WixCartContext";

/**
 * Access the Wix client and its readiness state.
 */
export const useWixClient = () => {
  const { wixClient, isReady } = useContext(WixCartContext);
  return { wixClient, isReady };
};
