import { Tab } from "@/Constants/type";

let globalNavState: Tab = "Home";

export function getglobalNavState() {
  return globalNavState;
}

export function setglobalNavState(tab: Tab) {
  globalNavState = tab;
}
